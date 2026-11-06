import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PeerMessageEvent } from '@claude-office/shared';
import { ExternalLink } from '@/components/atoms/ExternalLink';
import {
  PEER_CARD_TEXT,
  REPORT_STATUS_BG,
  TASK_STATUS_BADGE,
  TASK_TITLE_PREFIX,
} from '@/configs/ui.config';
import { ReportStatusUtil } from '@/utils/report-status.util';

type PeerMessageCardProps = {
  senderName: string | null;
  source: PeerMessageEvent['source'];
  title: string | null;
  taskStatus: PeerMessageEvent['taskStatus'];
  body: string;
  onOpenSubagent?: () => void;
};

function peerDetail(
  source: PeerMessageEvent['source'],
  senderName: string | null,
  customTitle: string | null,
): string {
  if (source === 'task') {
    const title = customTitle?.startsWith(TASK_TITLE_PREFIX)
      ? customTitle.slice(TASK_TITLE_PREFIX.length)
      : customTitle;
    return title || PEER_CARD_TEXT.taskDetailFallback;
  }
  return (
    senderName ??
    (source === 'handback'
      ? PEER_CARD_TEXT.handbackDetailFallback
      : PEER_CARD_TEXT.peerDetailFallback)
  );
}

export function PeerMessageCard({
  senderName,
  source,
  title: customTitle,
  taskStatus,
  body,
  onOpenSubagent,
}: PeerMessageCardProps) {
  const detail = peerDetail(source, senderName, customTitle);
  const label = source === 'peer' ? PEER_CARD_TEXT.messageLabel : PEER_CARD_TEXT.resultLabel;
  const status =
    ReportStatusUtil.parse(body) ??
    (source === 'task' && taskStatus !== null ? TASK_STATUS_BADGE[taskStatus] : 'report');

  return (
    <Card as="details" className="peer-card mb-2">
      <summary className="card-header d-flex align-items-center gap-2">
        <i className="bi bi-robot" aria-hidden="true" />
        <strong>{label}</strong>
        <span className="flex-grow-1 text-truncate text-body-secondary">{detail}</span>
        {source !== 'peer' && (
          <Badge bg={REPORT_STATUS_BG[status]}>
            {status === 'report' ? PEER_CARD_TEXT.reportBadge : status}
          </Badge>
        )}
      </summary>
      <Card.Body className="p-2">
        {onOpenSubagent !== undefined && (
          <Button variant="link" size="sm" className="p-0 mb-2" onClick={onOpenSubagent}>
            {PEER_CARD_TEXT.openSubagent}
          </Button>
        )}
        <h6 className="text-body-secondary">{PEER_CARD_TEXT.reportHeading}</h6>
        <div className="peer-card__body small">
          <Markdown remarkPlugins={[remarkGfm]} components={{ a: ExternalLink }}>
            {body}
          </Markdown>
        </div>
      </Card.Body>
    </Card>
  );
}
