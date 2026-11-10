import type { InternalEventsEvent, RoomEvent } from '@claude-office/shared';
import { INTERNAL_EVENTS_KEEP_MAX } from '@/configs/limits.config.ts';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class InternalEventsUtil {
  /** Joins an internal entry into the last item when that item is internal, else adds it. */
  static append(events: RoomEvent[], entry: InternalEventsEvent): void {
    const last = events.at(-1);
    if (last?.type !== 'internal_events') {
      events.push(entry);
      return;
    }
    events[events.length - 1] = {
      ...last,
      total: last.total + entry.total,
      items: [...last.items, ...entry.items].slice(-INTERNAL_EVENTS_KEEP_MAX),
      time: entry.time,
    };
  }
}
