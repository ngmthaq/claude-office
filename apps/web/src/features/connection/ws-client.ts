import { parseServerEvent, type ClientEvent, type ServerEvent } from '@claude-office/shared';
import { useAutocompleteStore } from '@/features/chat/use-autocomplete-store';
import { useChatStore } from '@/features/chat/use-chat-store';
import { useArchivedStore } from '@/features/archived/use-archived-store';
import { useHistoryStore } from '@/features/history/use-history-store';
import { useMcpStore } from '@/features/mcp/use-mcp-store';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 10_000;

let activeSocket: WebSocket | null = null;

export function sendClientEvent(event: ClientEvent): void {
  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    console.warn('Not connected, dropped client event', event.type);
    return;
  }
  activeSocket.send(JSON.stringify(event));
}

export function startWsClient(): () => void {
  const { setStatus, setHello } = useConnectionStore.getState();
  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let backoffMs = INITIAL_BACKOFF_MS;
  let stopped = false;

  const unsubscribeSelection = useSessionsStore.subscribe((state, previous) => {
    if (state.selectedRoomId !== previous.selectedRoomId) openSelectedRoom();
  });

  function connect(): void {
    setStatus('connecting');
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}/ws`);
    socket = ws;
    activeSocket = ws;

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
      if (activeSocket === ws) activeSocket = null;
      setStatus('disconnected');
      scheduleReconnect();
    };
    ws.onerror = () => {
      ws.close();
    };
  }

  function scheduleReconnect(): void {
    if (stopped || retryTimer !== null) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      connect();
    }, backoffMs);
    backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
  }

  function routeServerEvent(event: ServerEvent): void {
    const sessions = useSessionsStore.getState();
    switch (event.type) {
      case 'hello':
        setHello(event);
        openSelectedRoom();
        break;
      case 'sessions':
        sessions.setRooms(event.rooms);
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
      case 'session_history':
        useChatStore.getState().replaceHistory(event.roomId, event.events);
        break;
      case 'user_message':
      case 'assistant_text':
      case 'tool_call':
      case 'tool_result':
      case 'turn_done':
      case 'session_error':
      case 'auth_error':
      case 'permission_request':
      case 'permission_resolved':
      case 'session_notice':
      case 'subagent_started':
      case 'subagent_tool_call':
      case 'subagent_tool_result':
      case 'subagent_finished':
        useChatStore.getState().applyEvent(event);
        break;
      case 'pong':
        break;
    }
  }

  function failPendingList(code: string): void {
    const roomId = useSessionsStore.getState().selectedRoomId;
    if (roomId === null) return;
    const kinds =
      code === 'commands_failed'
        ? (['commands'] as const)
        : code === 'files_failed'
          ? (['files'] as const)
          : (['commands', 'files'] as const);
    useAutocompleteStore.getState().markFailed(roomId, [...kinds]);
  }

  function failPendingMcp(): void {
    const roomId = useMcpStore.getState().openRoomId;
    if (roomId !== null) useMcpStore.getState().markFailed(roomId);
  }

  function openSelectedRoom(): void {
    const roomId = useSessionsStore.getState().selectedRoomId;
    if (roomId !== null) sendClientEvent({ type: 'session_open', roomId });
  }

  connect();

  return () => {
    stopped = true;
    unsubscribeSelection();
    if (retryTimer !== null) clearTimeout(retryTimer);
    activeSocket = null;
    if (socket) {
      socket.onclose = null;
      socket.close();
    }
  };
}
