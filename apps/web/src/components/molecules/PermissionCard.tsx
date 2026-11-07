import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PERMISSION_STATUS_BG, PERMISSION_STATUS_LABELS } from '@/configs/ui.config';
import type { PermissionItem } from '@/dtos/permission-item.dto';

type PermissionCardProps = {
  item: PermissionItem;
  onAnswer: (decision: 'allow' | 'deny') => void;
};

export function PermissionCard({ item, onAnswer }: PermissionCardProps) {
  const heading = item.title ?? `Claude wants to use ${item.toolName}`;
  const inputText = JSON.stringify(item.input, null, 2) ?? '';

  return (
    <Card
      className={`permission-card permission-card--${item.status} mb-2`}
      role="group"
      aria-label={`Permission request: ${heading}`}
    >
      <Card.Header className="d-flex flex-wrap align-items-center gap-2">
        <strong>{heading}</strong>
        <Badge bg="secondary" className="font-monospace">
          {item.toolName}
        </Badge>
        {item.fromSubagent && <Badge bg="info">from sub-agent</Badge>}
      </Card.Header>
      <Card.Body className="p-2">
        {item.description !== null && <p className="small mb-2">{item.description}</p>}
        <pre className="small mb-2">{inputText}</pre>
        {item.status === 'pending' || item.status === 'sending' ? (
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              disabled={item.status === 'sending'}
              onClick={() => onAnswer('deny')}
            >
              Deny
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled={item.status === 'sending'}
              onClick={() => onAnswer('allow')}
            >
              Allow
            </Button>
          </div>
        ) : (
          <Badge bg={PERMISSION_STATUS_BG[item.status]}>
            {PERMISSION_STATUS_LABELS[item.status]}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
}
