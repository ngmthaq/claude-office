import { randomUUID } from 'node:crypto';
import type { SDKAssistantMessageError, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { BackgroundTask, RoomEvent } from '@claude-office/shared';
import type { MapperState } from '@/repositories/session-store.repository.ts';
import { SUBAGENT_TOOL_EVENTS_MAX, TASK_TITLE_MAX } from '@/configs/limits.config.ts';
import { COMPACT_EVENT_NAME, LOCAL_COMMAND_EVENT_NAME } from '@/configs/system-events.config.ts';
import { PeerMessageUtil } from '@/utils/peer-message.util.ts';
import { SdkEventContentUtil } from '@/utils/sdk-event-content.util.ts';
import { TextUtil } from '@/utils/text.util.ts';
import { TypeGuardUtil } from '@/utils/type-guard.util.ts';

type SubagentStatus = 'done' | 'error' | 'stopped';

export class SdkEventMapperService {
  private static readonly notificationStatus = {
    completed: 'done',
    failed: 'error',
    stopped: 'stopped',
  } as const satisfies Record<string, SubagentStatus>;
  private static readonly taskCardStatus = {
    completed: 'completed',
    failed: 'failed',
    stopped: 'killed',
  } as const;
  private static readonly subagentToolNames: ReadonlySet<string> = new Set(['Agent', 'Task']);
  private static readonly defaultAgentType = 'general-purpose';
  private static readonly authErrors: ReadonlySet<SDKAssistantMessageError> = new Set([
    'authentication_failed',
    'oauth_org_not_allowed',
    'verification_required',
    'cloud_credential_error',
  ]);
  private static readonly accountErrors: ReadonlySet<SDKAssistantMessageError> = new Set([
    'account_on_hold',
    'billing_error',
  ]);
  private static readonly notLoggedInMessage = 'Claude is not logged in on this device.';
  private static readonly accountMessage =
    'Your Claude account cannot be used right now (billing or account issue).';

  createMapperState(): MapperState {
    return { messageId: '', subagents: new Map(), cardedTasks: new Set() };
  }

  buildTaskResultEvent(
    roomId: string,
    notification: {
      tool_use_id?: string;
      status: 'completed' | 'failed' | 'stopped';
      summary: string;
      uuid: string;
    },
    body: string,
    description: string | null,
    isSubagent: boolean,
  ): RoomEvent {
    return {
      type: 'peer_message',
      roomId,
      messageId: `task-${notification.uuid}`,
      senderName: null,
      subagentId: notification.tool_use_id ?? null,
      source: 'task',
      title: this.buildLiveTitle(notification.summary, description, isSubagent),
      taskStatus: SdkEventMapperService.taskCardStatus[notification.status],
      body,
      time: Date.now(),
    };
  }

  subagentDescription(
    state: MapperState,
    toolUseId: string | undefined,
    taskId: string,
  ): string | null {
    const id = this.findSubagentId(state, toolUseId, taskId);
    return id === undefined ? null : (state.subagents.get(id)?.description ?? null);
  }

  private buildLiveTitle(
    summary: string,
    description: string | null,
    isSubagent: boolean,
  ): string | null {
    if (isSubagent) return description ? `Result: ${description}` : null;
    const firstLine = (summary.split('\n')[0] ?? '').trim();
    if (firstLine.length <= TASK_TITLE_MAX) return firstLine;
    return `${firstLine.slice(0, TASK_TITLE_MAX - 1)}…`;
  }

  authErrorMessage(error: SDKAssistantMessageError | undefined): string | null {
    if (error === undefined) return null;
    if (SdkEventMapperService.authErrors.has(error))
      return SdkEventMapperService.notLoggedInMessage;
    if (SdkEventMapperService.accountErrors.has(error)) return SdkEventMapperService.accountMessage;
    return null;
  }

  listSubagents(state: MapperState): { id: string; agentType: string }[] {
    return [...state.subagents].map(([id, subagent]) => ({ id, agentType: subagent.agentType }));
  }

  /** Task ids of active sub-agents that run in the background. */
  listBackgroundTaskIds(state: MapperState): string[] {
    const ids: string[] = [];
    for (const subagent of state.subagents.values()) {
      if (subagent.backgrounded && subagent.taskId !== null) ids.push(subagent.taskId);
    }
    return ids;
  }

  /** Ends every active sub-agent with the given status and clears them. */
  finishAllSubagents(roomId: string, state: MapperState, status: SubagentStatus): RoomEvent[] {
    const events = [...state.subagents.keys()].map((id) =>
      this.finishSubagent(roomId, state, id, status, ''),
    );
    return events.filter((event): event is RoomEvent => event !== null);
  }

  nextBackgroundTasks(
    message: Extract<SDKMessage, { type: 'system'; subtype: 'background_tasks_changed' }>,
    previous: BackgroundTask[],
  ): BackgroundTask[] {
    const known = new Map(previous.map((task) => [task.id, task]));
    const now = Date.now();
    return message.tasks
      .filter((task) => task.ambient !== true)
      .map((task) => ({
        id: task.task_id,
        kind: SdkEventMapperService.backgroundKind(task.task_type),
        description: task.description,
        subagentId: null,
        startedAt: known.get(task.task_id)?.startedAt ?? now,
      }));
  }

  sameBackgroundTasks(a: BackgroundTask[], b: BackgroundTask[]): boolean {
    return (
      a.length === b.length &&
      a.every((task, i) => task.id === b[i]?.id && task.description === b[i]?.description)
    );
  }

  linkBackgroundTasks(state: MapperState, tasks: BackgroundTask[]): BackgroundTask[] {
    return tasks.map((task) => ({
      ...task,
      subagentId: this.findSubagentId(state, undefined, task.id) ?? null,
    }));
  }

  hasBackgroundTask(tasks: BackgroundTask[], taskId: string): boolean {
    return tasks.some((task) => task.id === taskId);
  }

  private static backgroundKind(taskType: string): BackgroundTask['kind'] {
    if (taskType === 'local_agent') return 'agent';
    if (taskType === 'local_bash') return 'command';
    return 'other';
  }

  /** Maps one SDK message to room events. Sub-agent messages become `subagent_*` events. */
  mapSdkMessage(roomId: string, message: SDKMessage, state: MapperState): RoomEvent[] {
    switch (message.type) {
      case 'stream_event':
        return message.parent_tool_use_id === null
          ? this.mapStreamEvent(roomId, message, state)
          : [];
      case 'assistant':
        if (message.parent_tool_use_id === null) return this.mapAssistant(roomId, message, state);
        return this.mapChildAssistant(roomId, message.parent_tool_use_id, message, state);
      case 'user':
        if (message.parent_tool_use_id === null) return this.mapUser(roomId, message, state);
        return this.mapChildUser(roomId, message.parent_tool_use_id, message, state);
      case 'system':
        return this.mapSystem(roomId, message, state);
      case 'result':
        return this.mapResult(roomId, message);
      default:
        return this.mapFallback(roomId, message);
    }
  }

  /** Turns a message that has no chat view into one card or one internal entry. */
  mapFallback(roomId: string, message: SDKMessage): RoomEvent[] {
    const record: Record<string, unknown> = { ...message };
    const name = SdkEventContentUtil.eventName(record);
    if (SdkEventContentUtil.isInternal(name, record)) {
      return [
        {
          type: 'internal_events',
          roomId,
          total: 1,
          items: [{ name, detail: SdkEventContentUtil.detail(record) }],
          time: Date.now(),
        },
      ];
    }
    return [
      this.buildCard(
        roomId,
        record,
        name,
        SdkEventContentUtil.cardContent(record),
        SdkEventContentUtil.isError(name, record),
      ),
    ];
  }

  private buildCard(
    roomId: string,
    record: Record<string, unknown>,
    name: string,
    content: string,
    isError: boolean,
  ): RoomEvent {
    return {
      type: 'system_event',
      roomId,
      eventId: typeof record.uuid === 'string' ? record.uuid : randomUUID(),
      name,
      content,
      isError,
      time: Date.now(),
    };
  }

  private mapResult(roomId: string, message: Extract<SDKMessage, { type: 'result' }>): RoomEvent[] {
    const isError = message.subtype !== 'success' || message.is_error;
    const events: RoomEvent[] = [{ type: 'turn_done', roomId, isError }];
    if (!isError) return events;
    const detail =
      message.subtype === 'success'
        ? message.result
        : message.errors.length > 0
          ? message.errors.join('\n')
          : message.subtype;
    events.push(
      this.buildCard(
        roomId,
        { ...message },
        message.subtype,
        TextUtil.truncate(SdkEventContentUtil.stripAnsi(detail)),
        true,
      ),
    );
    return events;
  }

  private mapCompactBoundary(
    roomId: string,
    message: Extract<SDKMessage, { type: 'system'; subtype: 'compact_boundary' }>,
  ): RoomEvent[] {
    const metadata = message.compact_metadata;
    const content = SdkEventContentUtil.compactContent({
      trigger: metadata.trigger,
      preTokens: metadata.pre_tokens,
      postTokens: metadata.post_tokens,
    });
    return [this.buildCard(roomId, { ...message }, COMPACT_EVENT_NAME, content, false)];
  }

  private mapLocalCommandOutput(
    roomId: string,
    message: Extract<SDKMessage, { type: 'system'; subtype: 'local_command_output' }>,
  ): RoomEvent[] {
    const text = SdkEventContentUtil.stripAnsi(message.content);
    if (SdkEventContentUtil.isCompactedOutput(text)) return [];
    return [
      this.buildCard(
        roomId,
        { ...message },
        LOCAL_COMMAND_EVENT_NAME,
        TextUtil.truncate(text),
        false,
      ),
    ];
  }

  private mapLocalCommandReply(
    roomId: string,
    message: Extract<SDKMessage, { type: 'assistant' }>,
    record: Record<string, unknown>,
  ): RoomEvent[] {
    const text = SdkEventContentUtil.stripAnsi(
      TextUtil.describeContent(message.message.content),
    ).trim();
    if (text === '') return [];
    const run = record.local_command_run;
    const command =
      TypeGuardUtil.isRecord(run) && typeof run.command === 'string' ? run.command : null;
    const name = command === null ? LOCAL_COMMAND_EVENT_NAME : `/${command}`;
    return [this.buildCard(roomId, { ...message }, name, TextUtil.truncate(text), false)];
  }

  private mapSystem(
    roomId: string,
    message: Extract<SDKMessage, { type: 'system' }>,
    state: MapperState,
  ): RoomEvent[] {
    if (message.subtype === 'task_started') {
      const subagent =
        message.tool_use_id === undefined ? undefined : state.subagents.get(message.tool_use_id);
      if (subagent) {
        subagent.taskId = message.task_id;
        if (message.is_backgrounded === true) subagent.backgrounded = true;
      }
      return [];
    }
    if (message.subtype === 'task_updated') {
      if (message.patch.is_backgrounded === true) {
        const id = this.findSubagentId(state, undefined, message.task_id);
        const subagent = id === undefined ? undefined : state.subagents.get(id);
        if (subagent) subagent.backgrounded = true;
      }
      return [];
    }
    if (message.subtype === 'task_notification') {
      const id = this.findSubagentId(state, message.tool_use_id, message.task_id);
      if (id === undefined) return [];
      const status = SdkEventMapperService.notificationStatus[message.status];
      const event = this.finishSubagent(
        roomId,
        state,
        id,
        status,
        TextUtil.truncate(message.summary),
      );
      return event ? [event] : [];
    }
    if (message.subtype === 'compact_boundary') return this.mapCompactBoundary(roomId, message);
    if (message.subtype === 'local_command_output') {
      return this.mapLocalCommandOutput(roomId, message);
    }
    return this.mapFallback(roomId, message);
  }

  private findSubagentId(
    state: MapperState,
    toolUseId: string | undefined,
    taskId: string,
  ): string | undefined {
    if (toolUseId !== undefined && state.subagents.has(toolUseId)) return toolUseId;
    for (const [id, subagent] of state.subagents) {
      if (subagent.taskId === taskId) return id;
    }
    return undefined;
  }

  private finishSubagent(
    roomId: string,
    state: MapperState,
    subagentId: string,
    status: SubagentStatus,
    result: string,
  ): RoomEvent | null {
    const subagent = state.subagents.get(subagentId);
    if (!subagent) return null;
    state.subagents.delete(subagentId);
    return {
      type: 'subagent_finished',
      roomId,
      subagentId,
      status,
      result,
      hiddenToolCalls: subagent.hiddenToolCalls,
      time: Date.now(),
    };
  }

  private readString(input: unknown, key: string): string | undefined {
    if (typeof input !== 'object' || input === null || !(key in input)) return undefined;
    const value = (input as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }

  private startSubagent(roomId: string, id: string, input: unknown, state: MapperState): RoomEvent {
    const agentType =
      this.readString(input, 'subagent_type') ?? SdkEventMapperService.defaultAgentType;
    const description = this.readString(input, 'description') ?? '';
    state.subagents.set(id, {
      agentType,
      description,
      toolEvents: 0,
      hiddenToolCalls: 0,
      shownCalls: new Set(),
      backgrounded: false,
      taskId: null,
    });
    return {
      type: 'subagent_started',
      roomId,
      subagentId: id,
      agentType,
      description,
      prompt: TextUtil.truncate(this.readString(input, 'prompt') ?? ''),
      time: Date.now(),
    };
  }

  private mapChildAssistant(
    roomId: string,
    parentId: string,
    message: Extract<SDKMessage, { type: 'assistant' }>,
    state: MapperState,
  ): RoomEvent[] {
    const subagent = state.subagents.get(parentId);
    if (!subagent) return [];
    const events: RoomEvent[] = [];
    for (const block of message.message.content) {
      if (block.type !== 'tool_use') continue;
      if (subagent.toolEvents >= SUBAGENT_TOOL_EVENTS_MAX) {
        subagent.hiddenToolCalls += 1;
        continue;
      }
      subagent.toolEvents += 1;
      subagent.shownCalls.add(block.id);
      events.push({
        type: 'subagent_tool_call',
        roomId,
        subagentId: parentId,
        toolUseId: block.id,
        name: block.name,
        input: block.input,
      });
    }
    return events;
  }

  private mapChildUser(
    roomId: string,
    parentId: string,
    message: Extract<SDKMessage, { type: 'user' }>,
    state: MapperState,
  ): RoomEvent[] {
    const subagent = state.subagents.get(parentId);
    const content = message.message.content;
    if (!subagent || typeof content === 'string') return [];
    const events: RoomEvent[] = [];
    for (const block of content) {
      if (block.type !== 'tool_result' || !subagent.shownCalls.has(block.tool_use_id)) continue;
      subagent.toolEvents += 1;
      events.push({
        type: 'subagent_tool_result',
        roomId,
        subagentId: parentId,
        toolUseId: block.tool_use_id,
        content: TextUtil.truncate(TextUtil.describeContent(block.content)),
        isError: block.is_error === true,
      });
    }
    return events;
  }

  private mapStreamEvent(
    roomId: string,
    message: Extract<SDKMessage, { type: 'stream_event' }>,
    state: MapperState,
  ): RoomEvent[] {
    const event = message.event;
    if (event.type === 'message_start') {
      state.messageId = event.message.id;
      return [];
    }
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      return [
        { type: 'assistant_text', roomId, messageId: state.messageId, delta: event.delta.text },
      ];
    }
    return [];
  }

  private mapAssistant(
    roomId: string,
    message: Extract<SDKMessage, { type: 'assistant' }>,
    state: MapperState,
  ): RoomEvent[] {
    const authMessage = this.authErrorMessage(message.error);
    if (authMessage !== null) return [{ type: 'auth_error', roomId, message: authMessage }];

    if ('local_command_source' in message) {
      return this.mapLocalCommandReply(roomId, message, { ...message });
    }

    const events: RoomEvent[] = [];
    for (const block of message.message.content) {
      if (block.type !== 'tool_use') continue;
      if (SdkEventMapperService.subagentToolNames.has(block.name)) {
        events.push(this.startSubagent(roomId, block.id, block.input, state));
      } else {
        events.push({
          type: 'tool_call',
          roomId,
          toolUseId: block.id,
          name: block.name,
          input: block.input,
        });
      }
    }
    return events;
  }

  private mapUser(
    roomId: string,
    message: Extract<SDKMessage, { type: 'user' }>,
    state: MapperState,
  ): RoomEvent[] {
    const content = message.message.content;
    if (typeof content === 'string') return this.mapPeerText(roomId, message, content, state);
    const events: RoomEvent[] = [];
    for (const block of content) {
      if (block.type !== 'tool_result') continue;
      const subagent = state.subagents.get(block.tool_use_id);
      if (subagent) {
        if (subagent.backgrounded) continue;
        const status = block.is_error === true ? 'error' : 'done';
        const result = TextUtil.truncate(TextUtil.describeContent(block.content));
        const event = this.finishSubagent(roomId, state, block.tool_use_id, status, result);
        if (event) events.push(event);
      } else {
        events.push({
          type: 'tool_result',
          roomId,
          toolUseId: block.tool_use_id,
          content: TextUtil.truncate(TextUtil.describeContent(block.content)),
          isError: block.is_error === true,
        });
      }
    }
    return events;
  }

  private mapPeerText(
    roomId: string,
    message: Extract<SDKMessage, { type: 'user' }>,
    content: string,
    state: MapperState,
  ): RoomEvent[] {
    const origin = message.origin;
    if (origin?.kind !== 'peer') return [];
    const body = origin.body ?? PeerMessageUtil.parsePeerEnvelope(content)?.body ?? content;
    const taskId = origin.senderTaskId;
    return [
      {
        type: 'peer_message',
        roomId,
        messageId: message.uuid ?? `peer-${Date.now()}`,
        senderName: origin.name ?? null,
        subagentId:
          taskId !== undefined ? (this.findSubagentId(state, undefined, taskId) ?? null) : null,
        source: taskId !== undefined ? 'handback' : 'peer',
        title: null,
        taskStatus: null,
        body,
        time: Date.now(),
      },
    ];
  }
}
