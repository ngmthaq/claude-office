import { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
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
      <div className="small text-body-secondary text-truncate mb-2" title={path ?? ''}>
        {path ?? 'Loading...'}
      </div>
      {error && (
        <Alert variant="danger" className="py-1 px-2 small">
          {error}
        </Alert>
      )}
      <ListGroup className="folder-picker__list" aria-busy={loading}>
        {parent !== null && (
          <ListGroup.Item action onClick={() => browse(parent)}>
            <i className="bi bi-arrow-up me-2" aria-hidden="true" />
            Up
          </ListGroup.Item>
        )}
        {entries.map((entry) => (
          <ListGroup.Item action key={entry.path} onClick={() => browse(entry.path)}>
            <i className="bi bi-folder me-2" aria-hidden="true" />
            {entry.name}
          </ListGroup.Item>
        ))}
        {!loading && entries.length === 0 && (
          <ListGroup.Item className="text-body-secondary">No subfolders</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}
