import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import type { ToolResult } from '@/features/chat/use-chat-store';

type ToolCardProps = {
  name: string;
  input: unknown;
  result: ToolResult | null;
  stopped?: boolean;
};

type ToolStatus = 'running' | 'stopped' | 'error' | 'done';

const STATUS_BG: Record<ToolStatus, string> = {
  running: 'info',
  stopped: 'secondary',
  error: 'danger',
  done: 'success',
};

export function ToolCard({ name, input, result, stopped }: ToolCardProps) {
  const status: ToolStatus =
    result === null ? (stopped ? 'stopped' : 'running') : result.isError ? 'error' : 'done';

  return (
    <Card as="details" className={`tool-card tool-card--${status} mb-2`}>
      <summary className="card-header d-flex align-items-center justify-content-between gap-2">
        <span className="font-monospace small">
          <i className="bi bi-tools me-1" aria-hidden="true" />
          {name}
        </span>
        <Badge bg={STATUS_BG[status]}>{status}</Badge>
      </summary>
      <Card.Body className="p-2">
        <h6 className="text-body-secondary">Input</h6>
        <pre className="small mb-2">{JSON.stringify(input, null, 2) ?? ''}</pre>
        {result !== null && (
          <>
            <h6 className="text-body-secondary">Result</h6>
            <pre className="small mb-0">{result.content}</pre>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
