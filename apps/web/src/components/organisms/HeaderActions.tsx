import { IconButton } from '@/components/atoms/IconButton';
import { ArchivedDialog } from '@/components/organisms/ArchivedDialog';
import { HistoryDialog } from '@/components/organisms/HistoryDialog';
import { UsageLimitBadge } from '@/components/molecules/UsageLimitBadge';
import { NewSessionDialog } from '@/components/organisms/NewSessionDialog';
import { useNow } from '@/hooks/feature/useNow';
import { useArchivedStore } from '@/hooks/store/useArchivedStore';
import { useHistoryStore } from '@/hooks/store/useHistoryStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useUsageLimitStore } from '@/hooks/store/useUsageLimitStore';
import { wsClientService } from '@/services/ws-client.service';

export function HeaderActions() {
  const openDialog = useSessionsStore((state) => state.openDialog);
  const openHistory = useHistoryStore((state) => state.openHistory);
  const openArchived = useArchivedStore((state) => state.openArchived);

  const limit = useUsageLimitStore((state) => state.limit);
  const now = useNow(60_000);
  const showLimit = limit !== null && (limit.utilization !== null || limit.resetsAt !== null);

  return (
    <div className="ms-auto d-flex gap-2">
      {showLimit && (
        <UsageLimitBadge utilization={limit.utilization} resetsAt={limit.resetsAt} now={now} />
      )}
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
