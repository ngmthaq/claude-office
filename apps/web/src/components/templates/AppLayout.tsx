import type { CSSProperties, ReactNode } from 'react';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';

type AppLayoutProps = {
  connectionBadge: ReactNode;
  headerActions: ReactNode;
  sidebar: ReactNode;
  canvas: ReactNode;
  resizeHandle: ReactNode;
  chat: ReactNode;
  chatOpen: boolean;
  chatWidth: number;
  floorVisible: boolean;
};

export function AppLayout({
  connectionBadge,
  headerActions,
  sidebar,
  canvas,
  resizeHandle,
  chat,
  chatOpen,
  chatWidth,
  floorVisible,
}: AppLayoutProps) {
  const drawerClass = `chat-drawer${chatOpen ? ' chat-drawer--open' : ''}${
    floorVisible ? '' : ' chat-drawer--full'
  }`;
  const drawerStyle = { '--chat-width': `${chatWidth}px` } as CSSProperties;

  return (
    <div className="app">
      <header className="app-header d-flex align-items-center gap-3 px-3 py-2 border-bottom">
        <h1 className="h5 m-0">Claude Office</h1>
        {connectionBadge}
        {headerActions}
      </header>
      <div className="app-body">
        <ErrorBoundary>{sidebar}</ErrorBoundary>
        <ErrorBoundary>{canvas}</ErrorBoundary>
        <div className={drawerClass} style={drawerStyle}>
          {resizeHandle}
          <ErrorBoundary>{chat}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
