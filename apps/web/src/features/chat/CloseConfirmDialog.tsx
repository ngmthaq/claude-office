import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { IconButton } from '@/components/IconButton';
import { useChatStore } from '@/features/chat/use-chat-store';

type CloseConfirmDialogProps = {
  message: string;
  confirmLabel: string;
  confirmIcon?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CloseConfirmDialog({
  message,
  confirmLabel,
  confirmIcon = 'x-circle',
  onConfirm,
  onCancel,
}: CloseConfirmDialogProps) {
  // The flag tells App to skip its own Esc handling while this dialog is open.
  useEffect(() => {
    const { setConfirmingClose } = useChatStore.getState();
    setConfirmingClose(true);
    return () => setConfirmingClose(false);
  }, []);

  return (
    <Modal
      show
      centered
      onHide={onCancel}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      aria-labelledby="close-confirm-title"
    >
      <Modal.Header closeButton>
        <Modal.Title as="h2" id="close-confirm-title" className="fs-5">
          {message}
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <IconButton
          icon="x-lg"
          label="Cancel"
          variant="secondary"
          size={undefined}
          autoFocus
          onClick={onCancel}
        />
        <IconButton
          icon={confirmIcon}
          label={confirmLabel}
          variant="danger"
          size={undefined}
          onClick={onConfirm}
        />
      </Modal.Footer>
    </Modal>
  );
}
