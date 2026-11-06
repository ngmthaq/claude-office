import { create } from 'zustand';
import type { FileEntry, SlashCommandEntry } from '@claude-office/shared';
import type { ListKind } from '@/dtos/autocomplete-token.dto';

type ListState<T> = {
  status: 'loading' | 'ready' | 'error';
  items: T[];
  fetchedAt: number;
};

type RoomLists = {
  commands?: ListState<SlashCommandEntry>;
  files?: ListState<FileEntry>;
};

type AutocompleteState = {
  rooms: Record<string, RoomLists>;
  markLoading: (roomId: string, kind: ListKind) => void;
  setCommands: (roomId: string, items: SlashCommandEntry[]) => void;
  setFiles: (roomId: string, items: FileEntry[]) => void;
  markFailed: (roomId: string, kinds: ListKind[]) => void;
};

export const useAutocompleteStore = create<AutocompleteState>((set, get) => ({
  rooms: {},
  markLoading: (roomId, kind) => {
    const current = get().rooms[roomId]?.[kind];
    const loading = { status: 'loading' as const, fetchedAt: current?.fetchedAt ?? 0 };
    if (kind === 'commands') {
      patchRoom(set, roomId, 'commands', {
        ...loading,
        items: get().rooms[roomId]?.commands?.items ?? [],
      });
    } else {
      patchRoom(set, roomId, 'files', {
        ...loading,
        items: get().rooms[roomId]?.files?.items ?? [],
      });
    }
  },
  setCommands: (roomId, items) =>
    patchRoom(set, roomId, 'commands', { status: 'ready', items, fetchedAt: Date.now() }),
  setFiles: (roomId, items) =>
    patchRoom(set, roomId, 'files', { status: 'ready', items, fetchedAt: Date.now() }),
  markFailed: (roomId, kinds) => {
    const room = get().rooms[roomId];
    if (kinds.includes('commands') && room?.commands?.status === 'loading') {
      patchRoom(set, roomId, 'commands', { ...room.commands, status: 'error' });
    }
    if (kinds.includes('files') && room?.files?.status === 'loading') {
      patchRoom(set, roomId, 'files', { ...room.files, status: 'error' });
    }
  },
}));

type ListItems = { commands: SlashCommandEntry; files: FileEntry };

function patchRoom<K extends ListKind>(
  set: (fn: (state: AutocompleteState) => Partial<AutocompleteState>) => void,
  roomId: string,
  kind: K,
  value: ListState<ListItems[K]>,
): void {
  set((state) => ({
    rooms: { ...state.rooms, [roomId]: { ...state.rooms[roomId], [kind]: value } },
  }));
}
