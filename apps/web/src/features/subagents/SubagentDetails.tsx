import { useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconButton } from '@/components/IconButton';
import { ExternalLink } from '@/features/chat/MessageList';
import { SUBAGENT_STATUS_BG } from '@/features/chat/SubagentCard';
import { ToolCard } from '@/features/chat/ToolCard';
import { useChatStore, type ChatState, type SubagentItem } from '@/features/chat/use-chat-store';
import { useSubagentDetailsStore } from '@/features/subagents/use-subagent-details-store';

type SubagentDetailsProps = { roomId: string; subagentId: string };

function selectSubagent(roomId: string, subagentId: string) {
  return (state: ChatState): SubagentItem | undefined => {
    const found = state.byRoom[roomId]?.find(
      (item) => item.kind === 'subagent' && item.id === subagentId,
    );
    return found?.kind === 'subagent' ? found : undefined;
  };
}

export function SubagentDetails({ roomId, subagentId }: SubagentDetailsProps) {
  const item = useChatStore(selectSubagent(roomId, subagentId));
  const closeDetails = useSubagentDetailsStore((state) => state.closeDetails);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [item]);

  return (
    <section className="subagent-details" aria-label="Sub-agent details">
      <div className="subagent-details__header">
        <IconButton icon="arrow-left" label="Back to chat" onClick={closeDetails} />
        {item && (
          <>
            <strong>{item.agentType}</strong>
            <Badge bg={SUBAGENT_STATUS_BG[item.status]}>{item.status}</Badge>
          </>
        )}
      </div>
      {item ? <DetailsBody item={item} /> : <p className="text-body-secondary">No details yet.</p>}
      <div ref={endRef} />
    </section>
  );
}

function DetailsBody({ item }: { item: SubagentItem }) {
  const stopped = item.status === 'stopped';
  return (
    <>
      <h6 className="text-body-secondary">Task</h6>
      <p>{item.description || 'Sub-agent'}</p>
      <h6 className="text-body-secondary">Prompt</h6>
      <pre className="subagent-details__prompt small">{item.prompt}</pre>
      <h6 className="text-body-secondary">Tool calls</h6>
      {item.tools.map((tool) => (
        <ToolCard
          key={tool.id}
          name={tool.name}
          input={tool.input}
          result={tool.result}
          stopped={stopped}
        />
      ))}
      {item.hiddenToolCalls > 0 && (
        <p className="subagent-details__hint small text-body-secondary">
          {item.hiddenToolCalls} more tool calls not shown
        </p>
      )}
      {item.status === 'done' && item.result !== null && (
        <>
          <h6 className="text-body-secondary">Result</h6>
          <div className="message message--assistant">
            <Markdown remarkPlugins={[remarkGfm]} components={{ a: ExternalLink }}>
              {item.result}
            </Markdown>
          </div>
        </>
      )}
      {item.status === 'error' && item.result !== null && (
        <>
          <h6 className="text-body-secondary">Result</h6>
          <Alert variant="danger" className="subagent-details__error">
            {item.result}
          </Alert>
        </>
      )}
      {stopped && <Badge bg="secondary">Stopped</Badge>}
    </>
  );
}
