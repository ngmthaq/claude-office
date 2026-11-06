import { z } from 'zod';

export const SessionStateSchema = z.enum(['idle', 'working', 'waiting', 'closed']);

export const ROOM_NAME_MAX = 60;

export const SubagentStatusSchema = z.enum(['done', 'error', 'stopped']);

export const SubagentRefSchema = z.object({ id: z.string(), agentType: z.string() });

export const RoomSummarySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  folder: z.string(),
  createdAt: z.number(),
  sessionId: z.string().nullable(),
  busy: z.boolean(),
  state: SessionStateSchema,
  subagents: z.array(SubagentRefSchema),
});

export const FolderEntrySchema = z.object({
  name: z.string(),
  path: z.string(),
});

export const FoldersListEventSchema = z.object({
  type: z.literal('folders_list'),
  path: z.string().optional(),
});

export const SessionStartEventSchema = z.object({
  type: z.literal('session_start'),
  folder: z.string().min(1),
});

export const SessionSendEventSchema = z.object({
  type: z.literal('session_send'),
  roomId: z.string().min(1),
  text: z.string().min(1).max(100000),
});

export const SessionOpenEventSchema = z.object({
  type: z.literal('session_open'),
  roomId: z.string().min(1),
});

export const UserMessageEventSchema = z.object({
  type: z.literal('user_message'),
  roomId: z.string(),
  messageId: z.string(),
  text: z.string(),
  time: z.number(),
});

export const AssistantTextEventSchema = z.object({
  type: z.literal('assistant_text'),
  roomId: z.string(),
  messageId: z.string(),
  delta: z.string(),
});

export const ToolCallEventSchema = z.object({
  type: z.literal('tool_call'),
  roomId: z.string(),
  toolUseId: z.string(),
  name: z.string(),
  input: z.unknown(),
});

export const ToolResultEventSchema = z.object({
  type: z.literal('tool_result'),
  roomId: z.string(),
  toolUseId: z.string(),
  content: z.string(),
  isError: z.boolean(),
});

export const TurnDoneEventSchema = z.object({
  type: z.literal('turn_done'),
  roomId: z.string(),
  isError: z.boolean(),
});

export const SessionErrorEventSchema = z.object({
  type: z.literal('session_error'),
  roomId: z.string(),
  code: z.string(),
  message: z.string(),
});

export const AuthErrorEventSchema = z.object({
  type: z.literal('auth_error'),
  roomId: z.string(),
  message: z.string(),
});

export const PermissionDecisionSchema = z.enum(['allow', 'deny']);

export const PermissionRequestEventSchema = z.object({
  type: z.literal('permission_request'),
  roomId: z.string(),
  requestId: z.string(),
  toolName: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  input: z.unknown(),
  fromSubagent: z.boolean(),
  time: z.number(),
});

export const PermissionResolvedEventSchema = z.object({
  type: z.literal('permission_resolved'),
  roomId: z.string(),
  requestId: z.string(),
  decision: z.enum(['allow', 'deny', 'cancelled']),
});

export const PermissionAnswerEventSchema = z.object({
  type: z.literal('permission_answer'),
  roomId: z.string().min(1),
  requestId: z.string().min(1),
  decision: PermissionDecisionSchema,
});

export const SessionStopEventSchema = z.object({
  type: z.literal('session_stop'),
  roomId: z.string().min(1),
});

export const SessionCloseEventSchema = z.object({
  type: z.literal('session_close'),
  roomId: z.string().min(1),
});

export const RoomRenameEventSchema = z.object({
  type: z.literal('room_rename'),
  roomId: z.string().min(1),
  name: z.string().trim().max(ROOM_NAME_MAX),
});

export const RoomArchiveEventSchema = z.object({
  type: z.literal('room_archive'),
  roomId: z.string().min(1),
});

export const RoomRestoreEventSchema = z.object({
  type: z.literal('room_restore'),
  roomId: z.string().min(1),
});

export const ArchivedListEventSchema = z.object({
  type: z.literal('archived_list'),
});

export const ArchivedRoomSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  folder: z.string(),
  sessionId: z.string(),
  archivedAt: z.number(),
});

export const ArchivedEventSchema = z.object({
  type: z.literal('archived'),
  rooms: z.array(ArchivedRoomSchema),
});

export const SessionNoticeKindSchema = z.enum(['stopped', 'closed']);

export const SessionNoticeEventSchema = z.object({
  type: z.literal('session_notice'),
  roomId: z.string(),
  kind: SessionNoticeKindSchema,
  time: z.number(),
});

export const HistoryEntrySchema = z.object({
  sessionId: z.string().min(1),
  folder: z.string(),
  title: z.string(),
  firstPrompt: z.string().optional(),
  lastModified: z.number(),
  openRoomId: z.string().nullable(),
  canResume: z.boolean(),
});

export const HistoryListEventSchema = z.object({
  type: z.literal('history_list'),
});

export const SessionResumeEventSchema = z.object({
  type: z.literal('session_resume'),
  sessionId: z.string().min(1),
});

export const HistoryEventSchema = z.object({
  type: z.literal('history'),
  entries: z.array(HistoryEntrySchema),
});

export const SubagentStartedEventSchema = z.object({
  type: z.literal('subagent_started'),
  roomId: z.string(),
  subagentId: z.string(),
  agentType: z.string(),
  description: z.string(),
  prompt: z.string(),
  time: z.number(),
});

export const SubagentToolCallEventSchema = z.object({
  type: z.literal('subagent_tool_call'),
  roomId: z.string(),
  subagentId: z.string(),
  toolUseId: z.string(),
  name: z.string(),
  input: z.unknown(),
});

export const SubagentToolResultEventSchema = z.object({
  type: z.literal('subagent_tool_result'),
  roomId: z.string(),
  subagentId: z.string(),
  toolUseId: z.string(),
  content: z.string(),
  isError: z.boolean(),
});

export const SubagentFinishedEventSchema = z.object({
  type: z.literal('subagent_finished'),
  roomId: z.string(),
  subagentId: z.string(),
  status: SubagentStatusSchema,
  result: z.string(),
  hiddenToolCalls: z.number().int().min(0),
  time: z.number(),
});

export const RoomEventSchema = z.discriminatedUnion('type', [
  UserMessageEventSchema,
  AssistantTextEventSchema,
  ToolCallEventSchema,
  ToolResultEventSchema,
  TurnDoneEventSchema,
  SessionErrorEventSchema,
  AuthErrorEventSchema,
  PermissionRequestEventSchema,
  PermissionResolvedEventSchema,
  SessionNoticeEventSchema,
  SubagentStartedEventSchema,
  SubagentToolCallEventSchema,
  SubagentToolResultEventSchema,
  SubagentFinishedEventSchema,
]);

export const FoldersEventSchema = z.object({
  type: z.literal('folders'),
  path: z.string(),
  parent: z.string().nullable(),
  entries: z.array(FolderEntrySchema),
});

export const SessionsEventSchema = z.object({
  type: z.literal('sessions'),
  rooms: z.array(RoomSummarySchema),
});

export const SessionStartedEventSchema = z.object({
  type: z.literal('session_started'),
  room: RoomSummarySchema,
});

export const SessionStateEventSchema = z.object({
  type: z.literal('session_state'),
  roomId: z.string(),
  state: SessionStateSchema,
});

export const SessionHistoryEventSchema = z.object({
  type: z.literal('session_history'),
  roomId: z.string(),
  events: z.array(RoomEventSchema),
});

export type SessionState = z.infer<typeof SessionStateSchema>;
export type RoomSummary = z.infer<typeof RoomSummarySchema>;
export type FolderEntry = z.infer<typeof FolderEntrySchema>;
export type FoldersListEvent = z.infer<typeof FoldersListEventSchema>;
export type SessionStartEvent = z.infer<typeof SessionStartEventSchema>;
export type SessionSendEvent = z.infer<typeof SessionSendEventSchema>;
export type SessionOpenEvent = z.infer<typeof SessionOpenEventSchema>;
export type UserMessageEvent = z.infer<typeof UserMessageEventSchema>;
export type AssistantTextEvent = z.infer<typeof AssistantTextEventSchema>;
export type ToolCallEvent = z.infer<typeof ToolCallEventSchema>;
export type ToolResultEvent = z.infer<typeof ToolResultEventSchema>;
export type TurnDoneEvent = z.infer<typeof TurnDoneEventSchema>;
export type SessionErrorEvent = z.infer<typeof SessionErrorEventSchema>;
export type AuthErrorEvent = z.infer<typeof AuthErrorEventSchema>;
export type PermissionDecision = z.infer<typeof PermissionDecisionSchema>;
export type PermissionRequestEvent = z.infer<typeof PermissionRequestEventSchema>;
export type PermissionResolvedEvent = z.infer<typeof PermissionResolvedEventSchema>;
export type PermissionAnswerEvent = z.infer<typeof PermissionAnswerEventSchema>;
export type SessionStopEvent = z.infer<typeof SessionStopEventSchema>;
export type SessionCloseEvent = z.infer<typeof SessionCloseEventSchema>;
export type SessionNoticeKind = z.infer<typeof SessionNoticeKindSchema>;
export type SessionNoticeEvent = z.infer<typeof SessionNoticeEventSchema>;
export type SubagentStatus = z.infer<typeof SubagentStatusSchema>;
export type SubagentRef = z.infer<typeof SubagentRefSchema>;
export type SubagentStartedEvent = z.infer<typeof SubagentStartedEventSchema>;
export type SubagentToolCallEvent = z.infer<typeof SubagentToolCallEventSchema>;
export type SubagentToolResultEvent = z.infer<typeof SubagentToolResultEventSchema>;
export type SubagentFinishedEvent = z.infer<typeof SubagentFinishedEventSchema>;
export type RoomEvent = z.infer<typeof RoomEventSchema>;
export type FoldersEvent = z.infer<typeof FoldersEventSchema>;
export type SessionsEvent = z.infer<typeof SessionsEventSchema>;
export type SessionStartedEvent = z.infer<typeof SessionStartedEventSchema>;
export type SessionHistoryEvent = z.infer<typeof SessionHistoryEventSchema>;
export type SessionStateEvent = z.infer<typeof SessionStateEventSchema>;
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
export type HistoryListEvent = z.infer<typeof HistoryListEventSchema>;
export type SessionResumeEvent = z.infer<typeof SessionResumeEventSchema>;
export type HistoryEvent = z.infer<typeof HistoryEventSchema>;
export type RoomRenameEvent = z.infer<typeof RoomRenameEventSchema>;
export type RoomArchiveEvent = z.infer<typeof RoomArchiveEventSchema>;
export type RoomRestoreEvent = z.infer<typeof RoomRestoreEventSchema>;
export type ArchivedListEvent = z.infer<typeof ArchivedListEventSchema>;
export type ArchivedRoom = z.infer<typeof ArchivedRoomSchema>;
export type ArchivedEvent = z.infer<typeof ArchivedEventSchema>;

export function roomLabel(room: { name: string | null; folder: string }): string {
  if (room.name) return room.name;
  const segments = room.folder.split(/[/\\]/).filter((part) => part.length > 0);
  return segments[segments.length - 1] ?? room.folder;
}

export const SlashCommandEntrySchema = z.object({
  name: z.string(),
  description: z.string(),
  argumentHint: z.string(),
});

export const FileEntrySchema = z.object({
  path: z.string(),
  kind: z.enum(['file', 'dir']),
});

export const CommandsListEventSchema = z.object({
  type: z.literal('commands_list'),
  roomId: z.string(),
});

export const CommandsEventSchema = z.object({
  type: z.literal('commands'),
  roomId: z.string(),
  source: z.enum(['sdk', 'disk']),
  commands: z.array(SlashCommandEntrySchema),
});

export const FilesListEventSchema = z.object({
  type: z.literal('files_list'),
  roomId: z.string(),
});

export const FilesEventSchema = z.object({
  type: z.literal('files'),
  roomId: z.string(),
  files: z.array(FileEntrySchema),
  truncated: z.boolean(),
});

export type SlashCommandEntry = z.infer<typeof SlashCommandEntrySchema>;
export type FileEntry = z.infer<typeof FileEntrySchema>;
export type CommandsListEvent = z.infer<typeof CommandsListEventSchema>;
export type CommandsEvent = z.infer<typeof CommandsEventSchema>;
export type FilesListEvent = z.infer<typeof FilesListEventSchema>;
export type FilesEvent = z.infer<typeof FilesEventSchema>;
