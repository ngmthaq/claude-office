import type { ArchivedRoom, PermissionMode } from '@claude-office/shared';
import type { FastifyBaseLogger } from 'fastify';
import type { RoomRepository } from '@/repositories/room.repository.ts';
import type { SessionStoreRepository } from '@/repositories/session-store.repository.ts';
import type { EventBusService } from '@/services/event-bus.service.ts';
import type { SessionService } from '@/services/session.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { SessionMapperUtil } from '@/utils/session-mapper.util.ts';

export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly sessionStoreRepository: SessionStoreRepository,
    private readonly eventBusService: EventBusService,
    private readonly sessionService: SessionService,
    private readonly log: FastifyBaseLogger,
  ) {}

  rename(roomId: string, name: string): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'rename ignored: unknown room');
      return;
    }
    const value = name === '' ? null : name;
    this.roomRepository.setName(roomId, value);
    session.name = value;
    this.eventBusService.notifyChanged();
  }

  async setPermissionMode(roomId: string, mode: PermissionMode): Promise<void> {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'permission mode ignored: unknown room');
      return;
    }
    try {
      if (session.query) await session.query.setPermissionMode(mode);
    } catch (error) {
      this.log.error(
        { roomId, mode, err: ErrorUtil.errorName(error) },
        'permission mode change failed',
      );
      this.eventBusService.emit(
        session,
        SessionMapperUtil.errorEvent(
          roomId,
          'permission_mode_failed',
          'Could not change the permission mode.',
        ),
      );
      return;
    }
    this.roomRepository.setPermissionMode(roomId, mode);
    session.permissionMode = mode;
    this.log.info({ roomId, mode }, 'permission mode changed');
    this.eventBusService.notifyChanged();
  }

  archive(roomId: string): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'archive ignored: unknown room');
      return;
    }
    if (!session.closed) this.sessionService.close(roomId);
    this.sessionService.clearStopTimer(session);
    this.roomRepository.setArchived(roomId, Date.now());
    this.sessionStoreRepository.delete(roomId);
    this.log.info({ roomId }, 'session archived');
    this.eventBusService.notifyChanged();
    this.eventBusService.notifyArchivedChanged();
  }

  remove(roomId: string): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'remove ignored: unknown room');
      return;
    }
    if (!session.closed) this.sessionService.close(roomId);
    this.sessionService.clearStopTimer(session);
    this.sessionStoreRepository.delete(roomId);
    this.roomRepository.delete(roomId);
    this.log.info({ roomId }, 'room removed');
    this.eventBusService.notifyChanged();
  }

  listArchived(): ArchivedRoom[] {
    const seen = new Set<string>();
    const rooms: ArchivedRoom[] = [];
    for (const row of this.roomRepository.listArchived()) {
      if (row.sessionId === null || row.archivedAt === null || seen.has(row.sessionId)) continue;
      seen.add(row.sessionId);
      const newest = this.roomRepository.getNewestBySessionId(row.sessionId);
      if (newest && newest.id !== row.id && newest.archivedAt === null) continue;
      rooms.push({
        id: row.id,
        name: row.name,
        folder: row.folder,
        sessionId: row.sessionId,
        archivedAt: row.archivedAt,
      });
    }
    return rooms;
  }

  restore(roomId: string): void {
    const row = this.roomRepository.get(roomId);
    if (!row || row.archivedAt === null) {
      this.log.info({ roomId }, 'restore ignored: not archived');
      return;
    }
    this.sessionService.restoreRow(row);
  }
}
