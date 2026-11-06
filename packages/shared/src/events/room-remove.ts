import { z } from 'zod';

export const RoomRemoveEventSchema = z.object({
  type: z.literal('room_remove'),
  roomId: z.string().min(1),
});

export type RoomRemoveEvent = z.infer<typeof RoomRemoveEventSchema>;
