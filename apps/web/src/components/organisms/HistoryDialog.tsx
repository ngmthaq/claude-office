import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useHistoryStore } from '@/hooks/store/useHistoryStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';
import { HistoryUtil } from '@/utils/history.util';

export function HistoryDialog() {
  const open = useHistoryStore((state) => state.open);
  const loading = useHistoryStore((state) => state.loading);
  const error = useHistoryStore((state) => state.error);
  const entries = useHistoryStore((state) => state.entries);
  const resumingId = useHistoryStore((state) => state.resumingId);
  const close = useHistoryStore((state) => state.close);
  const startResume = useHistoryStore((state) => state.startResume);
  const select = useSessionsStore((state) => state.select);

  const groups = HistoryUtil.groupByFolder(entries);

  return (
    <Modal
      show={open}
      onHide={close}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      size="lg"
      scrollable
      aria-labelledby="history-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="history-title">History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-body-secondary">Past Claude sessions, grouped by project folder.</p>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <p className="text-body-secondary">Loading…</p>}
        {!loading && !error && groups.length === 0 && (
          <p className="text-body-secondary">No past sessions.</p>
        )}
        {groups.map((group) => (
          <section key={group.folder} className="mb-3">
            <h3 className="fs-6 text-truncate" title={group.folder}>
              <i className="bi bi-folder2 me-1" aria-hidden="true" />
              {HistoryUtil.lastSegment(group.folder)}
            </h3>
            <ListGroup>
              {group.entries.map((entry) => (
                <ListGroup.Item
                  key={entry.sessionId}
                  className="d-flex align-items-center justify-content-between gap-5"
                >
                  <div className="d-flex flex-column overflow-hidden">
                    <span className="text-truncate" title={entry.title}>
                      {entry.title}
                    </span>
                    <small className="text-body-secondary">
                      {new Date(entry.lastModified).toLocaleString()}
                    </small>
                    {entry.firstPrompt && entry.firstPrompt !== entry.title && (
                      <small
                        className="text-body-secondary text-truncate"
                        title={entry.firstPrompt}
                      >
                        {entry.firstPrompt}
                      </small>
                    )}
                  </div>
                  {entry.openRoomId !== null ? (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        select(entry.openRoomId);
                        close();
                      }}
                    >
                      Open
                    </Button>
                  ) : !entry.canResume ? (
                    <small className="text-body-secondary text-nowrap">Folder not available</small>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={resumingId === entry.sessionId}
                      onClick={() => {
                        startResume(entry.sessionId);
                        wsClientService.send({
                          type: 'session_resume',
                          sessionId: entry.sessionId,
                        });
                      }}
                    >
                      {resumingId === entry.sessionId ? 'Resuming…' : 'Resume'}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </section>
        ))}
      </Modal.Body>
    </Modal>
  );
}
