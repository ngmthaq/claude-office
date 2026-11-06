import { useEffect } from 'react';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function FolderPicker() {
  const { path, parent, entries, loading, error } = useSessionsStore();
  const setFoldersLoading = useSessionsStore((state) => state.setFoldersLoading);
  const connected = useConnectionStore((state) => state.status === 'connected');

  useEffect(() => {
    if (!connected) return;
    setFoldersLoading();
    sendClientEvent({ type: 'folders_list' });
  }, [connected, setFoldersLoading]);

  function browse(target: string): void {
    setFoldersLoading();
    sendClientEvent({ type: 'folders_list', path: target });
  }

  return (
    <div className="folder-picker">
      <div className="folder-picker__path" title={path ?? ''}>
        {path ?? 'Loading...'}
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <ul className="folder-picker__list" aria-busy={loading}>
        {parent !== null && (
          <li>
            <button type="button" onClick={() => browse(parent)}>
              Up
            </button>
          </li>
        )}
        {entries.map((entry) => (
          <li key={entry.path}>
            <button type="button" onClick={() => browse(entry.path)}>
              {entry.name}
            </button>
          </li>
        ))}
        {!loading && entries.length === 0 && <li className="muted">No subfolders</li>}
      </ul>
    </div>
  );
}
