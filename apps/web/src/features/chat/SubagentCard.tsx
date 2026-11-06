import type { SubagentItem } from '@/features/chat/use-chat-store';
import { useSubagentDetailsStore } from '@/features/subagents/use-subagent-details-store';

type SubagentCardProps = { roomId: string; item: SubagentItem };

export function SubagentCard({ roomId, item }: SubagentCardProps) {
  const openDetails = useSubagentDetailsStore((state) => state.openDetails);
  const task = item.description || 'Sub-agent';

  return (
    <button
      type="button"
      className="subagent-card"
      aria-label={`Open details of sub-agent ${item.agentType}: ${task}`}
      onClick={() => openDetails(roomId, item.id)}
    >
      <span className="subagent-card__type">{item.agentType}</span>
      <span className="subagent-card__task">{task}</span>
      <span className={`subagent-chip subagent-chip--${item.status}`}>{item.status}</span>
    </button>
  );
}
