import { useEffect, useRef, useState, type DragEvent } from 'react';
import { roomLabel } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { BackgroundTasksPill } from '@/components/molecules/BackgroundTasksPill';
import { ChatInput } from '@/components/organisms/ChatInput';
import { CodeViewerDialog } from '@/components/organisms/CodeViewerDialog';
import { McpStatusPanel } from '@/components/organisms/McpStatusPanel';
import { MessageList } from '@/components/organisms/MessageList';
import { SessionInfoPanel } from '@/components/organisms/SessionInfoPanel';
import { SubagentDetails } from '@/components/organisms/SubagentDetails';
import {
  ATTACHMENT_TEXT,
  CODE_VIEWER_TEXT,
  FLOOR_TEXT,
  SESSION_INFO_TEXT,
} from '@/configs/ui.config';
import { useChatAttachments } from '@/hooks/feature/useChatAttachments';
import { useMcpStatus } from '@/hooks/feature/useMcpStatus';
import { useCodeViewerStore } from '@/hooks/store/useCodeViewerStore';
import { useFloorStore } from '@/hooks/store/useFloorStore';
import { useMcpStore } from '@/hooks/store/useMcpStore';
import { useSessionInfoStore } from '@/hooks/store/useSessionInfoStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';

export function ChatPanel() {
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === state.selectedRoomId));
  const floorVisible = useFloorStore((state) => state.visible);
  const select = useSessionsStore((state) => state.select);
  const openSubagent = useSubagentDetailsStore((state) => state.open);
  const openDetails = useSubagentDetailsStore((state) => state.openDetails);
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
  const attachments = useChatAttachments(roomId);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  function hasFiles(event: DragEvent): boolean {
    return event.dataTransfer.types.includes('Files');
  }

  function onDragEnter(event: DragEvent): void {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }

  function onDragOver(event: DragEvent): void {
    if (hasFiles(event)) event.preventDefault();
  }

  function onDragLeave(event: DragEvent): void {
    if (!hasFiles(event)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function onDrop(event: DragEvent): void {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    attachments.add(Array.from(event.dataTransfer.files));
  }

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

  if (!room) {
    return floorVisible ? null : <p className="chat-panel__empty muted">{FLOOR_TEXT.emptyChat}</p>;
  }

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
    <main
      className={`chat-panel${dragging ? ' chat-panel--dragging' : ''}`}
      data-drop-hint={ATTACHMENT_TEXT.dropHint}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
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
      <BackgroundTasksPill
        key={`background-${room.id}`}
        tasks={room.backgroundTasks}
        onOpenSubagent={(subagentId) => openDetails(room.id, subagentId)}
      />
      <ChatInput
        key={`input-${room.id}`}
        roomId={room.id}
        busy={room.busy}
        subagentsActive={room.subagents.length > 0}
        closed={closed}
        attachments={attachments}
      />
    </main>
  );
}
