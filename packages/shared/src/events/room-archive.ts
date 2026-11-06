import { z } from 'zod';

export const RoomArchiveEventSchema = z.object({
  type: z.literal('room_archive'),
  roomId: z.string().min(1),
});

export type RoomArchiveEvent = z.infer<typeof RoomArchiveEventSchema>;
