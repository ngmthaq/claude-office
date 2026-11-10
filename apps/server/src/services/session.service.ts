import { randomUUID } from 'node:crypto';
import { getSessionInfo, query, type Query, type SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import {
  EMPTY_SESSION_INFO,
  ROOM_NAME_MAX,
  type AttachmentUpload,
  type HistoryEntry,
  type RoomEvent,
  type RoomSummary,
} from '@claude-office/shared';
import type { FastifyBaseLogger } from 'fastify';
import { ROOM_EVENT_BUFFER_MAX, STOP_TIMEOUT_MS } from '@/configs/limits.config.ts';
import { SDK_EXTRA_ARGS, SETTING_SOURCES } from '@/configs/sdk.config.ts';
import type { ResumeResult } from '@/dtos/resume-result.dto.ts';
import type { RoomRow } from '@/dtos/room-row.dto.ts';
import type { StartResult } from '@/dtos/start-result.dto.ts';
import type { FolderRepository } from '@/repositories/folder.repository.ts';
import type { HistoryRepository } from '@/repositories/history.repository.ts';
import type { SubagentTranscriptRepository } from '@/repositories/subagent-transcript.repository.ts';
import type { RoomRepository } from '@/repositories/room.repository.ts';
import type { Session, SessionStoreRepository } from '@/repositories/session-store.repository.ts';
import type { AttachmentService } from '@/services/attachment.service.ts';
import type { EventBusService } from '@/services/event-bus.service.ts';
import type { PermissionService } from '@/services/permission.service.ts';
import type { SessionInfoService } from '@/services/session-info.service.ts';
import type { SdkEventMapperService } from '@/services/sdk-event-mapper.service.ts';
import type { UsageLimitService } from '@/services/usage-limit.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { InputQueue } from '@/utils/input-queue.util.ts';
import { SessionMapperUtil } from '@/utils/session-mapper.util.ts';

class LoadSkipped extends Error {}

export class SessionService {
  private readonly resuming = new Map<string, Promise<ResumeResult>>();

  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly sessionStoreRepository: SessionStoreRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly subagentTranscriptRepository: SubagentTranscriptRepository,
    private readonly folderRepository: FolderRepository,
    private readonly sdkEventMapperService: SdkEventMapperService,
    private readonly eventBusService: EventBusService,
    private readonly permissionService: PermissionService,
    private readonly sessionInfoService: SessionInfoService,
    private readonly usageLimitService: UsageLimitService,
    private readonly attachmentService: AttachmentService,
    private readonly log: FastifyBaseLogger,
  ) {}

  start(folder: string): StartResult {
    const resolved = this.folderRepository.resolveFolder(folder);
    if (!resolved.ok) return resolved;

    const session: Session = {
      id: randomUUID(),
      name: null,
      title: null,
      folder: resolved.value,
      createdAt: Date.now(),
      sessionId: null,
      resumedFrom: null,
      busy: false,
      state: 'idle',
      events: [],
      input: null,
      query: null,
      closed: false,
      historyLoaded: true,
      historyLoading: null,
      stopTimer: null,
      mapper: this.sdkEventMapperService.createMapperState(),
      pending: new Map(),
      terminalCommands: new Set(),
      permissionMode: 'default',
      info: { ...EMPTY_SESSION_INFO },
    };
    this.roomRepository.insert(session.id, session.folder, session.createdAt);
    this.sessionStoreRepository.set(session.id, session);
    void this.sessionInfoService.refreshWorkspace(session);
    this.log.info({ roomId: session.id }, 'session started');
    this.eventBusService.notifyChanged();
    return { ok: true, room: this.toSummary(session) };
  }

  resume(sessionId: string): Promise<ResumeResult> {
    const open = this.sessionStoreRepository.findBySessionId(sessionId);
    if (open) return Promise.resolve({ ok: true, room: this.toSummary(open) });
    const newest = this.roomRepository.getNewestBySessionId(sessionId);
    if (newest?.archivedAt != null) {
      const restored = this.restoreRow(newest);
      if (restored) return Promise.resolve({ ok: true, room: this.toSummary(restored) });
    }
    const inFlight = this.resuming.get(sessionId);
    if (inFlight) return inFlight;
    const promise = this.doResume(sessionId).finally(() => this.resuming.delete(sessionId));
    this.resuming.set(sessionId, promise);
    return promise;
  }

  listHistory(): Promise<HistoryEntry[]> {
    return this.historyRepository.listHistory(
      (sessionId) => this.sessionStoreRepository.findBySessionId(sessionId)?.id ?? null,
    );
  }

  send(roomId: string, text: string, attachments?: readonly AttachmentUpload[]): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.eventBusService.emitUnknownRoom(roomId);
      return;
    }
    if (session.busy) {
      this.eventBusService.emit(
        session,
        SessionMapperUtil.errorEvent(
          roomId,
          'busy',
          'Claude is still working on the last message.',
        ),
      );
      return;
    }

    const prepared =
      attachments && attachments.length > 0 ? this.attachmentService.prepare(attachments) : null;
    if (prepared && !prepared.ok) {
      this.log.info({ roomId, count: attachments?.length }, 'attachments rejected');
      this.eventBusService.emit(
        session,
        SessionMapperUtil.errorEvent(roomId, 'attachment_rejected', prepared.message),
      );
      return;
    }

    session.closed = false;
    this.eventBusService.emit(session, {
      type: 'user_message',
      roomId,
      messageId: randomUUID(),
      text,
      time: Date.now(),
      ...(prepared ? { attachments: prepared.info } : {}),
    });
    this.setBusy(session, true);
    const content = prepared
      ? [...prepared.blocks, ...(text.trim() === '' ? [] : [{ type: 'text' as const, text }])]
      : text;
    this.ensureQuery(session).push({
      type: 'user',
      message: { role: 'user', content },
      parent_tool_use_id: null,
    });
  }

  roomFolder(roomId: string): string | undefined {
    return this.sessionStoreRepository.get(roomId)?.folder;
  }

  loadClosedRooms(): void {
    const seen = new Set<string>();
    for (const row of this.roomRepository.listWithSession()) {
      if (row.sessionId === null || seen.has(row.sessionId)) continue;
      seen.add(row.sessionId);
      if (row.archivedAt !== null) continue;
      const session = this.sessionStoreRepository.closedSession(
        row,
        row.sessionId,
        this.sdkEventMapperService.createMapperState(),
      );
      this.sessionStoreRepository.set(row.id, session);
      void this.refreshTitle(session);
    }
    this.log.info({ count: this.sessionStoreRepository.size }, 'closed rooms loaded');
  }

  restoreRow(row: RoomRow): Session | undefined {
    if (row.sessionId === null) return undefined;
    this.roomRepository.setArchived(row.id, null);
    let session = this.sessionStoreRepository.findBySessionId(row.sessionId);
    if (!session) {
      session = this.sessionStoreRepository.closedSession(
        row,
        row.sessionId,
        this.sdkEventMapperService.createMapperState(),
      );
      this.sessionStoreRepository.set(row.id, session);
    }
    void this.sessionInfoService.refreshWorkspace(session);
    this.log.info({ roomId: session.id }, 'session restored');
    this.eventBusService.notifyChanged();
    this.eventBusService.notifyArchivedChanged();
    return session;
  }

  stop(roomId: string): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'stop ignored: unknown room');
      return;
    }
    const { query: active } = session;
    if (!active || !(session.busy || session.mapper.subagents.size > 0)) return;
    this.permissionService.cancelAllPermissions(session);
    this.eventBusService.emit(session, {
      type: 'session_notice',
      roomId,
      kind: 'stopped',
      time: Date.now(),
    });
    for (const taskId of this.sdkEventMapperService.listBackgroundTaskIds(session.mapper)) {
      active.stopTask(taskId).catch((error: unknown) => {
        this.log.error({ roomId, taskId, err: ErrorUtil.errorName(error) }, 'stop task failed');
      });
    }
    this.stopSubagents(session);
    if (!session.busy) return;
    active.interrupt().catch((error: unknown) => {
      this.log.error({ roomId, err: ErrorUtil.errorName(error) }, 'interrupt failed');
    });
    this.clearStopTimer(session);
    session.stopTimer = setTimeout(() => {
      session.stopTimer = null;
      if (!session.busy) return;
      this.log.warn({ roomId }, 'stop timed out; ending the query');
      this.endQuery(session);
      this.stopSubagents(session);
      this.setBusy(session, false);
    }, STOP_TIMEOUT_MS);
  }

  close(roomId: string): void {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'close ignored: unknown room');
      return;
    }
    if (session.closed) return;
    this.permissionService.cancelAllPermissions(session);
    this.endQuery(session);
    this.stopSubagents(session);
    session.closed = true;
    session.busy = false;
    this.eventBusService.emit(session, {
      type: 'session_notice',
      roomId,
      kind: 'closed',
      time: Date.now(),
    });
    this.eventBusService.updateState(session, true);
    this.log.info({ roomId }, 'session closed');
  }

  closeAll(): void {
    for (const session of this.sessionStoreRepository.values()) {
      this.permissionService.cancelAllPermissions(session);
      this.endQuery(session);
    }
  }

  async history(roomId: string): Promise<RoomEvent[] | null> {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) return null;
    void this.sessionInfoService.refreshWorkspace(session);
    if (!session.historyLoaded) {
      session.historyLoading ??= this.loadHistory(session).finally(() => {
        session.historyLoading = null;
      });
      await session.historyLoading;
    }
    return [...session.events];
  }

  list(): RoomSummary[] {
    return [...this.sessionStoreRepository.values()].map((session) => this.toSummary(session));
  }

  clearStopTimer(session: Session): void {
    if (session.stopTimer === null) return;
    clearTimeout(session.stopTimer);
    session.stopTimer = null;
  }

  async refreshTitle(session: Session): Promise<void> {
    if (session.sessionId === null) return;
    try {
      const info = await getSessionInfo(session.sessionId, { dir: session.folder });
      const title = SessionService.cleanTitle(info?.summary);
      if (title === session.title) return;
      session.title = title;
      this.roomRepository.setTitle(session.id, title);
      this.eventBusService.notifyChanged();
    } catch (error) {
      this.log.error(
        { roomId: session.id, err: ErrorUtil.errorName(error) },
        'title refresh failed',
      );
    }
  }

  private static cleanTitle(summary: string | undefined): string | null {
    const title = summary?.trim().slice(0, ROOM_NAME_MAX) ?? '';
    return title.length > 0 ? title : null;
  }

  private toSummary(session: Session): RoomSummary {
    return this.sessionStoreRepository.toSummary(
      session,
      this.sdkEventMapperService.listSubagents(session.mapper),
    );
  }

  private stopSubagents(session: Session): void {
    const events = this.sdkEventMapperService.finishAllSubagents(
      session.id,
      session.mapper,
      'stopped',
    );
    if (events.length === 0) return;
    for (const event of events) this.eventBusService.emit(session, event);
    this.log.info({ roomId: session.id, count: events.length }, 'subagents stopped');
    this.eventBusService.notifyChanged();
  }

  private endQuery(session: Session): void {
    this.clearStopTimer(session);
    const { input, query: active } = session;
    session.input = null;
    session.query = null;
    if (!input) return;
    input.intentional = true;
    input.close();
    try {
      active?.close();
    } catch (error) {
      this.log.error({ roomId: session.id, err: ErrorUtil.errorName(error) }, 'query close failed');
    }
  }

  private async doResume(sessionId: string): Promise<ResumeResult> {
    const info = await getSessionInfo(sessionId);
    if (!info) return { ok: false, code: 'session_not_found' };
    const resolved = this.folderRepository.resolveFolder(info.cwd);
    if (info.cwd === undefined || !resolved.ok) {
      return { ok: false, code: resolved.ok ? 'not_found' : resolved.code };
    }

    const id = randomUUID();
    let events: RoomEvent[];
    try {
      events = await this.historyRepository.loadRoomEvents(id, sessionId, resolved.value);
    } catch (error) {
      this.log.error({ sessionId, err: ErrorUtil.errorName(error) }, 'resume load failed');
      return { ok: false, code: 'load_failed' };
    }
    // Another path may have opened this session while the messages were loading.
    const open = this.sessionStoreRepository.findBySessionId(sessionId);
    if (open) return { ok: true, room: this.toSummary(open) };

    const session: Session = {
      id,
      name: null,
      title: SessionService.cleanTitle(info.summary),
      folder: resolved.value,
      createdAt: Date.now(),
      sessionId,
      resumedFrom: sessionId,
      busy: false,
      state: 'idle',
      events,
      input: null,
      query: null,
      closed: false,
      historyLoaded: true,
      historyLoading: null,
      stopTimer: null,
      mapper: this.sdkEventMapperService.createMapperState(),
      pending: new Map(),
      terminalCommands: new Set(),
      permissionMode: 'default',
      info: { ...EMPTY_SESSION_INFO },
    };
    this.roomRepository.insert(session.id, session.folder, session.createdAt, sessionId);
    if (session.title !== null) this.roomRepository.setTitle(session.id, session.title);
    this.sessionStoreRepository.set(session.id, session);
    void this.sessionInfoService.refreshWorkspace(session);
    this.log.info({ roomId: id, sessionId, eventCount: events.length }, 'session resumed');
    this.eventBusService.notifyChanged();
    return { ok: true, room: this.toSummary(session) };
  }

  private async loadHistory(session: Session): Promise<void> {
    try {
      const resolved = this.folderRepository.resolveFolder(session.folder);
      if (!resolved.ok || session.sessionId === null) throw new LoadSkipped();
      const loaded = await this.historyRepository.loadRoomEvents(
        session.id,
        session.sessionId,
        resolved.value,
      );
      session.events = [...loaded, ...session.events].slice(-ROOM_EVENT_BUFFER_MAX);
    } catch (error) {
      this.log.error(
        { roomId: session.id, err: ErrorUtil.errorName(error) },
        'history load failed',
      );
      this.eventBusService.emit(
        session,
        SessionMapperUtil.errorEvent(session.id, 'load_failed', 'Could not load the old messages.'),
      );
    } finally {
      session.historyLoaded = true;
    }
  }

  private ensureQuery(session: Session): InputQueue {
    if (session.input) return session.input;
    const input = new InputQueue();
    session.input = input;
    session.mapper = this.sdkEventMapperService.createMapperState();
    const stream = query({
      prompt: input,
      options: {
        cwd: session.folder,
        settingSources: [...SETTING_SOURCES],
        extraArgs: { ...SDK_EXTRA_ARGS },
        includePartialMessages: true,
        permissionMode: session.permissionMode,
        canUseTool: (toolName, toolInput, options) =>
          this.permissionService.requestPermission(session, toolName, toolInput, options),
        hooks: {
          Stop: [
            {
              hooks: [
                (hookInput) => {
                  const level = hookInput.effort?.level;
                  if (level) this.sessionInfoService.setEffort(session, level);
                  return Promise.resolve({});
                },
              ],
            },
          ],
        },
        ...(session.sessionId ? { resume: session.sessionId } : {}),
      },
    });
    session.query = stream;
    void this.pump(session, input, stream);
    return input;
  }

  private async pump(session: Session, input: InputQueue, stream: Query): Promise<void> {
    try {
      for await (const message of stream) {
        if (input.intentional) break;
        this.markSelfStartedTurn(session, input, message);
        if (message.type === 'system' && message.subtype === 'init') {
          this.setSessionId(session, message.session_id);
          session.terminalCommands = new Set(message.terminal_slash_commands ?? []);
          this.sessionInfoService.setModel(session, message.model);
          this.emitFallback(session, message);
          continue;
        }
        if (message.type === 'rate_limit_event') {
          this.usageLimitService.fromRateLimitEvent(message.rate_limit_info);
          this.emitFallback(session, message);
          continue;
        }
        const description =
          message.type === 'system' && message.subtype === 'task_notification'
            ? this.sdkEventMapperService.subagentDescription(
                session.mapper,
                message.tool_use_id,
                message.task_id,
              )
            : null;
        const events = this.sdkEventMapperService.mapSdkMessage(
          session.id,
          message,
          session.mapper,
        );
        for (const event of events) {
          this.eventBusService.emit(session, event);
          if (event.type === 'subagent_started' || event.type === 'subagent_finished') {
            this.logSubagent(session, event);
            this.eventBusService.updateState(session);
            this.eventBusService.notifyChanged();
          }
          if (event.type === 'turn_done') {
            this.clearStopTimer(session);
            this.setBusy(session, false);
            void this.sessionInfoService.refreshContext(session);
            void this.sessionInfoService.refreshWorkspace(session);
            if (session.query) void this.usageLimitService.refresh(session.query);
          }
        }
        if (message.type === 'result') void this.refreshTitle(session);
        if (message.type === 'system' && message.subtype === 'task_notification') {
          this.emitTaskResultCard(session, message, events, description);
        }
      }
      this.handleQueryEnd(session, input, null);
    } catch (error) {
      this.handleQueryEnd(session, input, error);
    }
  }

  private emitFallback(session: Session, message: SDKMessage): void {
    for (const event of this.sdkEventMapperService.mapFallback(session.id, message)) {
      this.eventBusService.emit(session, event);
    }
  }

  private emitTaskResultCard(
    session: Session,
    notification: Extract<SDKMessage, { type: 'system'; subtype: 'task_notification' }>,
    events: RoomEvent[],
    description: string | null,
  ): void {
    const taskId = notification.task_id;
    if (session.mapper.cardedTasks.has(taskId)) return;
    session.mapper.cardedTasks.add(taskId);
    const isSubagent = events.some((event) => event.type === 'subagent_finished');
    const emitCard = (body: string, readMs: number, usedTranscript: boolean): void => {
      this.eventBusService.emit(
        session,
        this.sdkEventMapperService.buildTaskResultEvent(
          session.id,
          notification,
          body,
          description,
          isSubagent,
        ),
      );
      this.log.debug(
        { roomId: session.id, taskId, readMs, usedTranscript },
        'task result card emitted',
      );
    };
    if (!isSubagent || !session.sessionId) {
      emitCard(notification.summary, 0, false);
      return;
    }
    const startedAt = Date.now();
    this.subagentTranscriptRepository
      .readFinalText(session.sessionId, taskId, session.folder)
      .then(
        (text) => emitCard(text ?? notification.summary, Date.now() - startedAt, text !== null),
        (error: unknown) => {
          this.log.error(
            { roomId: session.id, err: ErrorUtil.errorName(error) },
            'read result failed',
          );
          emitCard(notification.summary, Date.now() - startedAt, false);
        },
      )
      .catch((error: unknown) => {
        this.log.error(
          { roomId: session.id, err: ErrorUtil.errorName(error) },
          'emit result card failed',
        );
      });
  }

  // After a background task ends, the SDK may start a turn without user input.
  private markSelfStartedTurn(session: Session, input: InputQueue, message: SDKMessage): void {
    const isTurnStart =
      message.type === 'stream_event' &&
      message.parent_tool_use_id === null &&
      message.event.type === 'message_start';
    if (isTurnStart && !session.busy && !session.closed && !input.intentional) {
      this.setBusy(session, true);
    }
  }

  private logSubagent(
    session: Session,
    event: Extract<RoomEvent, { type: 'subagent_started' | 'subagent_finished' }>,
  ): void {
    const fields = { roomId: session.id, subagentId: event.subagentId };
    if (event.type === 'subagent_started') {
      this.log.info({ ...fields, agentType: event.agentType }, 'subagent started');
    } else {
      const { status, hiddenToolCalls } = event;
      this.log.info({ ...fields, status, hiddenToolCalls }, 'subagent finished');
    }
  }

  private handleQueryEnd(session: Session, input: InputQueue, error: unknown): void {
    input.close();
    this.stopSubagents(session);
    if (input.intentional) return;
    this.permissionService.cancelAllPermissions(session);
    this.clearStopTimer(session);
    if (session.input === input) {
      session.input = null;
      session.query = null;
    }
    if (error !== null) {
      this.log.error({ roomId: session.id, err: ErrorUtil.errorName(error) }, 'sdk query failed');
    }
    if (!session.busy) return;
    const hadAuthError = session.events.at(-1)?.type === 'auth_error';
    if (!hadAuthError) {
      this.eventBusService.emit(
        session,
        SessionMapperUtil.errorEvent(
          session.id,
          'sdk_error',
          'The Claude session stopped. Send again to retry.',
        ),
      );
    }
    this.setBusy(session, false);
  }

  private setSessionId(session: Session, sessionId: string): void {
    if (session.sessionId === sessionId) return;
    session.sessionId = sessionId;
    this.roomRepository.setSessionId(session.id, sessionId);
    this.eventBusService.notifyChanged();
  }

  private setBusy(session: Session, busy: boolean): void {
    if (session.busy === busy) return;
    session.busy = busy;
    this.eventBusService.updateState(session, true);
  }
}
