import { create } from 'zustand';
import type { HistoryEntry } from '@claude-office/shared';

type HistoryState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  entries: HistoryEntry[];
  resumingId: string | null;
  openHistory: () => void;
  close: () => void;
  setEntries: (entries: HistoryEntry[]) => void;
  setError: (message: string) => void;
  startResume: (sessionId: string) => void;
  clearResuming: () => void;
};

export const useHistoryStore = create<HistoryState>((set) => ({
  open: false,
  loading: false,
  error: null,
  entries: [],
  resumingId: null,
  openHistory: () => {
    set({ open: true, loading: true, error: null, resumingId: null });
  },
  close: () => set({ open: false, error: null, resumingId: null }),
  setEntries: (entries) => set({ entries, loading: false, error: null }),
  setError: (error) => set({ error, loading: false, resumingId: null }),
  startResume: (sessionId) => set({ resumingId: sessionId, error: null }),
  clearResuming: () => set({ resumingId: null }),
}));
