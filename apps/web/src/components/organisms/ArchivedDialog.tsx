import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { roomLabel } from '@claude-office/shared';
import { useArchivedStore } from '@/hooks/store/useArchivedStore';
import { wsClientService } from '@/services/ws-client.service';

export function ArchivedDialog() {
  const open = useArchivedStore((state) => state.open);
  const loading = useArchivedStore((state) => state.loading);
  const rooms = useArchivedStore((state) => state.rooms);
  const close = useArchivedStore((state) => state.close);

  return (
    <Modal
      show={open}
      onHide={close}
      onEscapeKeyDown={(event) => event.stopPropagation()}
      size="lg"
      scrollable
      aria-labelledby="archived-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="archived-title">Archived</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-body-secondary">
          Archived rooms. Restore one to bring it back to the map.
        </p>
        {loading && <p className="text-body-secondary">Loading…</p>}
        {!loading && rooms.length === 0 && (
          <p className="text-body-secondary">No archived rooms.</p>
        )}
        <ListGroup>
          {rooms.map((room) => (
            <ListGroup.Item
              key={room.id}
              className="d-flex align-items-center justify-content-between gap-5"
            >
              <div className="d-flex flex-column overflow-hidden">
                <span className="text-truncate" title={room.folder}>
                  {roomLabel(room)}
                </span>
                <small className="text-body-secondary text-truncate" title={room.folder}>
                  {room.folder}
                </small>
                <small className="text-body-secondary">
                  {new Date(room.archivedAt).toLocaleString()}
                </small>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => wsClientService.send({ type: 'room_restore', roomId: room.id })}
              >
                Restore
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
