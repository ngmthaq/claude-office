import { useEffect, useRef } from 'react';
import { useChatStore } from '@/features/chat/use-chat-store';

type CloseConfirmDialogProps = {
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CloseConfirmDialog({
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: CloseConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // The flag tells App to skip its own Esc handling while this dialog is open.
  useEffect(() => {
    const { setConfirmingClose } = useChatStore.getState();
    setConfirmingClose(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      setConfirmingClose(false);
    };
  }, [onCancel]);

  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="close-confirm-title">
        <h2 id="close-confirm-title">{message}</h2>
        <div className="dialog__actions">
          <button type="button" ref={cancelRef} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
