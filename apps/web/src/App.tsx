import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ChatPanel } from '@/features/chat/ChatPanel';
import { ChatResizeHandle } from '@/features/chat/ChatResizeHandle';
import { useChatWidthStore } from '@/features/chat/use-chat-width-store';
import { GameCanvas } from '@/game/GameCanvas';
import { HeaderActions } from '@/features/sessions/HeaderActions';
import { SessionList } from '@/features/sessions/SessionList';
import { useChatStore } from '@/features/chat/use-chat-store';
import { useArchivedStore } from '@/features/archived/use-archived-store';
import { useSubagentDetailsStore } from '@/features/subagents/use-subagent-details-store';
import { useHistoryStore } from '@/features/history/use-history-store';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

export function App() {
  const chatOpen = useSessionsStore((state) => state.selectedRoomId !== null);
  const chatWidth = useChatWidthStore((state) => state.width);
  const drawerStyle = { '--chat-width': `${chatWidth}px` } as CSSProperties;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (
        useHistoryStore.getState().open ||
        useArchivedStore.getState().open ||
        useSessionsStore.getState().renaming !== null ||
        useSessionsStore.getState().dialogOpen ||
        useChatStore.getState().confirmingClose
      ) {
        return;
      }
      if (useSubagentDetailsStore.getState().open !== null) {
        useSubagentDetailsStore.getState().closeDetails();
        return;
      }
      useSessionsStore.getState().select(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="app">
      <header className="app-header d-flex align-items-center gap-3 px-3 py-2 border-bottom">
        <h1 className="h5 m-0">Claude Office</h1>
        <ConnectionBadge />
        <HeaderActions />
      </header>
      <div className="app-body">
        <ErrorBoundary>
          <SessionList />
        </ErrorBoundary>
        <ErrorBoundary>
          <GameCanvas />
        </ErrorBoundary>
        <div className={`chat-drawer${chatOpen ? ' chat-drawer--open' : ''}`} style={drawerStyle}>
          <ChatResizeHandle />
          <ErrorBoundary>
            <ChatPanel />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
