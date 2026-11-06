import Modal from 'react-bootstrap/Modal';
import { IconButton } from '@/components/IconButton';
import { sendClientEvent } from '@/features/connection/ws-client';
import { FolderPicker } from '@/features/sessions/FolderPicker';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function NewSessionDialog() {
  const open = useSessionsStore((state) => state.dialogOpen);
  const path = useSessionsStore((state) => state.path);
  const closeDialog = useSessionsStore((state) => state.closeDialog);

  return (
    <Modal
      show={open}
      onHide={closeDialog}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      centered
      aria-labelledby="new-session-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="new-session-title">New session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-body-secondary">Pick the project folder Claude will work in.</p>
        <FolderPicker />
      </Modal.Body>
      <Modal.Footer>
        <IconButton icon="x-lg" label="Cancel" size={undefined} onClick={closeDialog} />
        <IconButton
          icon="play-fill"
          label="Start session here"
          variant="primary"
          size={undefined}
          disabled={path === null}
          onClick={() => path !== null && sendClientEvent({ type: 'session_start', folder: path })}
        />
      </Modal.Footer>
    </Modal>
  );
}
