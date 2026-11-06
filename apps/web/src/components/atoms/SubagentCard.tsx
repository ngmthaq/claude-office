import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { SUBAGENT_STATUS_BG } from '@/configs/ui.config';
import type { SubagentItem } from '@/dtos/subagent-item.dto';

type SubagentCardProps = { item: SubagentItem; onOpen: () => void };

export function SubagentCard({ item, onOpen }: SubagentCardProps) {
  const task = item.description || 'Sub-agent';

  return (
    <Card
      as="button"
      type="button"
      className="subagent-card text-start w-100 mb-2"
      aria-label={`Open details of sub-agent ${item.agentType}: ${task}`}
      onClick={onOpen}
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
