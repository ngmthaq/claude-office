import { z } from 'zod';

export const RoomRestoreEventSchema = z.object({
  type: z.literal('room_restore'),
  roomId: z.string().min(1),
});

export type RoomRestoreEvent = z.infer<typeof RoomRestoreEventSchema>;
