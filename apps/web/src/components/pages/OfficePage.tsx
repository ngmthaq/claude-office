import { ChatResizeHandle } from '@/components/atoms/ChatResizeHandle';
import { ConnectionBadge } from '@/components/atoms/ConnectionBadge';
import { ChatPanel } from '@/components/organisms/ChatPanel';
import { GameCanvas } from '@/components/organisms/GameCanvas';
import { HeaderActions } from '@/components/organisms/HeaderActions';
import { SessionList } from '@/components/organisms/SessionList';
import { AppLayout } from '@/components/templates/AppLayout';
import { useChatResize } from '@/hooks/feature/useChatResize';
import { useEscapeClose } from '@/hooks/feature/useEscapeClose';
import { useChatWidthStore } from '@/hooks/store/useChatWidthStore';
import { useFloorStore } from '@/hooks/store/useFloorStore';
import { useConnectionStore } from '@/hooks/store/useConnectionStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';

export function OfficePage() {
  const chatOpen = useSessionsStore((state) => state.selectedRoomId !== null);
  const chatWidth = useChatWidthStore((state) => state.width);
  const floorVisible = useFloorStore((state) => state.visible);
  const connectionStatus = useConnectionStore((state) => state.status);
  const chatResize = useChatResize();

  useEscapeClose();

  return (
    <AppLayout
      connectionBadge={<ConnectionBadge status={connectionStatus} />}
      headerActions={<HeaderActions />}
      sidebar={<SessionList />}
      canvas={floorVisible ? <GameCanvas /> : null}
      resizeHandle={floorVisible ? <ChatResizeHandle {...chatResize} /> : null}
      chat={<ChatPanel />}
      chatOpen={chatOpen}
      chatWidth={chatWidth}
      floorVisible={floorVisible}
    />
  );
}
