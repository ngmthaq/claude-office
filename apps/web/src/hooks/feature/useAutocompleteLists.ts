import { useCallback } from 'react';
import { AUTOCOMPLETE_STALE_MS } from '@/configs/autocomplete.config';
import type { ListKind } from '@/dtos/autocomplete-token.dto';
import { useAutocompleteStore } from '@/hooks/store/useAutocompleteStore';
import { wsClientService } from '@/services/ws-client.service';

type AutocompleteLists = {
  ensureList: (roomId: string, kind: ListKind) => void;
};

export function useAutocompleteLists(): AutocompleteLists {
  const markLoading = useAutocompleteStore((state) => state.markLoading);

  const ensureList = useCallback(
    (roomId: string, kind: ListKind) => {
      const current = useAutocompleteStore.getState().rooms[roomId]?.[kind];
      if (current?.status === 'loading') return;
      if (current?.status === 'ready' && Date.now() - current.fetchedAt < AUTOCOMPLETE_STALE_MS) {
        return;
      }
      markLoading(roomId, kind);
      wsClientService.send(
        kind === 'commands' ? { type: 'commands_list', roomId } : { type: 'files_list', roomId },
      );
    },
    [markLoading],
  );

  return { ensureList };
}
