import { z } from 'zod';
import { PermissionModeSchema } from '../models/permission-mode.ts';

export const RoomPermissionModeEventSchema = z.object({
  type: z.literal('room_permission_mode'),
  roomId: z.string().min(1),
  mode: PermissionModeSchema,
});

export type RoomPermissionModeEvent = z.infer<typeof RoomPermissionModeEventSchema>;
