import type { SDKAssistantMessageError, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RoomEvent } from '@claude-office/shared';
import { SUBAGENT_TOOL_EVENTS_MAX, TOOL_RESULT_MAX_CHARS } from '../config.ts';

type SubagentState = {
  agentType: string;
  toolEvents: number;
  hiddenToolCalls: number;
  shownCalls: Set<string>;
  backgrounded: boolean;
  taskId: string | null;
};

export type MapperState = {
  /** API message id of the assistant message that is streaming right now. */
  messageId: string;
  /** Active sub-agents by their `Agent` tool call id, in start order. */
  subagents: Map<string, SubagentState>;
};

type SubagentStatus = 'done' | 'error' | 'stopped';

const NOTIFICATION_STATUS = {
  completed: 'done',
  failed: 'error',
  stopped: 'stopped',
} as const satisfies Record<string, SubagentStatus>;

const SUBAGENT_TOOL_NAMES: ReadonlySet<string> = new Set(['Agent', 'Task']);
const DEFAULT_AGENT_TYPE = 'general-purpose';

const AUTH_ERRORS: ReadonlySet<SDKAssistantMessageError> = new Set([
  'authentication_failed',
  'oauth_org_not_allowed',
  'verification_required',
  'cloud_credential_error',
]);
const ACCOUNT_ERRORS: ReadonlySet<SDKAssistantMessageError> = new Set([
  'account_on_hold',
  'billing_error',
]);

const NOT_LOGGED_IN_MESSAGE = 'Claude is not logged in on this device.';
const ACCOUNT_MESSAGE = 'Your Claude account cannot be used right now (billing or account issue).';

export function createMapperState(): MapperState {
  return { messageId: '', subagents: new Map() };
}

export function authErrorMessage(error: SDKAssistantMessageError | undefined): string | null {
  if (error === undefined) return null;
  if (AUTH_ERRORS.has(error)) return NOT_LOGGED_IN_MESSAGE;
  if (ACCOUNT_ERRORS.has(error)) return ACCOUNT_MESSAGE;
  return null;
}

export function listSubagents(state: MapperState): { id: string; agentType: string }[] {
  return [...state.subagents].map(([id, subagent]) => ({ id, agentType: subagent.agentType }));
}

/** Task ids of active sub-agents that run in the background. */
export function listBackgroundTaskIds(state: MapperState): string[] {
  const ids: string[] = [];
  for (const subagent of state.subagents.values()) {
    if (subagent.backgrounded && subagent.taskId !== null) ids.push(subagent.taskId);
  }
  return ids;
}

/** Ends every active sub-agent with the given status and clears them. */
export function finishAllSubagents(
  roomId: string,
  state: MapperState,
  status: SubagentStatus,
): RoomEvent[] {
  const events = [...state.subagents.keys()].map((id) =>
    finishSubagent(roomId, state, id, status, ''),
  );
  return events.filter((event): event is RoomEvent => event !== null);
}

/** Maps one SDK message to room events. Sub-agent messages become `subagent_*` events. */
export function mapSdkMessage(
  roomId: string,
  message: SDKMessage,
  state: MapperState,
): RoomEvent[] {
  switch (message.type) {
    case 'stream_event':
      return message.parent_tool_use_id === null ? mapStreamEvent(roomId, message, state) : [];
    case 'assistant':
      if (message.parent_tool_use_id === null) return mapAssistant(roomId, message, state);
      return mapChildAssistant(roomId, message.parent_tool_use_id, message, state);
    case 'user':
      if (message.parent_tool_use_id === null) return mapUser(roomId, message, state);
      return mapChildUser(roomId, message.parent_tool_use_id, message, state);
    case 'system':
      return mapSystem(roomId, message, state);
    case 'result':
      return [
        { type: 'turn_done', roomId, isError: message.subtype !== 'success' || message.is_error },
      ];
    default:
      return [];
  }
}

function mapSystem(
  roomId: string,
  message: Extract<SDKMessage, { type: 'system' }>,
  state: MapperState,
): RoomEvent[] {
  if (message.subtype === 'task_started') {
    const subagent =
      message.tool_use_id === undefined ? undefined : state.subagents.get(message.tool_use_id);
    if (subagent && message.is_backgrounded === true) {
      subagent.backgrounded = true;
      subagent.taskId = message.task_id;
    }
    return [];
  }
  if (message.subtype === 'task_notification') {
    const id = findSubagentId(state, message.tool_use_id, message.task_id);
    if (id === undefined) return [];
    const status = NOTIFICATION_STATUS[message.status];
    const event = finishSubagent(roomId, state, id, status, truncate(message.summary));
    return event ? [event] : [];
  }
  return [];
}

function findSubagentId(
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

function finishSubagent(
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

function readString(input: unknown, key: string): string | undefined {
  if (typeof input !== 'object' || input === null || !(key in input)) return undefined;
  const value = (input as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function startSubagent(roomId: string, id: string, input: unknown, state: MapperState): RoomEvent {
  const agentType = readString(input, 'subagent_type') ?? DEFAULT_AGENT_TYPE;
  state.subagents.set(id, {
    agentType,
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
    description: readString(input, 'description') ?? '',
    prompt: truncate(readString(input, 'prompt') ?? ''),
    time: Date.now(),
  };
}

function mapChildAssistant(
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

function mapChildUser(
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
      content: truncate(describeContent(block.content)),
      isError: block.is_error === true,
    });
  }
  return events;
}

function mapStreamEvent(
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

function mapAssistant(
  roomId: string,
  message: Extract<SDKMessage, { type: 'assistant' }>,
  state: MapperState,
): RoomEvent[] {
  const authMessage = authErrorMessage(message.error);
  if (authMessage !== null) return [{ type: 'auth_error', roomId, message: authMessage }];

  const events: RoomEvent[] = [];
  for (const block of message.message.content) {
    if (block.type !== 'tool_use') continue;
    if (SUBAGENT_TOOL_NAMES.has(block.name)) {
      events.push(startSubagent(roomId, block.id, block.input, state));
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

function mapUser(
  roomId: string,
  message: Extract<SDKMessage, { type: 'user' }>,
  state: MapperState,
): RoomEvent[] {
  const content = message.message.content;
  if (typeof content === 'string') return [];
  const events: RoomEvent[] = [];
  for (const block of content) {
    if (block.type !== 'tool_result') continue;
    const subagent = state.subagents.get(block.tool_use_id);
    if (subagent) {
      if (subagent.backgrounded) continue;
      const status = block.is_error === true ? 'error' : 'done';
      const result = truncate(describeContent(block.content));
      const event = finishSubagent(roomId, state, block.tool_use_id, status, result);
      if (event) events.push(event);
    } else {
      events.push({
        type: 'tool_result',
        roomId,
        toolUseId: block.tool_use_id,
        content: truncate(describeContent(block.content)),
        isError: block.is_error === true,
      });
    }
  }
  return events;
}

export function describeContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  const parts: string[] = [];
  for (const part of content as unknown[]) {
    if (typeof part !== 'object' || part === null || !('type' in part)) continue;
    if (part.type === 'text' && 'text' in part && typeof part.text === 'string') {
      parts.push(part.text);
    } else if (typeof part.type === 'string') {
      parts.push(`[${part.type}]`);
    }
  }
  return parts.join('\n');
}

export function truncate(text: string): string {
  if (text.length <= TOOL_RESULT_MAX_CHARS) return text;
  return `${text.slice(0, TOOL_RESULT_MAX_CHARS)}…(truncated)`;
}
