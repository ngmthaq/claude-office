import type { InternalEventItem } from '@claude-office/shared';
import { INTERNAL_EVENTS_TEXT } from '@/configs/ui.config';

type InternalEventsRowProps = { total: number; items: InternalEventItem[] };

export function InternalEventsRow({ total, items }: InternalEventsRowProps) {
  const hidden = total - items.length;
  return (
    <details className="internal-row text-body-secondary small">
      <summary>{INTERNAL_EVENTS_TEXT.summary(total)}</summary>
      <ul className="internal-row__list list-unstyled mb-0 mt-1">
        {hidden > 0 && <li className="fst-italic">{INTERNAL_EVENTS_TEXT.olderHidden(hidden)}</li>}
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="text-break">
            <strong>{item.name}</strong>
            {item.detail !== '' && <span> {item.detail}</span>}
          </li>
        ))}
      </ul>
    </details>
  );
}
