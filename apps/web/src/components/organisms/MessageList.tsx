import { useMemo } from 'react';
import Alert from 'react-bootstrap/Alert';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AuthErrorNotice } from '@/components/atoms/AuthErrorNotice';
import { ExternalLink } from '@/components/atoms/ExternalLink';
import { PeerMessageCard } from '@/components/atoms/PeerMessageCard';
import { InternalEventsRow } from '@/components/atoms/InternalEventsRow';
import { SubagentCard } from '@/components/atoms/SubagentCard';
import { SystemEventCard } from '@/components/atoms/SystemEventCard';
import { ToolCard } from '@/components/atoms/ToolCard';
import { AskUserQuestionCard } from '@/components/molecules/AskUserQuestionCard';
import { AttachmentList } from '@/components/molecules/AttachmentList';
import { PermissionCard } from '@/components/molecules/PermissionCard';
import { parseAskUserQuestionInput } from '@/dtos/ask-user-question.dto';
import type { ChatItem } from '@/dtos/chat-item.dto';
import { useAutoScroll } from '@/hooks/feature/useAutoScroll';
import { EMPTY_QUESTION_PROGRESS, type QuestionProgress } from '@/dtos/question-progress.dto';
import { NO_QUESTIONS, useChatDraftStore } from '@/hooks/store/useChatDraftStore';
import { selectRoomItems, useChatStore } from '@/hooks/store/useChatStore';
import { useSubagentDetailsStore } from '@/hooks/store/useSubagentDetailsStore';
import { wsClientService } from '@/services/ws-client.service';

type MessageListProps = { roomId: string };

export function MessageList({ roomId }: MessageListProps) {
  const items = useChatStore(selectRoomItems(roomId));
  const questionProgress = useChatDraftStore(
    (state) => state.byRoom[roomId]?.questions ?? NO_QUESTIONS,
  );
  const openDetails = useSubagentDetailsStore((state) => state.openDetails);
  const subagentIds = useMemo(
    () => new Set(items.filter((item) => item.kind === 'subagent').map((item) => item.id)),
    [items],
  );
  const endRef = useAutoScroll(items);

  function answerPermission(
    requestId: string,
    decision: 'allow' | 'deny',
    answers?: Record<string, string>,
  ): void {
    useChatStore.getState().markPermissionSending(roomId, requestId, answers);
    wsClientService.send({
      type: 'permission_answer',
      roomId,
      requestId,
      decision,
      ...(answers === undefined ? {} : { answers }),
    });
  }

  return (
    <div className="message-list">
      {items.map((item) => (
        <ChatItemView
          key={`${item.kind}-${item.id}`}
          item={item}
          subagentIds={subagentIds}
          questionProgress={questionProgress}
          onQuestionProgress={(requestId, progress) =>
            useChatDraftStore.getState().setQuestionProgress(roomId, requestId, progress)
          }
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
  subagentIds: ReadonlySet<string>;
  questionProgress: Record<string, QuestionProgress>;
  onQuestionProgress: (requestId: string, progress: QuestionProgress) => void;
  onAnswerPermission: (
    requestId: string,
    decision: 'allow' | 'deny',
    answers?: Record<string, string>,
  ) => void;
  onOpenSubagent: (subagentId: string) => void;
};

function ChatItemView({
  item,
  subagentIds,
  questionProgress,
  onQuestionProgress,
  onAnswerPermission,
  onOpenSubagent,
}: ChatItemViewProps) {
  switch (item.kind) {
    case 'user':
      return (
        <div className="message-user">
          {item.text !== '' && <div className="message message--user rounded-3">{item.text}</div>}
          {item.attachments !== undefined && <AttachmentList items={item.attachments} />}
        </div>
      );
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
    case 'permission': {
      const questions =
        item.toolName === 'AskUserQuestion' ? parseAskUserQuestionInput(item.input) : null;
      if (questions !== null) {
        return (
          <AskUserQuestionCard
            item={item}
            questions={questions}
            progress={questionProgress[item.id] ?? EMPTY_QUESTION_PROGRESS}
            onProgressChange={(progress) => onQuestionProgress(item.id, progress)}
            onSubmit={(answers) => onAnswerPermission(item.id, 'allow', answers)}
            onSkip={() => onAnswerPermission(item.id, 'deny')}
          />
        );
      }
      return (
        <PermissionCard
          item={item}
          onAnswer={(decision) => onAnswerPermission(item.id, decision)}
        />
      );
    }
    case 'peer':
      return (
        <PeerMessageCard
          senderName={item.senderName}
          source={item.source}
          title={item.title}
          taskStatus={item.taskStatus}
          body={item.body}
          onOpenSubagent={
            item.subagentId !== null && subagentIds.has(item.subagentId)
              ? onOpenSubagent.bind(null, item.subagentId)
              : undefined
          }
        />
      );
    case 'system':
      return <SystemEventCard name={item.name} content={item.content} isError={item.isError} />;
    case 'internal':
      return <InternalEventsRow total={item.total} items={item.items} />;
    case 'subagent':
      return <SubagentCard item={item} onOpen={() => onOpenSubagent(item.id)} />;
  }
}
