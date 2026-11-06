import { z } from 'zod';
import { RoomEventSchema } from './room-event.ts';

export const SessionHistoryEventSchema = z.object({
  type: z.literal('session_history'),
  roomId: z.string(),
  events: z.array(RoomEventSchema),
});

export type SessionHistoryEvent = z.infer<typeof SessionHistoryEventSchema>;
