import { z } from 'zod';
import { RoomSummarySchema } from '../models/room-summary.ts';

export const SessionsEventSchema = z.object({
  type: z.literal('sessions'),
  rooms: z.array(RoomSummarySchema),
});

export type SessionsEvent = z.infer<typeof SessionsEventSchema>;
