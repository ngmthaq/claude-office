import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from '@/components/atoms/ExternalLink';
import { SYSTEM_EVENT_TEXT } from '@/configs/ui.config';
import { EventContentUtil } from '@/utils/event-content.util';

type SystemEventCardProps = { name: string; content: string; isError: boolean };

export function SystemEventCard({ name, content, isError }: SystemEventCardProps) {
  const view = EventContentUtil.detect(content);
  return (
    <Card
      as="details"
      className={`system-card mb-2${isError ? ' system-card--error border-danger' : ''}`}
    >
      <summary className="card-header d-flex align-items-center gap-2">
        <i
          className={isError ? 'bi bi-exclamation-triangle text-danger' : 'bi bi-info-circle'}
          aria-hidden="true"
        />
        <strong className="flex-grow-1 text-truncate">{name}</strong>
        {isError && <Badge bg="danger">{SYSTEM_EVENT_TEXT.errorLabel}</Badge>}
      </summary>
      <Card.Body className="p-2 small">
        {content.trim() === '' && (
          <span className="text-body-secondary">{SYSTEM_EVENT_TEXT.emptyContent}</span>
        )}
        {content.trim() !== '' && view.format === 'json' && <pre className="mb-0">{view.text}</pre>}
        {content.trim() !== '' && view.format === 'markdown' && (
          <div className="system-card__body">
            <Markdown remarkPlugins={[remarkGfm]} components={{ a: ExternalLink }}>
              {view.text}
            </Markdown>
          </div>
        )}
        {content.trim() !== '' && view.format === 'text' && (
          <div className="system-card__text">{view.text}</div>
        )}
      </Card.Body>
    </Card>
  );
}
