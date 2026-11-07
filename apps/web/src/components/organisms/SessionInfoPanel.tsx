import type { ReactNode } from 'react';
import { ExternalLink } from '@/components/atoms/ExternalLink';
import { IconButton } from '@/components/atoms/IconButton';
import { PR_LABEL_BY_PROVIDER, PR_TITLE_BY_PROVIDER, SESSION_INFO_TEXT } from '@/configs/ui.config';
import { useSessionInfoStore } from '@/hooks/store/useSessionInfoStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { TokenFormatUtil } from '@/utils/token-format.util';

type SessionInfoPanelProps = { roomId: string; roomName: string };
type RowProps = { label: string; children: ReactNode };

function Row({ label, children }: RowProps) {
  return (
    <>
      <dt className="session-info__label fw-normal">{label}</dt>
      <dd className="session-info__value">{children}</dd>
    </>
  );
}

export function SessionInfoPanel({ roomId, roomName }: SessionInfoPanelProps) {
  const room = useSessionsStore((state) => state.rooms.find((r) => r.id === roomId));
  const close = useSessionInfoStore((state) => state.close);

  if (!room) return null;

  const { info } = room;
  const { prProvider, prNumber, prUrl } = info;
  const hasPr = prProvider !== null && prNumber !== null && prUrl !== null;
  const { contextUsed, contextMax, contextPercent } = info;

  return (
    <main className="chat-panel" aria-label={SESSION_INFO_TEXT.title}>
      <div className="chat-panel__header">
        <IconButton icon="arrow-left" label={SESSION_INFO_TEXT.back} onClick={close} />
        <div className="chat-panel__title fw-semibold text-truncate" title={roomName}>
          {SESSION_INFO_TEXT.title} · {roomName}
        </div>
      </div>
      <div className="session-info__body">
        <dl className="session-info__list">
          <Row label={SESSION_INFO_TEXT.folder}>
            <span className="session-info__path">{room.folder}</span>
          </Row>
          <Row label={SESSION_INFO_TEXT.branch}>{info.branch ?? SESSION_INFO_TEXT.empty}</Row>
          <Row
            label={prProvider !== null ? PR_TITLE_BY_PROVIDER[prProvider] : SESSION_INFO_TEXT.pr}
          >
            {hasPr ? (
              <ExternalLink
                href={prUrl}
              >{`${PR_LABEL_BY_PROVIDER[prProvider]}${prNumber}`}</ExternalLink>
            ) : (
              SESSION_INFO_TEXT.empty
            )}
          </Row>
          <Row label={SESSION_INFO_TEXT.model}>{info.model ?? SESSION_INFO_TEXT.empty}</Row>
          <Row label={SESSION_INFO_TEXT.effort}>{info.effort ?? SESSION_INFO_TEXT.empty}</Row>
          <Row label={SESSION_INFO_TEXT.context}>
            {contextUsed !== null && contextMax !== null && contextPercent !== null
              ? `${contextPercent}% · ${TokenFormatUtil.short(contextUsed)} / ${TokenFormatUtil.short(contextMax)}`
              : SESSION_INFO_TEXT.empty}
          </Row>
        </dl>
      </div>
    </main>
  );
}
