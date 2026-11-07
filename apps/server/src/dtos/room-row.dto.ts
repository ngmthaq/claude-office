import { z } from 'zod';
import { PermissionModeSchema } from '@claude-office/shared';

export const RoomRowSchema = z
  .object({
    id: z.string(),
    session_id: z.string().nullable(),
    folder: z.string(),
    created_at: z.number(),
    name: z.string().nullable(),
    title: z.string().nullable(),
    archived_at: z.number().nullable(),
    permission_mode: PermissionModeSchema,
  })
  .transform((row) => ({
    id: row.id,
    sessionId: row.session_id,
    folder: row.folder,
    createdAt: row.created_at,
    name: row.name,
    title: row.title,
    archivedAt: row.archived_at,
    permissionMode: row.permission_mode,
  }));

export type RawRoomRow = z.input<typeof RoomRowSchema>;
export type RoomRow = z.infer<typeof RoomRowSchema>;

export function parseRoomRow(raw: unknown): RoomRow {
  return RoomRowSchema.parse(raw);
}
