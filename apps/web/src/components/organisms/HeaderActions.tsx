import { IconButton } from '@/components/atoms/IconButton';
import { ArchivedDialog } from '@/components/organisms/ArchivedDialog';
import { HistoryDialog } from '@/components/organisms/HistoryDialog';
import { NewSessionDialog } from '@/components/organisms/NewSessionDialog';
import { useArchivedStore } from '@/hooks/store/useArchivedStore';
import { useHistoryStore } from '@/hooks/store/useHistoryStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';

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
          wsClientService.send({ type: 'history_list' });
        }}
      />
      <IconButton
        icon="archive"
        label="Archived"
        placement="bottom"
        onClick={() => {
          openArchived();
          wsClientService.send({ type: 'archived_list' });
        }}
      />
      <NewSessionDialog />
      <HistoryDialog />
      <ArchivedDialog />
    </div>
  );
}
