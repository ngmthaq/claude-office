import { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FolderPicker } from '@/components/molecules/FolderPicker';
import { useRequestOnOpen } from '@/hooks/feature/useRequestOnOpen';
import { useConnectionStore } from '@/hooks/store/useConnectionStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';

export function NewSessionDialog() {
  const open = useSessionsStore((state) => state.dialogOpen);
  const path = useSessionsStore((state) => state.path);
  const parent = useSessionsStore((state) => state.parent);
  const entries = useSessionsStore((state) => state.entries);
  const loading = useSessionsStore((state) => state.loading);
  const error = useSessionsStore((state) => state.error);
  const closeDialog = useSessionsStore((state) => state.closeDialog);
  const setFoldersLoading = useSessionsStore((state) => state.setFoldersLoading);
  const connected = useConnectionStore((state) => state.status === 'connected');

  const requestRoot = useCallback(() => {
    setFoldersLoading();
    wsClientService.send({ type: 'folders_list' });
  }, [setFoldersLoading]);

  useRequestOnOpen(open && connected, requestRoot);

  function browse(target: string): void {
    setFoldersLoading();
    wsClientService.send({ type: 'folders_list', path: target });
  }

  return (
    <Modal
      show={open}
      onHide={closeDialog}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      size="lg"
      centered
      aria-labelledby="new-session-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="new-session-title">New session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-body-secondary">Pick the project folder Claude will work in.</p>
        <FolderPicker
          path={path}
          parent={parent}
          entries={entries}
          loading={loading}
          error={error}
          onBrowse={browse}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={path === null}
          onClick={() =>
            path !== null && wsClientService.send({ type: 'session_start', folder: path })
          }
        >
          Start session here
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
