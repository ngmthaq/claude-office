import { USAGE_LIMIT_TEXT } from '@/configs/ui.config';
import { CountdownUtil } from '@/utils/countdown.util';

type UsageLimitBadgeProps = {
  utilization: number | null;
  resetsAt: number | null;
  now: number;
};

export function UsageLimitBadge({ utilization, resetsAt, now }: UsageLimitBadgeProps) {
  const parts: string[] = [];
  if (resetsAt !== null) {
    const countdown = CountdownUtil.short(resetsAt - now);
    parts.push(
      countdown === USAGE_LIMIT_TEXT.resetNow
        ? countdown
        : `${USAGE_LIMIT_TEXT.resetsIn} ${countdown}`,
    );
  }
  if (utilization !== null) {
    parts.push(`${Math.round(utilization)}% ${USAGE_LIMIT_TEXT.used}`);
  }
  const title =
    resetsAt === null
      ? USAGE_LIMIT_TEXT.titleDefault
      : `${USAGE_LIMIT_TEXT.titleAt} ${new Date(resetsAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`;

  return (
    <span className="small text-body-secondary align-self-center text-nowrap me-3" title={title}>
      <i className="bi bi-hourglass-split me-1" aria-hidden="true" />
      {parts.join(' · ')}
    </span>
  );
}
