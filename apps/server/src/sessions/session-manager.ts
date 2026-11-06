import { randomUUID } from 'node:crypto';
import {
  getSessionInfo,
  query,
  type CanUseTool,
  type PermissionResult,
  type Query,
  type SDKMessage,
  type SDKUserMessage,
} from '@anthropic-ai/claude-agent-sdk';
import type { FastifyBaseLogger } from 'fastify';
import type {
  ArchivedRoom,
  HistoryEntry,
  McpServerEntry,
  PermissionDecision,
  RoomEvent,
  PermissionMode,
  RoomSummary,
  SessionState,
  SessionStateEvent,
  SlashCommandEntry,
} from '@claude-office/shared';
import {
  ASK_IN_CHAT_MESSAGE,
  ASK_IN_CHAT_TOOLS,
  PERMISSION_DENY_MESSAGE,
  ROOM_EVENT_BUFFER_MAX,
  SDK_EXTRA_ARGS,
  SETTING_SOURCES,
  STOP_TIMEOUT_MS,
  TOOL_RESULT_MAX_CHARS,
} from '../config.ts';
import type { RoomRow, RoomsRepo } from '../db/rooms-repo.ts';
import { scanDiskCommands } from './command-catalog.ts';
import { listHistory, loadRoomEvents } from './history-reader.ts';
import { resolveFolder, type FolderErrorCode } from './folder-browser.ts';
import {
  createMapperState,
  finishAllSubagents,
  listBackgroundTaskIds,
  listSubagents,
  mapSdkMessage,
  type MapperState,
} from './sdk-event-mapper.ts';

const COMMANDS_TIMEOUT_MS = 2000;
const MCP_STATUS_TIMEOUT_MS = 5000;

type PendingPermission = {
  toolName: string;
  input: Record<string, unknown>;
  resolve: (result: PermissionResult) => void;
  detach: () => void;
};

type Session = {
  id: string;
  name: string | null;
  folder: string;
  createdAt: number;
  sessionId: string | null;
  resumedFrom: string | null;
  busy: boolean;
  state: SessionState;
  events: RoomEvent[];
  input: InputQueue | null;
  query: Query | null;
  closed: boolean;
  historyLoaded: boolean;
  historyLoading: Promise<void> | null;
  stopTimer: NodeJS.Timeout | null;
  mapper: MapperState;
  pending: Map<string, PendingPermission>;
  terminalCommands: Set<string>;
  permissionMode: PermissionMode;
};

type RoomEventListener = (event: RoomEvent) => void;
type SessionStateListener = (event: SessionStateEvent) => void;

export type McpStatusList = { live: boolean; servers: McpServerEntry[] };

export type CommandList = { source: 'sdk' | 'disk'; commands: SlashCommandEntry[] };

export type StartResult = { ok: true; room: RoomSummary } | { ok: false; code: FolderErrorCode };
export type ResumeErrorCode = FolderErrorCode | 'session_not_found' | 'load_failed';
export type ResumeResult = { ok: true; room: RoomSummary } | { ok: false; code: ResumeErrorCode };

export class SessionManager {
  private readonly sessions = new Map<string, Session>();
  private readonly eventListeners = new Set<RoomEventListener>();
  private readonly stateListeners = new Set<SessionStateListener>();
  private readonly changeListeners = new Set<() => void>();
  private readonly archivedListeners = new Set<() => void>();
  private readonly resuming = new Map<string, Promise<ResumeResult>>();

  constructor(
    private readonly repo: RoomsRepo,
    private readonly log: FastifyBaseLogger,
  ) {}

  onRoomEvent(listener: RoomEventListener): void {
    this.eventListeners.add(listener);
  }

  onSessionState(listener: SessionStateListener): void {
    this.stateListeners.add(listener);
  }

  onRoomsChanged(listener: () => void): void {
    this.changeListeners.add(listener);
  }

  onArchivedChanged(listener: () => void): void {
    this.archivedListeners.add(listener);
  }

  start(folder: string): StartResult {
    const resolved = resolveFolder(folder);
    if (!resolved.ok) return resolved;

    const session: Session = {
      id: randomUUID(),
      name: null,
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
      mapper: createMapperState(),
      pending: new Map(),
      terminalCommands: new Set(),
      permissionMode: 'default',
    };
    this.repo.insert(session.id, session.folder, session.createdAt);
    this.sessions.set(session.id, session);
    this.log.info({ roomId: session.id }, 'session started');
    this.notifyChanged();
    return { ok: true, room: toSummary(session) };
  }

  resume(sessionId: string): Promise<ResumeResult> {
    const open = this.findBySessionId(sessionId);
    if (open) return Promise.resolve({ ok: true, room: toSummary(open) });
    const newest = this.repo.getNewestBySessionId(sessionId);
    if (newest?.archivedAt != null) {
      const restored = this.restoreRow(newest);
      if (restored) return Promise.resolve({ ok: true, room: toSummary(restored) });
    }
    const inFlight = this.resuming.get(sessionId);
    if (inFlight) return inFlight;
    const promise = this.doResume(sessionId).finally(() => this.resuming.delete(sessionId));
    this.resuming.set(sessionId, promise);
    return promise;
  }

  listHistory(): Promise<HistoryEntry[]> {
    return listHistory((sessionId) => this.findBySessionId(sessionId)?.id ?? null);
  }

  send(roomId: string, text: string): void {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.emitUnknownRoom(roomId);
      return;
    }
    if (session.busy) {
      this.emit(
        session,
        errorEvent(roomId, 'busy', 'Claude is still working on the last message.'),
      );
      return;
    }

    session.closed = false;
    this.emit(session, {
      type: 'user_message',
      roomId,
      messageId: randomUUID(),
      text,
      time: Date.now(),
    });
    this.setBusy(session, true);
    this.ensureQuery(session).push({
      type: 'user',
      message: { role: 'user', content: text },
      parent_tool_use_id: null,
    });
  }

  roomFolder(roomId: string): string | undefined {
    return this.sessions.get(roomId)?.folder;
  }

  async listCommands(roomId: string): Promise<CommandList | undefined> {
    const session = this.sessions.get(roomId);
    if (!session) return undefined;
    const hidden = session.terminalCommands;
    const live = session.query;
    if (live) {
      try {
        const sdk = await withTimeout(live.supportedCommands(), COMMANDS_TIMEOUT_MS);
        const commands = sdk
          .filter((command) => !hidden.has(command.name))
          .map((command) => ({
            name: command.name,
            description: command.description ?? '',
            argumentHint: command.argumentHint ?? '',
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { source: 'sdk', commands };
      } catch (error) {
        this.log.info({ roomId, err: errorName(error) }, 'sdk commands unavailable');
      }
    }
    return { source: 'disk', commands: await scanDiskCommands(session.folder) };
  }

  async listMcpServers(roomId: string): Promise<McpStatusList | undefined> {
    const session = this.sessions.get(roomId);
    if (!session) return undefined;
    if (!session.query) return { live: false, servers: [] };
    const list = await withTimeout(session.query.mcpServerStatus(), MCP_STATUS_TIMEOUT_MS);
    const servers = list
      .map((server) => ({
        name: server.name,
        status: server.status,
        source: server.source ?? server.scope ?? null,
        error: server.error ?? null,
        toolCount: server.tools?.length ?? 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.log.info({ roomId, count: servers.length }, 'mcp status listed');
    return { live: true, servers };
  }

  loadClosedRooms(): void {
    const seen = new Set<string>();
    for (const row of this.repo.listWithSession()) {
      if (row.sessionId === null || seen.has(row.sessionId)) continue;
      seen.add(row.sessionId);
      if (row.archivedAt !== null) continue;
      this.sessions.set(row.id, closedSession(row, row.sessionId));
    }
    this.log.info({ count: this.sessions.size }, 'closed rooms loaded');
  }

  rename(roomId: string, name: string): void {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'rename ignored: unknown room');
      return;
    }
    const value = name === '' ? null : name;
    this.repo.setName(roomId, value);
    session.name = value;
    this.notifyChanged();
  }

  async setPermissionMode(roomId: string, mode: PermissionMode): Promise<void> {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'permission mode ignored: unknown room');
      return;
    }
    try {
      if (session.query) await session.query.setPermissionMode(mode);
    } catch (error) {
      this.log.error({ roomId, mode, err: errorName(error) }, 'permission mode change failed');
      this.emit(
        session,
        errorEvent(roomId, 'permission_mode_failed', 'Could not change the permission mode.'),
      );
      return;
    }
    this.repo.setPermissionMode(roomId, mode);
    session.permissionMode = mode;
    this.log.info({ roomId, mode }, 'permission mode changed');
    this.notifyChanged();
  }

  archive(roomId: string): void {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'archive ignored: unknown room');
      return;
    }
    if (!session.closed) this.close(roomId);
    this.clearStopTimer(session);
    this.repo.setArchived(roomId, Date.now());
    this.sessions.delete(roomId);
    this.log.info({ roomId }, 'session archived');
    this.notifyChanged();
    this.notifyArchivedChanged();
  }

  remove(roomId: string): void {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'remove ignored: unknown room');
      return;
    }
    if (!session.closed) this.close(roomId);
    this.clearStopTimer(session);
    this.sessions.delete(roomId);
    this.repo.delete(roomId);
    this.log.info({ roomId }, 'room removed');
    this.notifyChanged();
  }

  listArchived(): ArchivedRoom[] {
    const seen = new Set<string>();
    const rooms: ArchivedRoom[] = [];
    for (const row of this.repo.listArchived()) {
      if (row.sessionId === null || row.archivedAt === null || seen.has(row.sessionId)) continue;
      seen.add(row.sessionId);
      const newest = this.repo.getNewestBySessionId(row.sessionId);
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
    const row = this.repo.get(roomId);
    if (!row || row.archivedAt === null) {
      this.log.info({ roomId }, 'restore ignored: not archived');
      return;
    }
    this.restoreRow(row);
  }

  private restoreRow(row: RoomRow): Session | undefined {
    if (row.sessionId === null) return undefined;
    this.repo.setArchived(row.id, null);
    let session = this.findBySessionId(row.sessionId);
    if (!session) {
      session = closedSession(row, row.sessionId);
      this.sessions.set(row.id, session);
    }
    this.log.info({ roomId: session.id }, 'session restored');
    this.notifyChanged();
    this.notifyArchivedChanged();
    return session;
  }

  stop(roomId: string): void {
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'stop ignored: unknown room');
      return;
    }
    const { query: active } = session;
    if (!active || !(session.busy || session.mapper.subagents.size > 0)) return;
    this.cancelAllPermissions(session);
    this.emit(session, { type: 'session_notice', roomId, kind: 'stopped', time: Date.now() });
    for (const taskId of listBackgroundTaskIds(session.mapper)) {
      active.stopTask(taskId).catch((error: unknown) => {
        this.log.error({ roomId, taskId, err: errorName(error) }, 'stop task failed');
      });
    }
    this.stopSubagents(session);
    if (!session.busy) return;
    active.interrupt().catch((error: unknown) => {
      this.log.error({ roomId, err: errorName(error) }, 'interrupt failed');
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
    const session = this.sessions.get(roomId);
    if (!session) {
      this.log.info({ roomId }, 'close ignored: unknown room');
      return;
    }
    if (session.closed) return;
    this.cancelAllPermissions(session);
    this.endQuery(session);
    this.stopSubagents(session);
    session.closed = true;
    session.busy = false;
    this.emit(session, { type: 'session_notice', roomId, kind: 'closed', time: Date.now() });
    this.updateState(session, true);
    this.log.info({ roomId }, 'session closed');
  }

  closeAll(): void {
    for (const session of this.sessions.values()) {
      this.cancelAllPermissions(session);
      this.endQuery(session);
    }
  }

  private stopSubagents(session: Session): void {
    const events = finishAllSubagents(session.id, session.mapper, 'stopped');
    if (events.length === 0) return;
    for (const event of events) this.emit(session, event);
    this.log.info({ roomId: session.id, count: events.length }, 'subagents stopped');
    this.notifyChanged();
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
      this.log.error({ roomId: session.id, err: errorName(error) }, 'query close failed');
    }
  }

  private clearStopTimer(session: Session): void {
    if (session.stopTimer === null) return;
    clearTimeout(session.stopTimer);
    session.stopTimer = null;
  }

  private findBySessionId(sessionId: string): Session | undefined {
    for (const session of this.sessions.values()) {
      if (session.sessionId === sessionId || session.resumedFrom === sessionId) return session;
    }
    return undefined;
  }

  private async doResume(sessionId: string): Promise<ResumeResult> {
    const info = await getSessionInfo(sessionId);
    if (!info) return { ok: false, code: 'session_not_found' };
    const resolved = resolveFolder(info.cwd);
    if (info.cwd === undefined || !resolved.ok) {
      return { ok: false, code: resolved.ok ? 'not_found' : resolved.code };
    }

    const id = randomUUID();
    let events: RoomEvent[];
    try {
      events = await loadRoomEvents(id, sessionId, resolved.value);
    } catch (error) {
      this.log.error({ sessionId, err: errorName(error) }, 'resume load failed');
      return { ok: false, code: 'load_failed' };
    }
    // Another path may have opened this session while the messages were loading.
    const open = this.findBySessionId(sessionId);
    if (open) return { ok: true, room: toSummary(open) };

    const session: Session = {
      id,
      name: null,
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
      mapper: createMapperState(),
      pending: new Map(),
      terminalCommands: new Set(),
      permissionMode: 'default',
    };
    this.repo.insert(session.id, session.folder, session.createdAt, sessionId);
    this.sessions.set(session.id, session);
    this.log.info({ roomId: id, sessionId, eventCount: events.length }, 'session resumed');
    this.notifyChanged();
    return { ok: true, room: toSummary(session) };
  }

  async history(roomId: string): Promise<RoomEvent[] | null> {
    const session = this.sessions.get(roomId);
    if (!session) return null;
    if (!session.historyLoaded) {
      session.historyLoading ??= this.loadHistory(session).finally(() => {
        session.historyLoading = null;
      });
      await session.historyLoading;
    }
    return [...session.events];
  }

  private async loadHistory(session: Session): Promise<void> {
    try {
      const resolved = resolveFolder(session.folder);
      if (!resolved.ok || session.sessionId === null) throw new LoadSkipped();
      const loaded = await loadRoomEvents(session.id, session.sessionId, resolved.value);
      session.events = [...loaded, ...session.events].slice(-ROOM_EVENT_BUFFER_MAX);
    } catch (error) {
      this.log.error({ roomId: session.id, err: errorName(error) }, 'history load failed');
      this.emit(session, errorEvent(session.id, 'load_failed', 'Could not load the old messages.'));
    } finally {
      session.historyLoaded = true;
    }
  }

  list(): RoomSummary[] {
    return [...this.sessions.values()].map(toSummary);
  }

  answerPermission(roomId: string, requestId: string, decision: PermissionDecision): void {
    const session = this.sessions.get(roomId);
    const pending = session?.pending.get(requestId);
    if (!session || !pending) {
      this.log.info({ roomId, requestId }, 'permission answer ignored');
      return;
    }
    this.log.info(
      { roomId, requestId, toolName: pending.toolName, decision },
      'permission answered',
    );
    this.settlePermission(
      session,
      requestId,
      decision === 'allow'
        ? { behavior: 'allow', updatedInput: pending.input }
        : { behavior: 'deny', message: PERMISSION_DENY_MESSAGE },
      decision,
    );
  }

  private requestPermission(
    session: Session,
    toolName: string,
    input: Record<string, unknown>,
    options: Parameters<CanUseTool>[2],
  ): Promise<PermissionResult> {
    if (ASK_IN_CHAT_TOOLS.includes(toolName)) {
      return Promise.resolve({ behavior: 'deny', message: ASK_IN_CHAT_MESSAGE });
    }
    const requestId = options.toolUseID;
    return new Promise<PermissionResult>((resolve) => {
      const onAbort = (): void => this.cancelPermission(session, requestId);
      options.signal.addEventListener('abort', onAbort, { once: true });
      session.pending.set(requestId, {
        toolName,
        input,
        resolve,
        detach: () => options.signal.removeEventListener('abort', onAbort),
      });
      this.emit(session, {
        type: 'permission_request',
        roomId: session.id,
        requestId,
        toolName,
        ...(options.title !== undefined ? { title: options.title } : {}),
        ...(options.description !== undefined ? { description: options.description } : {}),
        input: cutStrings(input),
        fromSubagent: options.agentID !== undefined,
        time: Date.now(),
      });
      this.updateState(session);
      if (options.signal.aborted) onAbort();
    });
  }

  private cancelPermission(session: Session, requestId: string): void {
    this.settlePermission(
      session,
      requestId,
      { behavior: 'deny', message: PERMISSION_DENY_MESSAGE },
      'cancelled',
    );
  }

  private cancelAllPermissions(session: Session): void {
    for (const requestId of [...session.pending.keys()]) this.cancelPermission(session, requestId);
  }

  private settlePermission(
    session: Session,
    requestId: string,
    result: PermissionResult,
    decision: PermissionDecision | 'cancelled',
  ): void {
    const pending = session.pending.get(requestId);
    if (!pending) return;
    session.pending.delete(requestId);
    pending.detach();
    pending.resolve(result);
    this.emit(session, {
      type: 'permission_resolved',
      roomId: session.id,
      requestId,
      decision,
    });
    this.updateState(session);
  }

  private ensureQuery(session: Session): InputQueue {
    if (session.input) return session.input;
    const input = new InputQueue();
    session.input = input;
    session.mapper = createMapperState();
    const stream = query({
      prompt: input,
      options: {
        cwd: session.folder,
        settingSources: [...SETTING_SOURCES],
        extraArgs: { ...SDK_EXTRA_ARGS },
        includePartialMessages: true,
        permissionMode: session.permissionMode,
        canUseTool: (toolName, input, options) =>
          this.requestPermission(session, toolName, input, options),
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
          continue;
        }
        for (const event of mapSdkMessage(session.id, message, session.mapper)) {
          this.emit(session, event);
          if (event.type === 'subagent_started' || event.type === 'subagent_finished') {
            this.logSubagent(session, event);
            this.updateState(session);
            this.notifyChanged();
          }
          if (event.type === 'turn_done') {
            this.clearStopTimer(session);
            this.setBusy(session, false);
          }
        }
      }
      this.handleQueryEnd(session, input, null);
    } catch (error) {
      this.handleQueryEnd(session, input, error);
    }
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
    this.cancelAllPermissions(session);
    this.clearStopTimer(session);
    if (session.input === input) {
      session.input = null;
      session.query = null;
    }
    if (error !== null) {
      this.log.error({ roomId: session.id, err: errorName(error) }, 'sdk query failed');
    }
    if (!session.busy) return;
    const hadAuthError = session.events.at(-1)?.type === 'auth_error';
    if (!hadAuthError) {
      this.emit(
        session,
        errorEvent(session.id, 'sdk_error', 'The Claude session stopped. Send again to retry.'),
      );
    }
    this.setBusy(session, false);
  }

  private setSessionId(session: Session, sessionId: string): void {
    if (session.sessionId === sessionId) return;
    session.sessionId = sessionId;
    this.repo.setSessionId(session.id, sessionId);
    this.notifyChanged();
  }

  private setBusy(session: Session, busy: boolean): void {
    if (session.busy === busy) return;
    session.busy = busy;
    this.updateState(session, true);
  }

  private updateState(session: Session, busyChanged = false): void {
    const state: SessionState = session.closed
      ? 'closed'
      : !(session.busy || session.mapper.subagents.size > 0)
        ? 'idle'
        : session.pending.size > 0
          ? 'waiting'
          : 'working';
    if (state === session.state && !busyChanged) return;
    session.state = state;
    const event: SessionStateEvent = { type: 'session_state', roomId: session.id, state };
    for (const listener of this.stateListeners) listener(event);
    this.notifyChanged();
  }

  private emit(session: Session, event: RoomEvent): void {
    session.events.push(event);
    if (session.events.length > ROOM_EVENT_BUFFER_MAX) session.events.shift();
    for (const listener of this.eventListeners) listener(event);
  }

  private emitUnknownRoom(roomId: string): void {
    const event = errorEvent(roomId, 'room_not_found', 'Room not found.');
    for (const listener of this.eventListeners) listener(event);
  }

  private notifyChanged(): void {
    for (const listener of this.changeListeners) listener();
  }

  private notifyArchivedChanged(): void {
    for (const listener of this.archivedListeners) listener();
  }
}

class LoadSkipped extends Error {}

class InputQueue implements AsyncIterable<SDKUserMessage> {
  private readonly items: SDKUserMessage[] = [];
  private waiting: ((result: IteratorResult<SDKUserMessage>) => void) | null = null;
  private closed = false;
  intentional = false;

  push(message: SDKUserMessage): void {
    if (this.waiting) {
      const resolve = this.waiting;
      this.waiting = null;
      resolve({ value: message, done: false });
      return;
    }
    this.items.push(message);
  }

  close(): void {
    this.closed = true;
    if (this.waiting) {
      const resolve = this.waiting;
      this.waiting = null;
      resolve({ value: undefined, done: true });
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<SDKUserMessage> {
    return {
      next: () => {
        const item = this.items.shift();
        if (item) return Promise.resolve({ value: item, done: false });
        if (this.closed) return Promise.resolve({ value: undefined, done: true });
        return new Promise((resolve) => {
          this.waiting = resolve;
        });
      },
    };
  }
}

function cutStrings(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.length > TOOL_RESULT_MAX_CHARS
      ? `${value.slice(0, TOOL_RESULT_MAX_CHARS)}…`
      : value;
  }
  if (Array.isArray(value)) return value.map(cutStrings);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cutStrings(item)]));
  }
  return value;
}

function closedSession(row: RoomRow, sessionId: string): Session {
  return {
    id: row.id,
    name: row.name,
    folder: row.folder,
    createdAt: row.createdAt,
    sessionId,
    resumedFrom: sessionId,
    busy: false,
    state: 'closed',
    events: [],
    input: null,
    query: null,
    closed: true,
    historyLoaded: false,
    historyLoading: null,
    stopTimer: null,
    mapper: createMapperState(),
    pending: new Map(),
    terminalCommands: new Set(),
    permissionMode: row.permissionMode,
  };
}

function toSummary(session: Session): RoomSummary {
  return {
    id: session.id,
    name: session.name,
    folder: session.folder,
    createdAt: session.createdAt,
    sessionId: session.sessionId,
    busy: session.busy,
    state: session.state,
    subagents: listSubagents(session.mapper),
    permissionMode: session.permissionMode,
  };
}

function errorEvent(roomId: string, code: string, message: string): RoomEvent {
  return { type: 'session_error', roomId, code, message };
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'unknown';
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error('failed'));
      },
    );
  });
}
