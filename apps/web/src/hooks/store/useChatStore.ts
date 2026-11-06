import { create } from 'zustand';
import type { RoomEvent } from '@claude-office/shared';
import type { ChatItem } from '@/dtos/chat-item.dto';
import type { PermissionStatus } from '@/dtos/permission-item.dto';
import type { SubagentItem } from '@/dtos/subagent-item.dto';

export type ChatByRoom = Record<string, ChatItem[]>;

export type ChatState = {
  byRoom: ChatByRoom;
  confirmingClose: boolean;
  setConfirmingClose: (confirmingClose: boolean) => void;
  applyEvent: (event: RoomEvent) => void;
  replaceHistory: (roomId: string, events: RoomEvent[]) => void;
  markPermissionSending: (roomId: string, requestId: string) => void;
};

const EMPTY_ITEMS: ChatItem[] = [];

export const useChatStore = create<ChatState>((set) => ({
  byRoom: {},
  confirmingClose: false,
  setConfirmingClose: (confirmingClose) => set({ confirmingClose }),
  applyEvent: (event) =>
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [event.roomId]: applyRoomEvent(state.byRoom[event.roomId], event),
      },
    })),
  replaceHistory: (roomId, events) =>
    set((state) => ({
      byRoom: { ...state.byRoom, [roomId]: events.reduce<ChatItem[]>(applyRoomEvent, []) },
    })),
  markPermissionSending: (roomId, requestId) =>
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [roomId]: setPermissionStatus(state.byRoom[roomId], requestId, 'sending', 'pending'),
      },
    })),
}));

export function selectRoomItems(roomId: string | null) {
  return (state: ChatState): ChatItem[] =>
    roomId === null ? EMPTY_ITEMS : (state.byRoom[roomId] ?? EMPTY_ITEMS);
}

/** Pure reducer shared by live events and history replay. */
export function applyRoomEvent(items: ChatItem[] | undefined, event: RoomEvent): ChatItem[] {
  const current = items ?? EMPTY_ITEMS;
  switch (event.type) {
    case 'user_message':
      return [...current, { kind: 'user', id: event.messageId, text: event.text }];
    case 'assistant_text':
      return appendAssistantText(current, event.messageId, event.delta);
    case 'tool_call':
      return [
        ...current,
        { kind: 'tool', id: event.toolUseId, name: event.name, input: event.input, result: null },
      ];
    case 'tool_result':
      return current.map((item) =>
        item.kind === 'tool' && item.id === event.toolUseId
          ? { ...item, result: { content: event.content, isError: event.isError } }
          : item,
      );
    case 'session_error':
      return [
        ...current,
        { kind: 'error', id: `error-${current.length}`, code: event.code, message: event.message },
      ];
    case 'auth_error':
      return [...current, { kind: 'auth', id: `auth-${current.length}`, message: event.message }];
    case 'permission_request':
      if (current.some((item) => item.kind === 'permission' && item.id === event.requestId)) {
        return current;
      }
      return [
        ...current,
        {
          kind: 'permission',
          id: event.requestId,
          toolName: event.toolName,
          title: event.title ?? null,
          description: event.description ?? null,
          input: event.input,
          fromSubagent: event.fromSubagent,
          status: 'pending',
        },
      ];
    case 'permission_resolved':
      return setPermissionStatus(current, event.requestId, event.decision);
    case 'session_notice':
      return [
        ...current.map((item) =>
          item.kind === 'tool' && item.result === null ? { ...item, stopped: true } : item,
        ),
        { kind: 'notice', id: `notice-${current.length}`, notice: event.kind },
      ];
    case 'subagent_started':
      if (current.some((item) => item.kind === 'subagent' && item.id === event.subagentId)) {
        return current;
      }
      return [
        ...current,
        {
          kind: 'subagent',
          id: event.subagentId,
          agentType: event.agentType,
          description: event.description,
          prompt: event.prompt,
          status: 'working',
          tools: [],
          result: null,
          hiddenToolCalls: 0,
        },
      ];
    case 'subagent_tool_call':
      return updateSubagent(current, event.subagentId, (item) => ({
        ...item,
        tools: [
          ...item.tools,
          { id: event.toolUseId, name: event.name, input: event.input, result: null },
        ],
      }));
    case 'subagent_tool_result':
      return updateSubagent(current, event.subagentId, (item) => ({
        ...item,
        tools: item.tools.map((tool) =>
          tool.id === event.toolUseId
            ? { ...tool, result: { content: event.content, isError: event.isError } }
            : tool,
        ),
      }));
    case 'subagent_finished':
      return updateSubagent(current, event.subagentId, (item) => ({
        ...item,
        status: event.status,
        result: event.result,
        hiddenToolCalls: event.hiddenToolCalls,
      }));
    case 'turn_done':
      return current;
  }
}

function updateSubagent(
  items: ChatItem[],
  subagentId: string,
  update: (item: SubagentItem) => SubagentItem,
): ChatItem[] {
  return items.map((item) =>
    item.kind === 'subagent' && item.id === subagentId ? update(item) : item,
  );
}

function setPermissionStatus(
  items: ChatItem[] | undefined,
  requestId: string,
  status: PermissionStatus,
  onlyFrom?: PermissionStatus,
): ChatItem[] {
  const current = items ?? EMPTY_ITEMS;
  return current.map((item) =>
    item.kind === 'permission' &&
    item.id === requestId &&
    (onlyFrom === undefined || item.status === onlyFrom)
      ? { ...item, status }
      : item,
  );
}

function appendAssistantText(items: ChatItem[], messageId: string, delta: string): ChatItem[] {
  const exists = items.some((item) => item.kind === 'assistant' && item.id === messageId);
  if (!exists) return [...items, { kind: 'assistant', id: messageId, text: delta }];
  return items.map((item) =>
    item.kind === 'assistant' && item.id === messageId
      ? { ...item, text: item.text + delta }
      : item,
  );
}
