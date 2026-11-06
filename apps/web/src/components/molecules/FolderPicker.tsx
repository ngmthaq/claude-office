import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import type { FolderEntry } from '@claude-office/shared';

type FolderPickerProps = {
  path: string | null;
  parent: string | null;
  entries: FolderEntry[];
  loading: boolean;
  error: string | null;
  onBrowse: (target: string) => void;
};

export function FolderPicker({
  path,
  parent,
  entries,
  loading,
  error,
  onBrowse,
}: FolderPickerProps) {
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
          <ListGroup.Item action onClick={() => onBrowse(parent)}>
            <i className="bi bi-arrow-up me-2" aria-hidden="true" />
            Up
          </ListGroup.Item>
        )}
        {entries.map((entry) => (
          <ListGroup.Item action key={entry.path} onClick={() => onBrowse(entry.path)}>
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
