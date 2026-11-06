import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from '@/features/chat/MessageList';
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
        <button type="button" onClick={closeDetails}>
          Back to chat
        </button>
        {item && (
          <>
            <strong>{item.agentType}</strong>
            <span className={`subagent-chip subagent-chip--${item.status}`}>{item.status}</span>
          </>
        )}
      </div>
      {item ? <DetailsBody item={item} /> : <p>No details yet.</p>}
      <div ref={endRef} />
    </section>
  );
}

function DetailsBody({ item }: { item: SubagentItem }) {
  const stopped = item.status === 'stopped';
  return (
    <>
      <h4>Task</h4>
      <p>{item.description || 'Sub-agent'}</p>
      <h4>Prompt</h4>
      <pre className="subagent-details__prompt">{item.prompt}</pre>
      <h4>Tool calls</h4>
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
        <div className="subagent-details__hint">
          {item.hiddenToolCalls} more tool calls not shown
        </div>
      )}
      {item.status === 'done' && item.result !== null && (
        <>
          <h4>Result</h4>
          <div className="message message--assistant">
            <Markdown remarkPlugins={[remarkGfm]} components={{ a: ExternalLink }}>
              {item.result}
            </Markdown>
          </div>
        </>
      )}
      {item.status === 'error' && item.result !== null && (
        <>
          <h4>Result</h4>
          <div className="subagent-details__error" role="alert">
            {item.result}
          </div>
        </>
      )}
      {stopped && <div className="notice-line">Stopped</div>}
    </>
  );
}
