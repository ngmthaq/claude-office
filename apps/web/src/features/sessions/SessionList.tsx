import { roomLabel } from '@claude-office/shared';
import { ArchivedDialog } from '@/features/archived/ArchivedDialog';
import { useArchivedStore } from '@/features/archived/use-archived-store';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';
import { HistoryDialog } from '@/features/history/HistoryDialog';
import { useHistoryStore } from '@/features/history/use-history-store';
import { NewSessionDialog } from '@/features/sessions/NewSessionDialog';
import { RoomRenameInput } from '@/features/sessions/RoomRenameInput';

export function SessionList() {
  const rooms = useSessionsStore((state) => state.rooms);
  const selectedRoomId = useSessionsStore((state) => state.selectedRoomId);
  const select = useSessionsStore((state) => state.select);
  const openDialog = useSessionsStore((state) => state.openDialog);
  const renaming = useSessionsStore((state) => state.renaming);
  const startRename = useSessionsStore((state) => state.startRename);
  const openHistory = useHistoryStore((state) => state.openHistory);
  const openArchived = useArchivedStore((state) => state.openArchived);

  return (
    <aside className="sidebar">
      <button type="button" className="primary" onClick={openDialog}>
        New session
      </button>
      <button
        type="button"
        onClick={() => {
          openHistory();
          sendClientEvent({ type: 'history_list' });
        }}
      >
        History
      </button>
      <button
        type="button"
        onClick={() => {
          openArchived();
          sendClientEvent({ type: 'archived_list' });
        }}
      >
        Archived
      </button>
      <ul className="session-list">
        {rooms.map((room) => {
          const label = roomLabel(room);
          const renamingHere = renaming?.roomId === room.id && renaming.rect === null;
          return (
            <li key={room.id} className="session-row">
              {renamingHere ? (
                <RoomRenameInput room={room} className="session-rename" />
              ) : (
                <>
                  <button
                    type="button"
                    className={`session-item${room.id === selectedRoomId ? ' session-item--selected' : ''}`}
                    title={room.folder}
                    onClick={() => select(room.id)}
                  >
                    <span>
                      {label}
                      {room.state === 'closed' && <span className="closed-tag">closed</span>}
                    </span>
                    {room.busy && <span className="busy-dot" role="status" aria-label="Busy" />}
                  </button>
                  <button
                    type="button"
                    className="session-rename-btn"
                    aria-label={`Rename ${label}`}
                    onClick={() => startRename(room.id, null)}
                  >
                    Rename
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <NewSessionDialog />
      <HistoryDialog />
      <ArchivedDialog />
    </aside>
  );
}
