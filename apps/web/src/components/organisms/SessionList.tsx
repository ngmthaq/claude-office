import { useCallback } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { roomLabel } from '@claude-office/shared';
import { RoomActionsMenu } from '@/components/molecules/RoomActionsMenu';
import { RoomRenameInput } from '@/components/molecules/RoomRenameInput';
import { useChatStore } from '@/hooks/store/useChatStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';

export function SessionList() {
  const rooms = useSessionsStore((state) => state.rooms);
  const selectedRoomId = useSessionsStore((state) => state.selectedRoomId);
  const select = useSessionsStore((state) => state.select);
  const renaming = useSessionsStore((state) => state.renaming);
  const startRename = useSessionsStore((state) => state.startRename);
  const stopRename = useSessionsStore((state) => state.stopRename);

  const setConfirmingClose = useCallback(
    (confirming: boolean) => useChatStore.getState().setConfirmingClose(confirming),
    [],
  );

  return (
    <aside className="sidebar">
      {rooms.length === 0 && (
        <div className="text-body-secondary text-center small p-3">
          <i className="bi bi-inbox fs-3 d-block mb-2" aria-hidden="true" />
          No sessions yet. Use the + button in the header to start one.
        </div>
      )}
      <ListGroup className="session-list">
        {rooms.map((room) => {
          const label = roomLabel(room);
          const renamingHere = renaming?.roomId === room.id && renaming.place === 'sidebar';
          return (
            <ListGroup.Item key={room.id} className="d-flex align-items-center gap-2 p-1">
              {renamingHere ? (
                <RoomRenameInput
                  room={room}
                  className="flex-grow-1"
                  onSave={(roomId, name) =>
                    wsClientService.send({ type: 'room_rename', roomId, name })
                  }
                  onStop={stopRename}
                />
              ) : (
                <>
                  <Button
                    variant={room.id === selectedRoomId ? 'primary' : 'link'}
                    className={`flex-grow-1 text-start text-truncate d-flex justify-content-between${
                      room.id === selectedRoomId ? '' : ' text-body text-decoration-none'
                    }`}
                    title={room.folder}
                    onClick={() => select(room.id)}
                  >
                    <span className="text-truncate">
                      {label}
                      {room.state === 'closed' && (
                        <Badge bg="secondary" className="ms-2">
                          closed
                        </Badge>
                      )}
                    </span>
                    {room.busy && (
                      <Spinner
                        animation="grow"
                        size="sm"
                        variant="warning"
                        role="status"
                        aria-label="Busy"
                      />
                    )}
                  </Button>
                  <RoomActionsMenu
                    room={room}
                    onRename={(roomId) => startRename(roomId, 'sidebar')}
                    onAction={(type, roomId) => wsClientService.send({ type, roomId })}
                    onConfirmingChange={setConfirmingClose}
                  />
                </>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </aside>
  );
}
