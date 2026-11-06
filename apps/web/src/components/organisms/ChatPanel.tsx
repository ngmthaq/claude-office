import { useEffect } from 'react';
import { roomLabel } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { ChatInput } from '@/components/organisms/ChatInput';
import { McpStatusPanel } from '@/components/organisms/McpStatusPanel';
import { MessageList } from '@/components/organisms/MessageList';
import { SubagentDetails } from '@/components/organisms/SubagentDetails';
import { useMcpStatus } from '@/hooks/feature/useMcpStatus';
import { useMcpStore } from '@/hooks/store/useMcpStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';

export function ChatPanel() {
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === state.selectedRoomId));
  const select = useSessionsStore((state) => state.select);
  const openSubagent = useSubagentDetailsStore((state) => state.open);
  const closeDetails = useSubagentDetailsStore((state) => state.closeDetails);
  const mcpRoomId = useMcpStore((state) => state.openRoomId);
  const closeMcp = useMcpStore((state) => state.closePanel);
  const { openPanel: openMcp } = useMcpStatus();
  const roomId = room?.id ?? null;

  useEffect(() => {
    if (openSubagent !== null && openSubagent.roomId !== roomId) closeDetails();
  }, [openSubagent, roomId, closeDetails]);

  useEffect(() => {
    if (mcpRoomId !== null && mcpRoomId !== roomId) closeMcp();
  }, [mcpRoomId, roomId, closeMcp]);

  if (!room) return null;

  if (mcpRoomId === room.id) return <McpStatusPanel roomId={room.id} roomName={roomLabel(room)} />;

  if (openSubagent !== null && openSubagent.roomId === room.id) {
    return (
      <SubagentDetails
        roomId={room.id}
        roomName={roomLabel(room)}
        subagentId={openSubagent.subagentId}
      />
    );
  }

  const closed = room.state === 'closed';

  return (
    <main className="chat-panel">
      <div className="chat-panel__header">
        <IconButton icon="arrow-left" label="Back" onClick={() => select(null)} />
        <div className="chat-panel__title fw-semibold text-truncate" title={room.folder}>
          {roomLabel(room)}
        </div>
        <div className="ms-auto flex-shrink-0">
          <IconButton icon="plug" label="MCP servers" onClick={() => openMcp(room.id)} />
        </div>
      </div>
      <MessageList key={`list-${room.id}`} roomId={room.id} />
      <ChatInput
        key={`input-${room.id}`}
        roomId={room.id}
        busy={room.busy}
        subagentsActive={room.subagents.length > 0}
        closed={closed}
      />
    </main>
  );
}
