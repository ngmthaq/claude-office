import { create } from 'zustand';
import type { McpServerEntry } from '@claude-office/shared';
import { sendClientEvent } from '@/features/connection/ws-client';

export type McpRoomStatus = {
  status: 'loading' | 'ready' | 'error';
  live: boolean;
  servers: McpServerEntry[];
  fetchedAt: number | null;
};

type McpState = {
  /** The room whose MCP panel is open, or null when the chat shows. */
  openRoomId: string | null;
  byRoom: Record<string, McpRoomStatus>;
  openPanel: (roomId: string) => void;
  closePanel: () => void;
  refresh: (roomId: string) => void;
  setStatus: (roomId: string, live: boolean, servers: McpServerEntry[]) => void;
  markFailed: (roomId: string) => void;
};

const EMPTY: McpRoomStatus = { status: 'loading', live: false, servers: [], fetchedAt: null };

export const useMcpStore = create<McpState>((set, get) => ({
  openRoomId: null,
  byRoom: {},
  openPanel: (roomId) => {
    set({ openRoomId: roomId });
    get().refresh(roomId);
  },
  closePanel: () => set({ openRoomId: null }),
  refresh: (roomId) => {
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [roomId]: { ...(state.byRoom[roomId] ?? EMPTY), status: 'loading' },
      },
    }));
    sendClientEvent({ type: 'mcp_list', roomId });
  },
  setStatus: (roomId, live, servers) =>
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [roomId]: { status: 'ready', live, servers, fetchedAt: Date.now() },
      },
    })),
  markFailed: (roomId) =>
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [roomId]: { ...(state.byRoom[roomId] ?? EMPTY), status: 'error' },
      },
    })),
}));
