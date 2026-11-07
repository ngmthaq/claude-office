import { useEffect } from 'react';
import { useArchivedStore } from '@/hooks/store/useArchivedStore';
import { useChatStore } from '@/hooks/store/useChatStore';
import { useHistoryStore } from '@/hooks/store/useHistoryStore';
import { useSessionInfoStore } from '@/hooks/store/useSessionInfoStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';

export function useEscapeClose(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (
        useHistoryStore.getState().open ||
        useArchivedStore.getState().open ||
        useSessionsStore.getState().renaming !== null ||
        useSessionsStore.getState().dialogOpen ||
        useChatStore.getState().confirmingClose
      ) {
        return;
      }
      if (useSessionInfoStore.getState().openRoomId !== null) {
        useSessionInfoStore.getState().close();
        return;
      }
      if (useSubagentDetailsStore.getState().open !== null) {
        useSubagentDetailsStore.getState().closeDetails();
        return;
      }
      useSessionsStore.getState().select(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
