import { useEffect } from 'react';
import { roomLabel } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { ChatInput } from '@/components/organisms/ChatInput';
import { CodeViewerDialog } from '@/components/organisms/CodeViewerDialog';
import { McpStatusPanel } from '@/components/organisms/McpStatusPanel';
import { MessageList } from '@/components/organisms/MessageList';
import { SessionInfoPanel } from '@/components/organisms/SessionInfoPanel';
import { SubagentDetails } from '@/components/organisms/SubagentDetails';
import { CODE_VIEWER_TEXT, SESSION_INFO_TEXT } from '@/configs/ui.config';
import { useMcpStatus } from '@/hooks/feature/useMcpStatus';
import { useCodeViewerStore } from '@/hooks/store/useCodeViewerStore';
import { useMcpStore } from '@/hooks/store/useMcpStore';
import { useSessionInfoStore } from '@/hooks/store/useSessionInfoStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';

export function ChatPanel() {
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === state.selectedRoomId));
  const select = useSessionsStore((state) => state.select);
  const openSubagent = useSubagentDetailsStore((state) => state.open);
  const closeDetails = useSubagentDetailsStore((state) => state.closeDetails);
  const mcpRoomId = useMcpStore((state) => state.openRoomId);
  const closeMcp = useMcpStore((state) => state.closePanel);
  const infoRoomId = useSessionInfoStore((state) => state.openRoomId);
  const openInfo = useSessionInfoStore((state) => state.open);
  const closeInfo = useSessionInfoStore((state) => state.close);
  const codeRoomId = useCodeViewerStore((state) => state.openRoomId);
  const openCode = useCodeViewerStore((state) => state.open);
  const closeCode = useCodeViewerStore((state) => state.close);
  const { openPanel: openMcp } = useMcpStatus();
  const roomId = room?.id ?? null;

  useEffect(() => {
    if (openSubagent !== null && openSubagent.roomId !== roomId) closeDetails();
  }, [openSubagent, roomId, closeDetails]);

  useEffect(() => {
    if (mcpRoomId !== null && mcpRoomId !== roomId) closeMcp();
  }, [mcpRoomId, roomId, closeMcp]);

  useEffect(() => {
    if (infoRoomId !== null && infoRoomId !== roomId) closeInfo();
  }, [infoRoomId, roomId, closeInfo]);

  useEffect(() => {
    if (codeRoomId !== null && codeRoomId !== roomId) closeCode();
  }, [codeRoomId, roomId, closeCode]);

  useEffect(() => {
    if (openSubagent === null) return;
    closeInfo();
    closeMcp();
  }, [openSubagent, closeInfo, closeMcp]);

  if (!room) return null;

  if (mcpRoomId === room.id) return <McpStatusPanel roomId={room.id} roomName={roomLabel(room)} />;

  if (infoRoomId === room.id) {
    return <SessionInfoPanel roomId={room.id} roomName={roomLabel(room)} />;
  }

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
        <div className="ms-auto d-flex gap-2 flex-shrink-0">
          <IconButton
            icon="info-circle"
            label={SESSION_INFO_TEXT.title}
            onClick={() => openInfo(room.id)}
          />
          <IconButton
            icon="file-earmark-code"
            label={CODE_VIEWER_TEXT.title}
            onClick={() => openCode(room.id)}
          />
          <IconButton
            icon="plug"
            label="MCP servers"
            onClick={() => {
              closeInfo();
              openMcp(room.id);
            }}
          />
        </div>
      </div>
      <CodeViewerDialog />
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
