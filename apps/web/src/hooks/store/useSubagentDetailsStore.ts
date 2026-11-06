import { create } from 'zustand';

type OpenSubagent = { roomId: string; subagentId: string };

type SubagentDetailsState = {
  open: OpenSubagent | null;
  openDetails: (roomId: string, subagentId: string) => void;
  closeDetails: () => void;
};

export const useSubagentDetailsStore = create<SubagentDetailsState>((set) => ({
  open: null,
  openDetails: (roomId, subagentId) => set({ open: { roomId, subagentId } }),
  closeDetails: () => set({ open: null }),
}));
