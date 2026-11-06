import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AuthErrorNotice } from '@/features/chat/AuthErrorNotice';
import { PermissionCard } from '@/features/chat/PermissionCard';
import { SubagentCard } from '@/features/chat/SubagentCard';
import { ToolCard } from '@/features/chat/ToolCard';
import { selectRoomItems, useChatStore, type ChatItem } from '@/features/chat/use-chat-store';

type MessageListProps = { roomId: string };

export function MessageList({ roomId }: MessageListProps) {
  const items = useChatStore(selectRoomItems(roomId));
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [items]);

  return (
    <div className="message-list">
      {items.map((item) => (
        <ChatItemView key={`${item.kind}-${item.id}`} roomId={roomId} item={item} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

function ChatItemView({ roomId, item }: { roomId: string; item: ChatItem }) {
  switch (item.kind) {
    case 'user':
      return <div className="message message--user">{item.text}</div>;
    case 'assistant':
      return (
        <div className="message message--assistant">
          <Markdown remarkPlugins={[remarkGfm]} components={{ a: ExternalLink }}>
            {item.text}
          </Markdown>
        </div>
      );
    case 'tool':
      return (
        <ToolCard name={item.name} input={item.input} result={item.result} stopped={item.stopped} />
      );
    case 'error':
      return (
        <div className="notice notice--error" role="alert">
          {item.message}
        </div>
      );
    case 'auth':
      return <AuthErrorNotice message={item.message} />;
    case 'notice':
      return (
        <div className="notice-line">
          {item.notice === 'stopped' ? 'Stopped' : 'Session closed'}
        </div>
      );
    case 'permission':
      return <PermissionCard roomId={roomId} item={item} />;
    case 'subagent':
      return <SubagentCard roomId={roomId} item={item} />;
  }
}

export function ExternalLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
