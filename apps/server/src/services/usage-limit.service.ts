import type { Query, SDKRateLimitInfo } from '@anthropic-ai/claude-agent-sdk';
import type { UsageLimit } from '@claude-office/shared';
import type { FastifyBaseLogger } from 'fastify';
import type { EventBusService } from '@/services/event-bus.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';

const SECONDS_LIMIT = 1e12;
const MS_PER_SECOND = 1000;

export class UsageLimitService {
  private static readonly usageMethod = 'usage_EXPERIMENTAL_MAY_CHANGE_DO_NOT_RELY_ON_THIS_API_YET';

  private limit: UsageLimit | null = null;
  private refreshing = false;

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly log: FastifyBaseLogger,
  ) {}

  current(): UsageLimit | null {
    return this.limit;
  }

  fromRateLimitEvent(info: SDKRateLimitInfo): void {
    if (info.rateLimitType !== 'five_hour') return;
    const resetsAt =
      info.resetsAt === undefined
        ? (this.limit?.resetsAt ?? null)
        : info.resetsAt < SECONDS_LIMIT
          ? info.resetsAt * MS_PER_SECOND
          : info.resetsAt;
    // The event's utilization unit is undocumented, so only the usage API sets it.
    this.apply(this.limit?.utilization ?? null, resetsAt);
  }

  async refresh(query: Query): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const response = await query[UsageLimitService.usageMethod]({ skipBehaviors: true });
      const fiveHour = response.rate_limits?.five_hour;
      if (!response.rate_limits_available || !fiveHour) return;
      const parsed = fiveHour.resets_at === null ? Number.NaN : Date.parse(fiveHour.resets_at);
      this.apply(fiveHour.utilization, Number.isNaN(parsed) ? null : parsed);
    } catch (error) {
      this.log.error({ err: ErrorUtil.errorName(error) }, 'usage limit refresh failed');
    } finally {
      this.refreshing = false;
    }
  }

  private apply(utilization: number | null, resetsAt: number | null): void {
    const previous = this.limit;
    this.limit = { utilization, resetsAt, updatedAt: Date.now() };
    if (previous?.utilization === utilization && previous.resetsAt === resetsAt) return;
    this.eventBusService.notifyUsageLimitChanged();
  }
}
