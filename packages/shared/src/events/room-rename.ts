import { z } from 'zod';
import { ROOM_NAME_MAX } from '../models/room-summary.ts';

export const RoomRenameEventSchema = z.object({
  type: z.literal('room_rename'),
  roomId: z.string().min(1),
  name: z.string().trim().max(ROOM_NAME_MAX),
});

export type RoomRenameEvent = z.infer<typeof RoomRenameEventSchema>;
