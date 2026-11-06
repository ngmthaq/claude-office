import { z } from 'zod';
import { RoomSummarySchema } from '../models/room-summary.ts';

export const SessionStartedEventSchema = z.object({
  type: z.literal('session_started'),
  room: RoomSummarySchema,
});

export type SessionStartedEvent = z.infer<typeof SessionStartedEventSchema>;
