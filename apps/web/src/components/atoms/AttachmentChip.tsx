import Spinner from 'react-bootstrap/Spinner';
import type { AttachmentKind } from '@claude-office/shared';
import { ATTACHMENT_TEXT } from '@/configs/ui.config';
import { AttachmentUtil } from '@/utils/attachment.util';

export type AttachmentChipProps = {
  name: string;
  size: number;
  kind: AttachmentKind;
  status?: 'reading' | 'ready' | 'error';
  error?: string;
  onRemove?: () => void;
};

const ICON_BY_KIND: Record<AttachmentKind, string> = {
  image: 'bi-image',
  pdf: 'bi-file-earmark-pdf',
  text: 'bi-file-earmark-text',
};

export function AttachmentChip({
  name,
  size,
  kind,
  status = 'ready',
  error,
  onRemove,
}: AttachmentChipProps) {
  const failed = status === 'error';
  return (
    <span
      className={`attachment-chip${failed ? ' attachment-chip--error' : ''}`}
      title={failed ? `${name}: ${error ?? ''}` : name}
    >
      {status === 'reading' ? (
        <Spinner animation="border" size="sm" role="status" aria-label="Reading file" />
      ) : (
        <i className={`bi ${failed ? 'bi-exclamation-circle' : ICON_BY_KIND[kind]}`} aria-hidden />
      )}
      <span className="attachment-chip__name">{name}</span>
      <span className="attachment-chip__meta">
        {failed ? error : AttachmentUtil.formatSize(size)}
      </span>
      {onRemove !== undefined && (
        <button
          type="button"
          className="attachment-chip__remove"
          aria-label={`${ATTACHMENT_TEXT.remove} ${name}`}
          onClick={onRemove}
        >
          <i className="bi bi-x" aria-hidden />
        </button>
      )}
    </span>
  );
}
