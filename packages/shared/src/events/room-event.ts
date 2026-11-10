import { z } from 'zod';
import { AssistantTextEventSchema } from './assistant-text.ts';
import { AuthErrorEventSchema } from './auth-error.ts';
import { InternalEventsEventSchema } from './internal-events.ts';
import { PeerMessageEventSchema } from './peer-message.ts';
import { PermissionRequestEventSchema } from './permission-request.ts';
import { PermissionResolvedEventSchema } from './permission-resolved.ts';
import { SessionErrorEventSchema } from './session-error.ts';
import { SessionNoticeEventSchema } from './session-notice.ts';
import { SubagentFinishedEventSchema } from './subagent-finished.ts';
import { SubagentStartedEventSchema } from './subagent-started.ts';
import { SubagentToolCallEventSchema } from './subagent-tool-call.ts';
import { SubagentToolResultEventSchema } from './subagent-tool-result.ts';
import { SystemEventEventSchema } from './system-event.ts';
import { ToolCallEventSchema } from './tool-call.ts';
import { ToolResultEventSchema } from './tool-result.ts';
import { TurnDoneEventSchema } from './turn-done.ts';
import { UserMessageEventSchema } from './user-message.ts';

export const RoomEventSchema = z.discriminatedUnion('type', [
  UserMessageEventSchema,
  AssistantTextEventSchema,
  ToolCallEventSchema,
  ToolResultEventSchema,
  TurnDoneEventSchema,
  SessionErrorEventSchema,
  AuthErrorEventSchema,
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
]);

export type RoomEvent = z.infer<typeof RoomEventSchema>;
