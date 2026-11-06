import { getSessionMessages, listSessions } from '@anthropic-ai/claude-agent-sdk';
import type { HistoryEntry, RoomEvent } from '@claude-office/shared';
import { HISTORY_TEXT_MAX, ROOM_EVENT_BUFFER_MAX } from '../config.ts';
import { resolveFolder } from './folder-browser.ts';
import { describeContent, truncate } from './sdk-event-mapper.ts';

const WRAPPER_PREFIXES = ['<command-', '<local-command-', '<system-reminder>'];
const INTERRUPT_PREFIX = '[Request interrupted by user';

export type OpenRoomLookup = (sessionId: string) => string | null;

export async function listHistory(findOpenRoom: OpenRoomLookup): Promise<HistoryEntry[]> {
  const sessions = await listSessions({ includeProgrammatic: true });
  return [...sessions]
    .sort((a, b) => b.lastModified - a.lastModified)
    .map((info) => {
      const folder = info.cwd ?? '';
      const firstPrompt = cut(info.firstPrompt);
      return {
        sessionId: info.sessionId,
        folder,
        title: cut(info.summary) ?? '',
        ...(firstPrompt !== undefined ? { firstPrompt } : {}),
        lastModified: info.lastModified,
        openRoomId: findOpenRoom(info.sessionId),
        canResume: folder !== '' && resolveFolder(folder).ok,
      };
    });
}

export async function loadRoomEvents(
  roomId: string,
  sessionId: string,
  folder: string,
): Promise<RoomEvent[]> {
  const messages = await getSessionMessages(sessionId, { dir: folder });
  const events: RoomEvent[] = [];
  for (const message of messages) {
    if (message.parent_tool_use_id !== null || message.type === 'system') continue;
    const content = contentOf(message.message);
    if (content === null) continue;
    if (message.type === 'user') mapUserContent(roomId, message.uuid, content, events);
    else if (message.type === 'assistant')
      mapAssistantContent(roomId, message.uuid, content, events);
  }
  return events.slice(-ROOM_EVENT_BUFFER_MAX);
}

function mapUserContent(
  roomId: string,
  uuid: string,
  content: string | unknown[],
  events: RoomEvent[],
): void {
  if (typeof content === 'string') {
    pushUserText(roomId, uuid, content, events);
    return;
  }
  content.forEach((block, index) => {
    if (!isRecord(block)) return;
    if (block.type === 'text' && typeof block.text === 'string') {
      pushUserText(roomId, `${uuid}-${index}`, block.text, events);
    } else if (block.type === 'tool_result' && typeof block.tool_use_id === 'string') {
      events.push({
        type: 'tool_result',
        roomId,
        toolUseId: block.tool_use_id,
        content: truncate(describeContent(block.content)),
        isError: block.is_error === true,
      });
    }
  });
}

function pushUserText(roomId: string, messageId: string, text: string, events: RoomEvent[]): void {
  const start = text.trimStart();
  if (start === '' || WRAPPER_PREFIXES.some((prefix) => start.startsWith(prefix))) return;
  if (start.startsWith(INTERRUPT_PREFIX)) {
    events.push({ type: 'session_notice', roomId, kind: 'stopped', time: 0 });
    return;
  }
  events.push({ type: 'user_message', roomId, messageId, text, time: 0 });
}

function mapAssistantContent(
  roomId: string,
  uuid: string,
  content: string | unknown[],
  events: RoomEvent[],
): void {
  if (typeof content === 'string') return;
  let text = '';
  const calls: RoomEvent[] = [];
  for (const block of content) {
    if (!isRecord(block)) continue;
    if (block.type === 'text' && typeof block.text === 'string') {
      text += block.text;
    } else if (
      block.type === 'tool_use' &&
      typeof block.id === 'string' &&
      typeof block.name === 'string'
    ) {
      calls.push({
        type: 'tool_call',
        roomId,
        toolUseId: block.id,
        name: block.name,
        input: block.input,
      });
    }
  }
  if (text.trim() !== '')
    events.push({ type: 'assistant_text', roomId, messageId: uuid, delta: text });
  events.push(...calls);
}

function contentOf(message: unknown): string | unknown[] | null {
  if (!isRecord(message)) return null;
  const content = message.content;
  if (typeof content === 'string' || Array.isArray(content)) return content as string | unknown[];
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function cut(text: string | undefined): string | undefined {
  if (text === undefined) return undefined;
  const trimmed = text.trim();
  if (trimmed.length <= HISTORY_TEXT_MAX) return trimmed;
  return `${trimmed.slice(0, HISTORY_TEXT_MAX)}…`;
}
