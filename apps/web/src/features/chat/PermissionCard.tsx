import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { IconButton } from '@/components/IconButton';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useChatStore, type PermissionItem } from '@/features/chat/use-chat-store';

type PermissionCardProps = { roomId: string; item: PermissionItem };

const STATUS_LABELS = { allow: 'Allowed', deny: 'Denied', cancelled: 'Cancelled' } as const;
const STATUS_BG = { allow: 'success', deny: 'danger', cancelled: 'secondary' } as const;

export function PermissionCard({ roomId, item }: PermissionCardProps) {
  const heading = item.title ?? `Claude wants to use ${item.toolName}`;
  const inputText = JSON.stringify(item.input, null, 2) ?? '';

  function answer(decision: 'allow' | 'deny'): void {
    useChatStore.getState().markPermissionSending(roomId, item.id);
    sendClientEvent({ type: 'permission_answer', roomId, requestId: item.id, decision });
  }

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
            <IconButton
              icon="x-lg"
              label="Deny"
              variant="outline-danger"
              disabled={item.status === 'sending'}
              onClick={() => answer('deny')}
            />
            <IconButton
              icon="check-lg"
              label="Allow"
              variant="success"
              disabled={item.status === 'sending'}
              onClick={() => answer('allow')}
            />
          </div>
        ) : (
          <Badge bg={STATUS_BG[item.status]}>{STATUS_LABELS[item.status]}</Badge>
        )}
      </Card.Body>
    </Card>
  );
}
