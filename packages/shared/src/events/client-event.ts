import { z } from 'zod';
import { parseWith, type ParseResult } from './parse.ts';
import { ArchivedListEventSchema } from './archived-list.ts';
import { CodeFileGetEventSchema } from './code-file-get.ts';
import { CodeTreeListEventSchema } from './code-tree-list.ts';
import { CommandsListEventSchema } from './commands-list.ts';
import { FilesListEventSchema } from './files-list.ts';
import { FoldersListEventSchema } from './folders-list.ts';
import { HistoryListEventSchema } from './history-list.ts';
import { McpListEventSchema } from './mcp-list.ts';
import { PermissionAnswerEventSchema } from './permission-answer.ts';
import { PingEventSchema } from './ping.ts';
import { RoomArchiveEventSchema } from './room-archive.ts';
import { RoomPermissionModeEventSchema } from './room-permission-mode.ts';
import { RoomRemoveEventSchema } from './room-remove.ts';
import { RoomRenameEventSchema } from './room-rename.ts';
import { RoomRestoreEventSchema } from './room-restore.ts';
import { SessionCloseEventSchema } from './session-close.ts';
import { SessionOpenEventSchema } from './session-open.ts';
import { SessionResumeEventSchema } from './session-resume.ts';
import { SessionSendEventSchema } from './session-send.ts';
import { SessionStartEventSchema } from './session-start.ts';
import { SessionStopEventSchema } from './session-stop.ts';

export const ClientEventSchema = z.discriminatedUnion('type', [
  PingEventSchema,
  FoldersListEventSchema,
  SessionStartEventSchema,
  SessionSendEventSchema,
  SessionOpenEventSchema,
  PermissionAnswerEventSchema,
  HistoryListEventSchema,
  SessionResumeEventSchema,
  SessionStopEventSchema,
  SessionCloseEventSchema,
  RoomRenameEventSchema,
  RoomPermissionModeEventSchema,
  RoomArchiveEventSchema,
  RoomRemoveEventSchema,
  RoomRestoreEventSchema,
  ArchivedListEventSchema,
  CommandsListEventSchema,
  FilesListEventSchema,
  McpListEventSchema,
  CodeTreeListEventSchema,
  CodeFileGetEventSchema,
]);

export type ClientEvent = z.infer<typeof ClientEventSchema>;

export function parseClientEvent(raw: unknown): ParseResult<ClientEvent> {
  return parseWith(ClientEventSchema, raw);
}
