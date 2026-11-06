import { useEffect } from 'react';
import { roomLabel } from '@claude-office/shared';
import { useArchivedStore } from '@/features/archived/use-archived-store';
import { sendClientEvent } from '@/features/connection/ws-client';

export function ArchivedDialog() {
  const open = useArchivedStore((state) => state.open);
  const loading = useArchivedStore((state) => state.loading);
  const rooms = useArchivedStore((state) => state.rooms);
  const close = useArchivedStore((state) => state.close);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="archived-title">
        <h2 id="archived-title">Archived</h2>
        <p className="muted">Archived rooms. Restore one to bring it back to the map.</p>
        <div className="history-list">
          {loading && <p className="muted">Loading…</p>}
          {!loading && rooms.length === 0 && <p className="muted">No archived rooms.</p>}
          <ul className="history-group__list">
            {rooms.map((room) => (
              <li key={room.id} className="history-row">
                <div className="history-row__text">
                  <span className="history-row__title" title={room.folder}>
                    {roomLabel(room)}
                  </span>
                  <span className="muted history-row__meta" title={room.folder}>
                    {room.folder}
                  </span>
                  <span className="muted history-row__meta">
                    {new Date(room.archivedAt).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => sendClientEvent({ type: 'room_restore', roomId: room.id })}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dialog__actions">
          <button type="button" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
