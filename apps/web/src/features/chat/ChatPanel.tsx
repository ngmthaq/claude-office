import { useEffect, useState } from 'react';
import { IconButton } from '@/components/IconButton';
import { roomLabel } from '@claude-office/shared';
import { ChatInput } from '@/features/chat/ChatInput';
import { CloseConfirmDialog } from '@/features/chat/CloseConfirmDialog';
import { MessageList } from '@/features/chat/MessageList';
import { sendClientEvent } from '@/features/connection/ws-client';
import { McpStatusPanel } from '@/features/mcp/McpStatusPanel';
import { useMcpStore } from '@/features/mcp/use-mcp-store';
import { SubagentDetails } from '@/features/subagents/SubagentDetails';
import { useSubagentDetailsStore } from '@/features/subagents/use-subagent-details-store';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function ChatPanel() {
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === state.selectedRoomId));
  const select = useSessionsStore((state) => state.select);
  const [confirming, setConfirming] = useState<'close' | 'archive' | null>(null);
  const openSubagent = useSubagentDetailsStore((state) => state.open);
  const closeDetails = useSubagentDetailsStore((state) => state.closeDetails);
  const mcpRoomId = useMcpStore((state) => state.openRoomId);
  const openMcp = useMcpStore((state) => state.openPanel);
  const closeMcp = useMcpStore((state) => state.closePanel);
  const roomId = room?.id ?? null;

  useEffect(() => {
    if (openSubagent !== null && openSubagent.roomId !== roomId) closeDetails();
  }, [openSubagent, roomId, closeDetails]);

  useEffect(() => {
    if (mcpRoomId !== null && mcpRoomId !== roomId) closeMcp();
  }, [mcpRoomId, roomId, closeMcp]);

  if (!room) return null;

  if (mcpRoomId === room.id) return <McpStatusPanel roomId={room.id} roomName={roomLabel(room)} />;

  const showDetails = openSubagent !== null && openSubagent.roomId === room.id;
  const closed = room.state === 'closed';
  const needsConfirm = room.state === 'working' || room.state === 'waiting';

  function sendClose(): void {
    if (!room) return;
    sendClientEvent({ type: 'session_close', roomId: room.id });
    setConfirming(null);
  }

  function sendArchive(): void {
    if (!room) return;
    sendClientEvent({ type: 'room_archive', roomId: room.id });
    setConfirming(null);
  }

  return (
    <main className="chat-panel">
      <div className="chat-panel__header">
        <IconButton icon="arrow-left" label="Back" onClick={() => select(null)} />
        <div className="chat-panel__title fw-semibold text-truncate" title={room.folder}>
          {roomLabel(room)}
        </div>
        <div className="ms-auto d-flex gap-2 flex-shrink-0">
          <IconButton icon="plug" label="MCP servers" onClick={() => openMcp(room.id)} />
          {!closed && (
            <IconButton
              icon="x-circle"
              label="Close session"
              onClick={() => (needsConfirm ? setConfirming('close') : sendClose())}
            />
          )}
          <IconButton
            icon="box-arrow-in-down"
            label="Archive session"
            onClick={() => (needsConfirm ? setConfirming('archive') : sendArchive())}
          />
        </div>
      </div>
      {showDetails ? (
        <SubagentDetails roomId={room.id} subagentId={openSubagent.subagentId} />
      ) : (
        <>
          <MessageList key={`list-${room.id}`} roomId={room.id} />
          <ChatInput
            key={`input-${room.id}`}
            roomId={room.id}
            busy={room.busy}
            subagentsActive={room.subagents.length > 0}
            closed={closed}
          />
        </>
      )}
      {confirming === 'close' && needsConfirm && (
        <CloseConfirmDialog
          message="Claude is working. Close this session?"
          confirmLabel="Close"
          onConfirm={sendClose}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === 'archive' && needsConfirm && (
        <CloseConfirmDialog
          message="Claude is working. Close and archive this session?"
          confirmLabel="Archive"
          onConfirm={sendArchive}
          onCancel={() => setConfirming(null)}
        />
      )}
    </main>
  );
}
