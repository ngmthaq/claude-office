import { sendClientEvent } from '@/features/connection/ws-client';
import { FolderPicker } from '@/features/sessions/FolderPicker';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function NewSessionDialog() {
  const open = useSessionsStore((state) => state.dialogOpen);
  const path = useSessionsStore((state) => state.path);
  const closeDialog = useSessionsStore((state) => state.closeDialog);

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="new-session-title">
        <h2 id="new-session-title">New session</h2>
        <p className="muted">Pick the project folder Claude will work in.</p>
        <FolderPicker />
        <div className="dialog__actions">
          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            disabled={path === null}
            onClick={() =>
              path !== null && sendClientEvent({ type: 'session_start', folder: path })
            }
          >
            Start here
          </button>
        </div>
      </div>
    </div>
  );
}
