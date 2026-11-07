import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type CloseConfirmDialogProps = {
  /** When set, it heads the dialog and `message` moves into the body. */
  title?: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export function CloseConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  onOpenChange,
}: CloseConfirmDialogProps) {
  // The flag tells App to skip its own Esc handling while this dialog is open.
  useEffect(() => {
    onOpenChange(true);
    return () => onOpenChange(false);
  }, [onOpenChange]);

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
          {title ?? message}
        </Modal.Title>
      </Modal.Header>
      {title !== undefined && <Modal.Body>{message}</Modal.Body>}
      <Modal.Footer>
        <Button variant="secondary" autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
