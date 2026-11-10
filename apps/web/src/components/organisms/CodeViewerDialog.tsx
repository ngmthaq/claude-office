import { Suspense, lazy } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { roomLabel } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { FileTree } from '@/components/molecules/FileTree';
import { CODE_VIEWER_TEXT } from '@/configs/ui.config';
import { useCodeViewerRefresh } from '@/hooks/feature/useCodeViewerRefresh';
import { useCodeViewerStore } from '@/hooks/store/useCodeViewerStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';

const CodeEditorView = lazy(() =>
  import('@/components/molecules/CodeEditorView').then((m) => ({ default: m.CodeEditorView })),
);

const UNAVAILABLE_TEXT = {
  too_large: CODE_VIEWER_TEXT.tooLarge,
  binary: CODE_VIEWER_TEXT.binary,
  not_found: CODE_VIEWER_TEXT.notFound,
} as const;

function Placeholder({ children }: { children: React.ReactNode }) {
  return <div className="code-viewer__placeholder">{children}</div>;
}

export function CodeViewerDialog() {
  const roomId = useCodeViewerStore((state) => state.openRoomId);
  const files = useCodeViewerStore((state) => state.files);
  const statuses = useCodeViewerStore((state) => state.statuses);
  const truncated = useCodeViewerStore((state) => state.truncated);
  const isGitRepo = useCodeViewerStore((state) => state.isGitRepo);
  const selectedPath = useCodeViewerStore((state) => state.selectedPath);
  const file = useCodeViewerStore((state) => state.file);
  const mode = useCodeViewerStore((state) => state.mode);
  const loadingFile = useCodeViewerStore((state) => state.loadingFile);
  const error = useCodeViewerStore((state) => state.error);
  const close = useCodeViewerStore((state) => state.close);
  const select = useCodeViewerStore((state) => state.select);
  const setMode = useCodeViewerStore((state) => state.setMode);
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === roomId));
  const { requestFile, refresh } = useCodeViewerRefresh();

  const handleSelect = (path: string): void => {
    select(path);
    requestFile(path);
  };

  const status = file?.status ?? null;
  const showToggle =
    file !== null && file.unavailable === null && status !== null && status !== 'D';

  const renderEditor = () => {
    if (selectedPath === null) return <Placeholder>{CODE_VIEWER_TEXT.selectFile}</Placeholder>;
    if (file === null) {
      return <Placeholder>{loadingFile ? <Spinner size="sm" /> : null}</Placeholder>;
    }
    if (file.unavailable !== null) {
      return <Placeholder>{UNAVAILABLE_TEXT[file.unavailable]}</Placeholder>;
    }
    return (
      <Suspense
        fallback={
          <Placeholder>
            <Spinner size="sm" />
          </Placeholder>
        }
      >
        <CodeEditorView mode={mode} path={file.path} head={file.head} current={file.current} />
      </Suspense>
    );
  };

  return (
    <Modal
      show={roomId !== null}
      onHide={close}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      dialogClassName="code-viewer-dialog"
      fullscreen="lg-down"
      aria-labelledby="code-viewer-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="code-viewer-title" className="fs-5 text-truncate">
          {CODE_VIEWER_TEXT.title} · {room ? roomLabel(room) : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {truncated && (
          <small className="d-block text-body-secondary">{CODE_VIEWER_TEXT.truncated}</small>
        )}
        {!isGitRepo && (
          <small className="d-block text-body-secondary">{CODE_VIEWER_TEXT.noGit}</small>
        )}
        <div className="code-viewer__body mt-2">
          <div className="code-viewer__side">
            <div className="code-viewer__tree-header">
              <span className="code-viewer__tree-title">{CODE_VIEWER_TEXT.files}</span>
              <IconButton
                icon="arrow-clockwise"
                label={CODE_VIEWER_TEXT.refresh}
                onClick={refresh}
              />
            </div>
            <div className="code-viewer__tree">
              <FileTree
                files={files}
                statuses={statuses}
                selectedPath={selectedPath}
                onSelect={handleSelect}
              />
            </div>
          </div>
          <div className="code-viewer__main">
            <div className="code-viewer__editor-bar">
              <span className="code-viewer__editor-path text-truncate" title={selectedPath ?? ''}>
                {selectedPath ?? ''}
              </span>
              {showToggle && (
                <ButtonGroup size="sm" aria-label={CODE_VIEWER_TEXT.modeLabel}>
                  <Button
                    variant={mode === 'diff' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setMode('diff')}
                  >
                    {CODE_VIEWER_TEXT.diff}
                  </Button>
                  <Button
                    variant={mode === 'file' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setMode('file')}
                  >
                    {CODE_VIEWER_TEXT.file}
                  </Button>
                </ButtonGroup>
              )}
            </div>
            <div className="code-viewer__editor">{renderEditor()}</div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
