import { useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { roomLabel, type RoomSummary } from '@claude-office/shared';
import { CloseConfirmDialog } from '@/features/chat/CloseConfirmDialog';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useMcpStore } from '@/features/mcp/use-mcp-store';
import { useSessionsStore, type RenamePlace } from '@/features/sessions/use-sessions-store';

type RoomActionsMenuProps = {
  room: RoomSummary;
  place: Exclude<RenamePlace, 'office'>;
  showMcp?: boolean;
};

type Confirming = 'close' | 'archive' | 'remove';

export function RoomActionsMenu({ room, place, showMcp = false }: RoomActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [confirming, setConfirming] = useState<Confirming | null>(null);
  const startRename = useSessionsStore((state) => state.startRename);
  const openMcp = useMcpStore((state) => state.openPanel);
  const label = `Actions for ${roomLabel(room)}`;
  const closed = room.state === 'closed';
  const needsConfirm = room.state === 'working' || room.state === 'waiting';

  function send(type: 'session_close' | 'room_archive' | 'room_remove'): void {
    sendClientEvent({ type, roomId: room.id });
    setConfirming(null);
  }

  function request(action: Confirming): void {
    if (action === 'remove' || needsConfirm) {
      setConfirming(action);
      return;
    }
    send(action === 'close' ? 'session_close' : 'room_archive');
  }

  return (
    <>
      <Dropdown
        align="end"
        show={open}
        onToggle={setOpen}
        onKeyDown={(event) => {
          // Stop Esc before App closes the chat panel; close the menu ourselves.
          if (event.key === 'Escape' && open) {
            event.nativeEvent.stopPropagation();
            setOpen(false);
            toggleRef.current?.focus();
          }
        }}
      >
        <OverlayTrigger placement="top" overlay={<Tooltip>{label}</Tooltip>}>
          <Dropdown.Toggle
            ref={toggleRef}
            variant="outline-secondary"
            size="sm"
            className="room-actions-toggle"
            aria-label={label}
          >
            <i className="bi bi-three-dots" aria-hidden="true" />
          </Dropdown.Toggle>
        </OverlayTrigger>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => startRename(room.id, place)}>
            <i className="bi bi-pencil me-2" aria-hidden="true" />
            Rename
          </Dropdown.Item>
          {showMcp && (
            <Dropdown.Item onClick={() => openMcp(room.id)}>
              <i className="bi bi-plug me-2" aria-hidden="true" />
              MCP servers
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={() => request('archive')}>
            <i className="bi bi-box-arrow-in-down me-2" aria-hidden="true" />
            Archive
          </Dropdown.Item>
          {!closed && (
            <Dropdown.Item onClick={() => request('close')}>
              <i className="bi bi-x-circle me-2" aria-hidden="true" />
              Close
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item className="text-danger" onClick={() => request('remove')}>
            <i className="bi bi-trash me-2" aria-hidden="true" />
            Remove
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {confirming === 'close' && (
        <CloseConfirmDialog
          message="Claude is working. Close this session?"
          confirmLabel="Close"
          onConfirm={() => send('session_close')}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === 'archive' && (
        <CloseConfirmDialog
          message="Claude is working. Close and archive this session?"
          confirmLabel="Archive"
          onConfirm={() => send('room_archive')}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === 'remove' && (
        <CloseConfirmDialog
          message="Remove this room from Claude Office? The Claude session stays in History."
          confirmLabel="Remove"
          confirmIcon="trash"
          onConfirm={() => send('room_remove')}
          onCancel={() => setConfirming(null)}
        />
      )}
    </>
  );
}
