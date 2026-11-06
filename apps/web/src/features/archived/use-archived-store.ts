import { create } from 'zustand';
import type { ArchivedRoom } from '@claude-office/shared';

type ArchivedState = {
  open: boolean;
  loading: boolean;
  rooms: ArchivedRoom[];
  openArchived: () => void;
  close: () => void;
  setRooms: (rooms: ArchivedRoom[]) => void;
};

export const useArchivedStore = create<ArchivedState>((set) => ({
  open: false,
  loading: false,
  rooms: [],
  openArchived: () => set({ open: true, loading: true }),
  close: () => set({ open: false }),
  setRooms: (rooms) => set({ rooms, loading: false }),
}));
