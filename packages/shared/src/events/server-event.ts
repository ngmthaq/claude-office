import { z } from 'zod';
import { parseWith, type ParseResult } from './parse.ts';
import { ArchivedEventSchema } from './archived.ts';
import { AssistantTextEventSchema } from './assistant-text.ts';
import { AuthErrorEventSchema } from './auth-error.ts';
import { CodeFileEventSchema } from './code-file.ts';
import { CodeTreeEventSchema } from './code-tree.ts';
import { CommandsEventSchema } from './commands.ts';
import { ErrorEventSchema } from './error.ts';
import { FilesEventSchema } from './files.ts';
import { FoldersEventSchema } from './folders.ts';
import { HelloEventSchema } from './hello.ts';
import { HistoryEventSchema } from './history.ts';
import { InternalEventsEventSchema } from './internal-events.ts';
import { McpStatusEventSchema } from './mcp-status.ts';
import { PeerMessageEventSchema } from './peer-message.ts';
import { PermissionRequestEventSchema } from './permission-request.ts';
import { PermissionResolvedEventSchema } from './permission-resolved.ts';
import { PongEventSchema } from './pong.ts';
import { SessionErrorEventSchema } from './session-error.ts';
import { SessionHistoryEventSchema } from './session-history.ts';
import { SessionNoticeEventSchema } from './session-notice.ts';
import { SessionStartedEventSchema } from './session-started.ts';
import { SessionStateEventSchema } from './session-state.ts';
import { SessionsEventSchema } from './sessions.ts';
import { SubagentFinishedEventSchema } from './subagent-finished.ts';
import { SubagentStartedEventSchema } from './subagent-started.ts';
import { SubagentToolCallEventSchema } from './subagent-tool-call.ts';
import { SubagentToolResultEventSchema } from './subagent-tool-result.ts';
import { SystemEventEventSchema } from './system-event.ts';
import { ToolCallEventSchema } from './tool-call.ts';
import { ToolResultEventSchema } from './tool-result.ts';
import { TurnDoneEventSchema } from './turn-done.ts';
import { UsageLimitEventSchema } from './usage-limit.ts';
import { UserMessageEventSchema } from './user-message.ts';

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
  PeerMessageEventSchema,
  PermissionRequestEventSchema,
  PermissionResolvedEventSchema,
  SessionNoticeEventSchema,
  SubagentStartedEventSchema,
  SubagentToolCallEventSchema,
  SubagentToolResultEventSchema,
  SubagentFinishedEventSchema,
  SystemEventEventSchema,
  InternalEventsEventSchema,
  HistoryEventSchema,
  ArchivedEventSchema,
  CommandsEventSchema,
  FilesEventSchema,
  McpStatusEventSchema,
  UsageLimitEventSchema,
  CodeTreeEventSchema,
  CodeFileEventSchema,
]);

export type ServerEvent = z.infer<typeof ServerEventSchema>;

export function parseServerEvent(raw: unknown): ParseResult<ServerEvent> {
  return parseWith(ServerEventSchema, raw);
}
