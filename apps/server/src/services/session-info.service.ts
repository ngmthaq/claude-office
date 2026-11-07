import type { SessionInfo } from '@claude-office/shared';
import type { FastifyBaseLogger } from 'fastify';
import type { GitRepository } from '@/repositories/git.repository.ts';
import type { Session } from '@/repositories/session-store.repository.ts';
import type { EventBusService } from '@/services/event-bus.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';

export class SessionInfoService {
  private readonly refreshing = new Set<string>();

  constructor(
    private readonly gitRepository: GitRepository,
    private readonly eventBusService: EventBusService,
    private readonly log: FastifyBaseLogger,
  ) {}

  setModel(session: Session, model: string): void {
    this.apply(session, { model });
  }

  setEffort(session: Session, effort: string): void {
    this.apply(session, { effort });
  }

  async refreshWorkspace(session: Session): Promise<void> {
    await this.guarded(`workspace:${session.id}`, session, async () => {
      const branch = await this.gitRepository.currentBranch(session.folder);
      const provider =
        branch === null ? null : await this.gitRepository.remoteProvider(session.folder);
      const pr =
        provider === null ? null : await this.gitRepository.findPr(session.folder, provider);
      this.apply(session, {
        branch,
        prProvider: pr === null ? null : provider,
        prNumber: pr?.number ?? null,
        prUrl: pr?.url ?? null,
      });
    });
  }

  async refreshContext(session: Session): Promise<void> {
    await this.guarded(`context:${session.id}`, session, async () => {
      const active = session.query;
      if (!active) return;
      const usage = await active.getContextUsage({ detail: 'summary' });
      this.apply(session, {
        contextUsed: usage.totalTokens,
        contextMax: usage.maxTokens,
        contextPercent: Math.round(usage.percentage),
      });
    });
  }

  private async guarded(key: string, session: Session, task: () => Promise<void>): Promise<void> {
    if (this.refreshing.has(key)) return;
    this.refreshing.add(key);
    try {
      await task();
    } catch (error) {
      this.log.error(
        { roomId: session.id, err: ErrorUtil.errorName(error) },
        'info refresh failed',
      );
    } finally {
      this.refreshing.delete(key);
    }
  }

  private apply(session: Session, patch: Partial<SessionInfo>): void {
    const keys = Object.keys(patch) as (keyof SessionInfo)[];
    if (keys.every((key) => session.info[key] === patch[key])) return;
    session.info = { ...session.info, ...patch };
    this.eventBusService.notifyChanged();
  }
}
