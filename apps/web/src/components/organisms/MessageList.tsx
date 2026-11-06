import Alert from 'react-bootstrap/Alert';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AuthErrorNotice } from '@/components/atoms/AuthErrorNotice';
import { ExternalLink } from '@/components/atoms/ExternalLink';
import { SubagentCard } from '@/components/atoms/SubagentCard';
import { ToolCard } from '@/components/atoms/ToolCard';
import { PermissionCard } from '@/components/molecules/PermissionCard';
import type { ChatItem } from '@/dtos/chat-item.dto';
import { useAutoScroll } from '@/hooks/feature/useAutoScroll';
import { selectRoomItems, useChatStore } from '@/hooks/store/useChatStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';
import { wsClientService } from '@/services/ws-client.service';

type MessageListProps = { roomId: string };

export function MessageList({ roomId }: MessageListProps) {
  const items = useChatStore(selectRoomItems(roomId));
  const openDetails = useSubagentDetailsStore((state) => state.openDetails);
  const endRef = useAutoScroll(items);

  function answerPermission(requestId: string, decision: 'allow' | 'deny'): void {
    useChatStore.getState().markPermissionSending(roomId, requestId);
    wsClientService.send({ type: 'permission_answer', roomId, requestId, decision });
  }

  return (
    <div className="message-list">
      {items.map((item) => (
        <ChatItemView
          key={`${item.kind}-${item.id}`}
          item={item}
          onAnswerPermission={answerPermission}
          onOpenSubagent={(subagentId) => openDetails(roomId, subagentId)}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}

type ChatItemViewProps = {
  item: ChatItem;
  onAnswerPermission: (requestId: string, decision: 'allow' | 'deny') => void;
  onOpenSubagent: (subagentId: string) => void;
};

function ChatItemView({ item, onAnswerPermission, onOpenSubagent }: ChatItemViewProps) {
  switch (item.kind) {
    case 'user':
      return <div className="message message--user rounded-3">{item.text}</div>;
    case 'assistant':
      return (
        <div className="message message--assistant rounded-3">
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
        <Alert variant="danger" className="py-2 mb-0">
          {item.message}
        </Alert>
      );
    case 'auth':
      return <AuthErrorNotice message={item.message} />;
    case 'notice':
      return (
        <div className="notice-line text-body-secondary small text-center">
          {item.notice === 'stopped' ? 'Stopped' : 'Session closed'}
        </div>
      );
    case 'permission':
      return (
        <PermissionCard
          item={item}
          onAnswer={(decision) => onAnswerPermission(item.id, decision)}
        />
      );
    case 'subagent':
      return <SubagentCard item={item} onOpen={() => onOpenSubagent(item.id)} />;
  }
}
