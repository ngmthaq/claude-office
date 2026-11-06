import { z } from 'zod';
import { PermissionModeSchema } from './permission-mode.ts';
import { SessionStateSchema } from './session-state.ts';
import { SubagentRefSchema } from './subagent-ref.ts';

export const ROOM_NAME_MAX = 60;

export const RoomSummarySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  folder: z.string(),
  createdAt: z.number(),
  sessionId: z.string().nullable(),
  busy: z.boolean(),
  state: SessionStateSchema,
  subagents: z.array(SubagentRefSchema),
  permissionMode: PermissionModeSchema,
});

export type RoomSummary = z.infer<typeof RoomSummarySchema>;

export function roomLabel(room: { name: string | null; folder: string }): string {
  if (room.name) return room.name;
  const segments = room.folder.split(/[/\\]/).filter((part) => part.length > 0);
  return segments[segments.length - 1] ?? room.folder;
}
