import { create } from 'zustand';
import type { McpServerEntry } from '@claude-office/shared';
import type { McpRoomStatus } from '@/dtos/mcp-room-status.dto';

type McpState = {
  /** The room whose MCP panel is open, or null when the chat shows. */
  openRoomId: string | null;
  byRoom: Record<string, McpRoomStatus>;
  setOpenRoomId: (roomId: string) => void;
  closePanel: () => void;
  markLoading: (roomId: string) => void;
  setStatus: (roomId: string, live: boolean, servers: McpServerEntry[]) => void;
  markFailed: (roomId: string) => void;
};

const EMPTY: McpRoomStatus = { status: 'loading', live: false, servers: [], fetchedAt: null };

export const useMcpStore = create<McpState>((set) => ({
  openRoomId: null,
  byRoom: {},
  setOpenRoomId: (roomId) => set({ openRoomId: roomId }),
  closePanel: () => set({ openRoomId: null }),
  markLoading: (roomId) =>
    set((state) => ({
      byRoom: {
        ...state.byRoom,
        [roomId]: { ...(state.byRoom[roomId] ?? EMPTY), status: 'loading' },
      },
    })),
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
