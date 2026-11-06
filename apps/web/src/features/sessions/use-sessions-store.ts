import { create } from 'zustand';
import type { FolderEntry, FoldersEvent, RoomSummary, SessionState } from '@claude-office/shared';

export const FAKE_ROOM_PREFIX = 'fake-';

export function isFakeRoomId(roomId: string): boolean {
  return roomId.startsWith(FAKE_ROOM_PREFIX);
}

export type ScreenRect = { x: number; y: number; width: number; height: number };

export type RenameTarget = { roomId: string; rect: ScreenRect | null };

type SessionsState = {
  renaming: RenameTarget | null;
  startRename: (roomId: string, rect: ScreenRect | null) => void;
  moveRename: (roomId: string, rect: ScreenRect) => void;
  stopRename: () => void;
  rooms: RoomSummary[];
  selectedRoomId: string | null;
  dialogOpen: boolean;
  path: string | null;
  parent: string | null;
  entries: FolderEntry[];
  loading: boolean;
  error: string | null;
  setRooms: (rooms: RoomSummary[]) => void;
  setFakeRooms: (rooms: RoomSummary[]) => void;
  applySessionState: (roomId: string, state: SessionState) => void;
  select: (roomId: string | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
  setFolders: (event: FoldersEvent) => void;
  setFoldersLoading: () => void;
  setFolderError: (message: string) => void;
};

export const useSessionsStore = create<SessionsState>((set) => ({
  renaming: null,
  startRename: (roomId, rect) => set({ renaming: { roomId, rect } }),
  moveRename: (roomId, rect) =>
    set((current) =>
      current.renaming?.roomId === roomId ? { renaming: { roomId, rect } } : current,
    ),
  stopRename: () => set({ renaming: null }),
  rooms: [],
  selectedRoomId: null,
  dialogOpen: false,
  path: null,
  parent: null,
  entries: [],
  loading: false,
  error: null,
  setRooms: (rooms) =>
    set((current) => {
      const next = [
        ...rooms.filter((r) => !isFakeRoomId(r.id)),
        ...current.rooms.filter(isFakeRoom),
      ];
      const has = (id: string | undefined) => id !== undefined && next.some((r) => r.id === id);
      const selected = current.selectedRoomId;
      const dropSelected = selected !== null && !isFakeRoomId(selected) && !has(selected);
      return {
        rooms: next,
        selectedRoomId: dropSelected ? null : selected,
        renaming: has(current.renaming?.roomId) ? current.renaming : null,
      };
    }),
  setFakeRooms: (fakeRooms) =>
    set((current) => ({
      rooms: [...current.rooms.filter((r) => !isFakeRoomId(r.id)), ...fakeRooms],
      selectedRoomId:
        current.selectedRoomId && isFakeRoomId(current.selectedRoomId)
          ? null
          : current.selectedRoomId,
    })),
  applySessionState: (roomId, state) =>
    set((current) => ({
      rooms: current.rooms.map((room) =>
        room.id === roomId ? { ...room, state, busy: state === 'working' } : room,
      ),
    })),
  select: (selectedRoomId) => set({ selectedRoomId }),
  openDialog: () => set({ dialogOpen: true, error: null }),
  closeDialog: () => set({ dialogOpen: false, error: null }),
  setFolders: (event) =>
    set({
      path: event.path,
      parent: event.parent,
      entries: event.entries,
      loading: false,
      error: null,
    }),
  setFoldersLoading: () => set({ loading: true, error: null }),
  setFolderError: (error) => set({ error, loading: false }),
}));

function isFakeRoom(room: RoomSummary): boolean {
  return isFakeRoomId(room.id);
}
