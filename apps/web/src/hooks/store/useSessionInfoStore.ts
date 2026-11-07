import { create } from 'zustand';

type SessionInfoState = {
  /** The room whose session info panel is open, or null when closed. */
  openRoomId: string | null;
  open: (roomId: string) => void;
  close: () => void;
};

export const useSessionInfoStore = create<SessionInfoState>((set) => ({
  openRoomId: null,
  open: (roomId) => set({ openRoomId: roomId }),
  close: () => set({ openRoomId: null }),
}));
