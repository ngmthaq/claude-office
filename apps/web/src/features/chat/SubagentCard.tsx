import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import type { SubagentItem } from '@/features/chat/use-chat-store';
import { useSubagentDetailsStore } from '@/features/subagents/use-subagent-details-store';

type SubagentCardProps = { roomId: string; item: SubagentItem };

export const SUBAGENT_STATUS_BG: Record<SubagentItem['status'], string> = {
  working: 'info',
  done: 'success',
  error: 'danger',
  stopped: 'secondary',
};

export function SubagentCard({ roomId, item }: SubagentCardProps) {
  const openDetails = useSubagentDetailsStore((state) => state.openDetails);
  const task = item.description || 'Sub-agent';

  return (
    <Card
      as="button"
      type="button"
      className="subagent-card text-start w-100 mb-2"
      aria-label={`Open details of sub-agent ${item.agentType}: ${task}`}
      onClick={() => openDetails(roomId, item.id)}
    >
      <Card.Body className="d-flex align-items-center gap-2 p-2">
        <i className="bi bi-robot" aria-hidden="true" />
        <strong>{item.agentType}</strong>
        <span className="flex-grow-1 text-truncate text-body-secondary">{task}</span>
        <Badge bg={SUBAGENT_STATUS_BG[item.status]}>{item.status}</Badge>
      </Card.Body>
    </Card>
  );
}
