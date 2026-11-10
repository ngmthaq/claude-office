import { getSessionMessages, listSessions } from '@anthropic-ai/claude-agent-sdk';
import type { HistoryEntry, RoomEvent } from '@claude-office/shared';
import {
  ATTACHED_FILE_TAG_PREFIX,
  HISTORY_TEXT_MAX,
  ROOM_EVENT_BUFFER_MAX,
} from '@/configs/limits.config.ts';
import type { FolderRepository } from '@/repositories/folder.repository.ts';
import type {
  TranscriptSystemRow,
  TranscriptSystemRowsRepository,
} from '@/repositories/transcript-system-rows.repository.ts';
import {
  COMPACT_EVENT_NAME,
  COMPACT_SUMMARY_PREFIX,
  LOCAL_COMMAND_EVENT_NAME,
} from '@/configs/system-events.config.ts';
import { InternalEventsUtil } from '@/utils/internal-events.util.ts';
import { SdkEventContentUtil } from '@/utils/sdk-event-content.util.ts';
import { TaskNotificationUtil } from '@/utils/task-notification.util.ts';
import { PeerMessageUtil } from '@/utils/peer-message.util.ts';
import { TextUtil } from '@/utils/text.util.ts';

export type OpenRoomLookup = (sessionId: string) => string | null;

export class HistoryRepository {
  private static readonly wrapperPrefixes = [
    '<command-',
    '<local-command-',
    '<system-reminder>',
    ATTACHED_FILE_TAG_PREFIX,
  ];
  private static readonly interruptPrefix = '[Request interrupted by user';

  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly transcriptRepository: TranscriptSystemRowsRepository,
  ) {}

  async listHistory(findOpenRoom: OpenRoomLookup): Promise<HistoryEntry[]> {
    const sessions = await listSessions({ includeProgrammatic: true });
    return [...sessions]
      .sort((a, b) => b.lastModified - a.lastModified)
      .map((info) => {
        const folder = info.cwd ?? '';
        const firstPrompt = this.cut(info.firstPrompt);
        return {
          sessionId: info.sessionId,
          folder,
          title: this.cut(info.summary) ?? '',
          ...(firstPrompt !== undefined ? { firstPrompt } : {}),
          lastModified: info.lastModified,
          openRoomId: findOpenRoom(info.sessionId),
          canResume: folder !== '' && this.folderRepository.resolveFolder(folder).ok,
        };
      });
  }

  async loadRoomEvents(roomId: string, sessionId: string, folder: string): Promise<RoomEvent[]> {
    const transcript = await this.transcriptRepository.read(sessionId);
    const messages = await getSessionMessages(sessionId, { dir: folder });
    const pending = transcript === null ? [] : [...transcript.rows];
    const events: RoomEvent[] = [];
    for (const message of messages) {
      const place = transcript?.messageOrder.get(message.uuid);
      if (place !== undefined) this.flushRows(roomId, pending, place, events);
      if (message.parent_tool_use_id !== null || message.type === 'system') continue;
      const content = this.contentOf(message.message);
      if (content === null) continue;
      if (message.type === 'user' && this.isCompactSummary(message, content)) {
        if (transcript === null) {
          events.push(
            this.systemCard(
              roomId,
              message.uuid,
              COMPACT_EVENT_NAME,
              'Conversation compacted',
              false,
            ),
          );
        }
        continue;
      }
      if (message.type === 'user')
        this.mapUserContent(roomId, message.uuid, content, events, transcript !== null);
      else if (message.type === 'assistant')
        this.mapAssistantContent(roomId, message.uuid, content, events);
    }
    this.flushRows(roomId, pending, Infinity, events);
    return events.slice(-ROOM_EVENT_BUFFER_MAX);
  }

  private flushRows(
    roomId: string,
    pending: TranscriptSystemRow[],
    before: number,
    events: RoomEvent[],
  ): void {
    while (pending.length > 0 && (pending[0]?.index ?? Infinity) < before) {
      const row = pending.shift();
      if (row !== undefined) this.mapSystemRow(roomId, row, events);
    }
  }

  private mapSystemRow(roomId: string, row: TranscriptSystemRow, events: RoomEvent[]): void {
    if (row.subtype === 'compact_boundary') {
      const content =
        row.compactMetadata === null
          ? (row.content ?? 'Conversation compacted')
          : SdkEventContentUtil.compactContent(row.compactMetadata);
      events.push(this.systemCard(roomId, row.uuid, COMPACT_EVENT_NAME, content, false));
      return;
    }
    if (row.subtype === 'local_command') {
      this.mapLocalCommandRow(roomId, row, events);
      return;
    }
    if (SdkEventContentUtil.isInternal(row.subtype, row.record)) {
      InternalEventsUtil.append(events, {
        type: 'internal_events',
        roomId,
        total: 1,
        items: [{ name: row.subtype, detail: SdkEventContentUtil.detail(row.record) }],
        time: 0,
      });
      return;
    }
    events.push(
      this.systemCard(
        roomId,
        row.uuid,
        row.subtype,
        SdkEventContentUtil.cardContent(row.record),
        SdkEventContentUtil.isError(row.subtype, row.record),
      ),
    );
  }

  private mapLocalCommandRow(roomId: string, row: TranscriptSystemRow, events: RoomEvent[]): void {
    if (row.commandName === null || row.content === null) return;
    const output = SdkEventContentUtil.parseLocalCommandText(row.content);
    if (output === null) return;
    if (output.body === '' || SdkEventContentUtil.isCompactedOutput(output.body)) return;
    events.push(
      this.systemCard(
        roomId,
        row.uuid,
        `/${row.commandName}`,
        TextUtil.truncate(output.body),
        output.isStderr,
      ),
    );
  }

  private mapUserContent(
    roomId: string,
    uuid: string,
    content: string | unknown[],
    events: RoomEvent[],
    hasTranscript: boolean,
  ): void {
    if (typeof content === 'string') {
      this.pushUserText(roomId, uuid, content, events, hasTranscript);
      return;
    }
    content.forEach((block, index) => {
      if (!this.isRecord(block)) return;
      if (block.type === 'text' && typeof block.text === 'string') {
        this.pushUserText(roomId, `${uuid}-${index}`, block.text, events, hasTranscript);
      } else if (block.type === 'tool_result' && typeof block.tool_use_id === 'string') {
        events.push({
          type: 'tool_result',
          roomId,
          toolUseId: block.tool_use_id,
          content: TextUtil.truncate(TextUtil.describeContent(block.content)),
          isError: block.is_error === true,
        });
      }
    });
  }

  private pushUserText(
    roomId: string,
    messageId: string,
    text: string,
    events: RoomEvent[],
    hasTranscript: boolean,
  ): void {
    const start = text.trimStart();
    const localCommand = SdkEventContentUtil.parseLocalCommandText(start);
    if (localCommand !== null) {
      if (!hasTranscript) this.pushLocalCommand(roomId, messageId, localCommand, events);
      return;
    }
    if (
      start === '' ||
      HistoryRepository.wrapperPrefixes.some((prefix) => start.startsWith(prefix))
    )
      return;
    if (start.startsWith(HistoryRepository.interruptPrefix)) {
      events.push({ type: 'session_notice', roomId, kind: 'stopped', time: 0 });
      return;
    }
    const notification = TaskNotificationUtil.parse(text);
    if (notification !== null) {
      if (TaskNotificationUtil.isHandbackPointer(notification.body)) return;
      events.push({
        type: 'peer_message',
        roomId,
        messageId,
        senderName: null,
        subagentId: notification.toolUseId,
        source: 'task',
        title: notification.title,
        taskStatus: notification.status,
        body: notification.body,
        time: 0,
      });
      return;
    }
    const envelope = PeerMessageUtil.parsePeerEnvelope(text);
    if (envelope !== null) {
      events.push({
        type: 'peer_message',
        roomId,
        messageId,
        senderName: envelope.from === '' ? null : envelope.from,
        subagentId: null,
        source: envelope.isHandback ? 'handback' : 'peer',
        title: null,
        taskStatus: null,
        body: envelope.body,
        time: 0,
      });
      return;
    }
    events.push({ type: 'user_message', roomId, messageId, text, time: 0 });
  }

  private pushLocalCommand(
    roomId: string,
    messageId: string,
    output: { body: string; isStderr: boolean },
    events: RoomEvent[],
  ): void {
    if (output.body === '' || SdkEventContentUtil.isCompactedOutput(output.body)) return;
    events.push(
      this.systemCard(
        roomId,
        messageId,
        LOCAL_COMMAND_EVENT_NAME,
        TextUtil.truncate(output.body),
        output.isStderr,
      ),
    );
  }

  private systemCard(
    roomId: string,
    eventId: string,
    name: string,
    content: string,
    isError: boolean,
  ): RoomEvent {
    return { type: 'system_event', roomId, eventId, name, content, isError, time: 0 };
  }

  private isCompactSummary(message: object, content: string | unknown[]): boolean {
    if ('isCompactSummary' in message && message.isCompactSummary === true) return true;
    return typeof content === 'string' && content.startsWith(COMPACT_SUMMARY_PREFIX);
  }

  private mapAssistantContent(
    roomId: string,
    uuid: string,
    content: string | unknown[],
    events: RoomEvent[],
  ): void {
    if (typeof content === 'string') return;
    let text = '';
    const calls: RoomEvent[] = [];
    for (const block of content) {
      if (!this.isRecord(block)) continue;
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

  private contentOf(message: unknown): string | unknown[] | null {
    if (!this.isRecord(message)) return null;
    const content = message.content;
    if (typeof content === 'string' || Array.isArray(content)) return content as string | unknown[];
    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private cut(text: string | undefined): string | undefined {
    if (text === undefined) return undefined;
    const trimmed = text.trim();
    if (trimmed.length <= HISTORY_TEXT_MAX) return trimmed;
    return `${trimmed.slice(0, HISTORY_TEXT_MAX)}…`;
  }
}
