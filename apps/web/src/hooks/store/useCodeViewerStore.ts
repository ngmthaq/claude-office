import { create } from 'zustand';
import type { CodeFileEvent, CodeTreeEvent } from '@claude-office/shared';

export type CodeViewerMode = 'diff' | 'file';

type CodeViewerState = {
  openRoomId: string | null;
  files: CodeTreeEvent['files'];
  truncated: boolean;
  isGitRepo: boolean;
  statuses: CodeTreeEvent['statuses'];
  selectedPath: string | null;
  file: CodeFileEvent | null;
  mode: CodeViewerMode;
  chosenMode: CodeViewerMode | null;
  loadingTree: boolean;
  loadingFile: boolean;
  error: string | null;
  open: (roomId: string) => void;
  close: () => void;
  setTree: (event: CodeTreeEvent) => void;
  select: (path: string) => void;
  setFile: (event: CodeFileEvent) => void;
  setMode: (mode: CodeViewerMode) => void;
  setError: (message: string) => void;
  startLoadingTree: () => void;
  startLoadingFile: () => void;
};

const initial = {
  openRoomId: null,
  files: [],
  truncated: false,
  isGitRepo: true,
  statuses: [],
  selectedPath: null,
  file: null,
  mode: 'diff' as CodeViewerMode,
  chosenMode: null,
  loadingTree: false,
  loadingFile: false,
  error: null,
};

export const useCodeViewerStore = create<CodeViewerState>((set) => ({
  ...initial,
  open: (roomId) => set({ ...initial, openRoomId: roomId, loadingTree: true }),
  close: () => set(initial),
  setTree: (event) =>
    set((state) =>
      event.roomId === state.openRoomId
        ? {
            files: event.files,
            truncated: event.truncated,
            isGitRepo: event.isGitRepo,
            statuses: event.statuses,
            loadingTree: false,
            error: null,
          }
        : state,
    ),
  select: (path) =>
    set({ selectedPath: path, file: null, chosenMode: null, loadingFile: true, error: null }),
  setFile: (event) =>
    set((state) => {
      if (event.roomId !== state.openRoomId || event.path !== state.selectedPath) return state;
      let mode: CodeViewerMode;
      if (event.status === null || !state.isGitRepo) mode = 'file';
      else if (event.status === 'D') mode = 'diff';
      else mode = state.chosenMode ?? 'diff';
      return { file: event, mode, loadingFile: false, error: null };
    }),
  setMode: (mode) => set({ mode, chosenMode: mode }),
  setError: (message) => set({ error: message, loadingTree: false, loadingFile: false }),
  startLoadingTree: () => set({ loadingTree: true }),
  startLoadingFile: () => set({ loadingFile: true }),
}));
