import { parseServerEvent, type ClientEvent, type ServerEvent } from '@claude-office/shared';
import { INITIAL_BACKOFF_MS, MAX_BACKOFF_MS, buildWsUrl } from '@/configs/ws.config';
import { useArchivedStore } from '@/hooks/store/useArchivedStore';
import { useAutocompleteStore } from '@/hooks/store/useAutocompleteStore';
import { useChatStore } from '@/hooks/store/useChatStore';
import { useChatDraftStore } from '@/hooks/store/useChatDraftStore';
import { useCodeViewerStore } from '@/hooks/store/useCodeViewerStore';
import { useConnectionStore } from '@/hooks/store/useConnectionStore';
import { useHistoryStore } from '@/hooks/store/useHistoryStore';
import { useMcpStore } from '@/hooks/store/useMcpStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useUsageLimitStore } from '@/hooks/store/useUsageLimitStore';

export class WsClientService {
  private activeSocket: WebSocket | null = null;

  send(event: ClientEvent): void {
    if (!this.activeSocket || this.activeSocket.readyState !== WebSocket.OPEN) {
      console.warn('Not connected, dropped client event', event.type);
      return;
    }
    this.activeSocket.send(JSON.stringify(event));
  }

  start(): () => void {
    const { setStatus, setHello } = useConnectionStore.getState();
    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let backoffMs = INITIAL_BACKOFF_MS;
    let stopped = false;

    const openSelectedRoom = (): void => {
      const roomId = useSessionsStore.getState().selectedRoomId;
      if (roomId !== null) this.send({ type: 'session_open', roomId });
    };

    const unsubscribeSelection = useSessionsStore.subscribe((state, previous) => {
      if (state.selectedRoomId !== previous.selectedRoomId) openSelectedRoom();
    });

    const failPendingList = (code: string): void => {
      const roomId = useSessionsStore.getState().selectedRoomId;
      if (roomId === null) return;
      const kinds =
        code === 'commands_failed'
          ? (['commands'] as const)
          : code === 'files_failed'
            ? (['files'] as const)
            : (['commands', 'files'] as const);
      useAutocompleteStore.getState().markFailed(roomId, [...kinds]);
    };

    const failPendingMcp = (): void => {
      const roomId = useMcpStore.getState().openRoomId;
      if (roomId !== null) useMcpStore.getState().markFailed(roomId);
    };

    const applyDraftEvent = (
      event: Extract<
        ServerEvent,
        { type: 'user_message' | 'session_error' | 'permission_resolved' }
      >,
    ): void => {
      const drafts = useChatDraftStore.getState();
      if (event.type === 'permission_resolved') {
        drafts.removeQuestionProgress(event.roomId, event.requestId);
        return;
      }
      if (drafts.byRoom[event.roomId]?.sending !== true) return;
      if (event.type === 'user_message') drafts.clearDraft(event.roomId);
      else drafts.setSending(event.roomId, false);
    };

    const routeServerEvent = (event: ServerEvent): void => {
      const sessions = useSessionsStore.getState();
      switch (event.type) {
        case 'hello':
          setHello(event);
          openSelectedRoom();
          break;
        case 'sessions':
          sessions.setRooms(event.rooms);
          useChatDraftStore.getState().keepRooms(event.rooms.map((room) => room.id));
          break;
        case 'session_started':
          sessions.setRooms([...sessions.rooms.filter((r) => r.id !== event.room.id), event.room]);
          sessions.closeDialog();
          useHistoryStore.getState().close();
          sessions.select(event.room.id);
          break;
        case 'session_state':
          sessions.applySessionState(event.roomId, event.state);
          break;
        case 'history':
          useHistoryStore.getState().setEntries(event.entries);
          break;
        case 'usage_limit':
          useUsageLimitStore.getState().setLimit(event.limit);
          break;
        case 'archived':
          useArchivedStore.getState().setRooms(event.rooms);
          break;
        case 'folders':
          sessions.setFolders(event);
          break;
        case 'error':
          if (event.code === 'folder_invalid') sessions.setFolderError(event.message);
          else if (event.code === 'history_failed' || event.code === 'resume_failed')
            useHistoryStore.getState().setError(event.message);
          else if (event.code === 'commands_failed' || event.code === 'files_failed')
            failPendingList(event.code);
          else if (event.code === 'code_tree_failed' || event.code === 'code_file_failed')
            useCodeViewerStore.getState().setError(event.message);
          else if (event.code === 'mcp_failed') failPendingMcp();
          else if (event.code === 'room_not_found' || event.code === 'folder_invalid')
            failPendingList(event.code);
          else console.warn('Server error', event.code);
          break;
        case 'commands':
          useAutocompleteStore.getState().setCommands(event.roomId, event.commands);
          break;
        case 'files':
          useAutocompleteStore.getState().setFiles(event.roomId, event.files);
          break;
        case 'mcp_status':
          useMcpStore.getState().setStatus(event.roomId, event.live, event.servers);
          break;
        case 'code_tree':
          useCodeViewerStore.getState().setTree(event);
          break;
        case 'code_file':
          useCodeViewerStore.getState().setFile(event);
          break;
        case 'session_history':
          useChatStore.getState().replaceHistory(event.roomId, event.events);
          break;
        case 'user_message':
        case 'session_error':
        case 'permission_resolved':
          useChatStore.getState().applyEvent(event);
          applyDraftEvent(event);
          break;
        case 'assistant_text':
        case 'tool_call':
        case 'tool_result':
        case 'turn_done':
        case 'auth_error':
        case 'permission_request':
        case 'session_notice':
        case 'subagent_started':
        case 'subagent_tool_call':
        case 'subagent_tool_result':
        case 'subagent_finished':
        case 'peer_message':
        case 'system_event':
        case 'internal_events':
          useChatStore.getState().applyEvent(event);
          break;
        case 'pong':
          break;
        default: {
          const unhandled: never = event;
          void unhandled;
        }
      }
    };

    const scheduleReconnect = (): void => {
      if (stopped || retryTimer !== null) return;
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, backoffMs);
      backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
    };

    const connect = (): void => {
      setStatus('connecting');
      const ws = new WebSocket(buildWsUrl());
      socket = ws;
      this.activeSocket = ws;

      ws.onopen = () => {
        backoffMs = INITIAL_BACKOFF_MS;
        setStatus('connected');
      };
      ws.onmessage = (message: MessageEvent<unknown>) => {
        const parsed = parseServerEvent(message.data);
        if (!parsed.success) {
          console.warn('Ignored invalid server message', parsed.eventType, parsed.issuePaths);
          return;
        }
        routeServerEvent(parsed.data);
      };
      ws.onclose = () => {
        if (socket === ws) socket = null;
        if (this.activeSocket === ws) this.activeSocket = null;
        setStatus('disconnected');
        scheduleReconnect();
      };
      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      stopped = true;
      unsubscribeSelection();
      if (retryTimer !== null) clearTimeout(retryTimer);
      this.activeSocket = null;
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }
}

export const wsClientService = new WsClientService();
