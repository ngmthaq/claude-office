import { IconButton } from '@/components/IconButton';
import { ArchivedDialog } from '@/features/archived/ArchivedDialog';
import { useArchivedStore } from '@/features/archived/use-archived-store';
import { sendClientEvent } from '@/features/connection/ws-client';
import { HistoryDialog } from '@/features/history/HistoryDialog';
import { useHistoryStore } from '@/features/history/use-history-store';
import { NewSessionDialog } from '@/features/sessions/NewSessionDialog';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function HeaderActions() {
  const openDialog = useSessionsStore((state) => state.openDialog);
  const openHistory = useHistoryStore((state) => state.openHistory);
  const openArchived = useArchivedStore((state) => state.openArchived);

  return (
    <div className="ms-auto d-flex gap-2">
      <IconButton
        icon="plus-lg"
        label="New session"
        variant="primary"
        placement="bottom"
        onClick={openDialog}
      />
      <IconButton
        icon="clock-history"
        label="History"
        placement="bottom"
        onClick={() => {
          openHistory();
          sendClientEvent({ type: 'history_list' });
        }}
      />
      <IconButton
        icon="archive"
        label="Archived"
        placement="bottom"
        onClick={() => {
          openArchived();
          sendClientEvent({ type: 'archived_list' });
        }}
      />
      <NewSessionDialog />
      <HistoryDialog />
      <ArchivedDialog />
    </div>
  );
}
