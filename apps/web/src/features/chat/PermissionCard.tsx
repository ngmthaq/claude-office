import { sendClientEvent } from '@/features/connection/ws-client';
import { useChatStore, type PermissionItem } from '@/features/chat/use-chat-store';

type PermissionCardProps = { roomId: string; item: PermissionItem };

const STATUS_LABELS = { allow: 'Allowed', deny: 'Denied', cancelled: 'Cancelled' } as const;

export function PermissionCard({ roomId, item }: PermissionCardProps) {
  const heading = item.title ?? `Claude wants to use ${item.toolName}`;
  const inputText = JSON.stringify(item.input, null, 2) ?? '';

  function answer(decision: 'allow' | 'deny'): void {
    useChatStore.getState().markPermissionSending(roomId, item.id);
    sendClientEvent({ type: 'permission_answer', roomId, requestId: item.id, decision });
  }

  return (
    <div
      className={`permission-card permission-card--${item.status}`}
      role="group"
      aria-label={`Permission request: ${heading}`}
    >
      <div className="permission-card__head">
        <strong>{heading}</strong>
        <span className="permission-card__tool">{item.toolName}</span>
        {item.fromSubagent && <span className="permission-card__tag">from sub-agent</span>}
      </div>
      {item.description !== null && <p className="permission-card__desc">{item.description}</p>}
      <pre className="permission-card__input">{inputText}</pre>
      {item.status === 'pending' || item.status === 'sending' ? (
        <div className="permission-card__actions">
          <button
            type="button"
            className="permission-card__btn permission-card__btn--deny"
            disabled={item.status === 'sending'}
            onClick={() => answer('deny')}
          >
            Deny
          </button>
          <button
            type="button"
            className="permission-card__btn permission-card__btn--allow"
            disabled={item.status === 'sending'}
            onClick={() => answer('allow')}
          >
            Allow
          </button>
        </div>
      ) : (
        <div className="permission-card__status">{STATUS_LABELS[item.status]}</div>
      )}
    </div>
  );
}
