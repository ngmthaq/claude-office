import { z } from 'zod';
import {
  ArchivedEventSchema,
  ArchivedListEventSchema,
  AssistantTextEventSchema,
  AuthErrorEventSchema,
  CommandsEventSchema,
  CommandsListEventSchema,
  FilesEventSchema,
  FilesListEventSchema,
  FoldersEventSchema,
  FoldersListEventSchema,
  HistoryEventSchema,
  HistoryListEventSchema,
  McpListEventSchema,
  McpStatusEventSchema,
  PermissionAnswerEventSchema,
  PermissionRequestEventSchema,
  PermissionResolvedEventSchema,
  RoomArchiveEventSchema,
  RoomPermissionModeEventSchema,
  RoomRenameEventSchema,
  RoomRestoreEventSchema,
  SessionCloseEventSchema,
  SessionErrorEventSchema,
  SessionHistoryEventSchema,
  SessionNoticeEventSchema,
  SessionOpenEventSchema,
  SessionResumeEventSchema,
  SessionSendEventSchema,
  SessionsEventSchema,
  SessionStartedEventSchema,
  SessionStartEventSchema,
  SessionStateEventSchema,
  SessionStopEventSchema,
  SubagentFinishedEventSchema,
  SubagentStartedEventSchema,
  SubagentToolCallEventSchema,
  SubagentToolResultEventSchema,
  ToolCallEventSchema,
  ToolResultEventSchema,
  TurnDoneEventSchema,
  UserMessageEventSchema,
} from './session-events.ts';

export const HelloEventSchema = z.object({
  type: z.literal('hello'),
  serverVersion: z.string(),
  time: z.number(),
});

export const PongEventSchema = z.object({
  type: z.literal('pong'),
  time: z.number(),
});

export const ErrorEventSchema = z.object({
  type: z.literal('error'),
  code: z.string(),
  message: z.string(),
});

export const PingEventSchema = z.object({
  type: z.literal('ping'),
  time: z.number(),
});

export const ServerEventSchema = z.discriminatedUnion('type', [
  HelloEventSchema,
  PongEventSchema,
  ErrorEventSchema,
  UserMessageEventSchema,
  AssistantTextEventSchema,
  ToolCallEventSchema,
  ToolResultEventSchema,
  TurnDoneEventSchema,
  SessionErrorEventSchema,
  AuthErrorEventSchema,
  FoldersEventSchema,
  SessionsEventSchema,
  SessionStartedEventSchema,
  SessionHistoryEventSchema,
  SessionStateEventSchema,
  PermissionRequestEventSchema,
  PermissionResolvedEventSchema,
  SessionNoticeEventSchema,
  SubagentStartedEventSchema,
  SubagentToolCallEventSchema,
  SubagentToolResultEventSchema,
  SubagentFinishedEventSchema,
  HistoryEventSchema,
  ArchivedEventSchema,
  CommandsEventSchema,
  FilesEventSchema,
  McpStatusEventSchema,
]);

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
  RoomRestoreEventSchema,
  ArchivedListEventSchema,
  CommandsListEventSchema,
  FilesListEventSchema,
  McpListEventSchema,
]);

export type HelloEvent = z.infer<typeof HelloEventSchema>;
export type PongEvent = z.infer<typeof PongEventSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
export type PingEvent = z.infer<typeof PingEventSchema>;
export type ServerEvent = z.infer<typeof ServerEventSchema>;
export type ClientEvent = z.infer<typeof ClientEventSchema>;

export type ParseFailure = {
  success: false;
  /** The message `type` field when it is a string, for logging. Never the payload. */
  eventType: string | undefined;
  /** Zod issue paths only, e.g. `time` or `(root)`. */
  issuePaths: string[];
};

export type ParseResult<T> = { success: true; data: T } | ParseFailure;

export function parseServerEvent(raw: unknown): ParseResult<ServerEvent> {
  return parseWith(ServerEventSchema, raw);
}

export function parseClientEvent(raw: unknown): ParseResult<ClientEvent> {
  return parseWith(ClientEventSchema, raw);
}

function parseWith<T>(schema: z.ZodType<T>, raw: unknown): ParseResult<T> {
  const value = typeof raw === 'string' ? safeJsonParse(raw) : raw;
  const result = schema.safeParse(value);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    eventType: readEventType(value),
    issuePaths: result.error.issues.map((issue) => issue.path.join('.') || '(root)'),
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function readEventType(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || !('type' in value)) return undefined;
  return typeof value.type === 'string' ? value.type : undefined;
}
