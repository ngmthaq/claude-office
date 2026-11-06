import { z } from 'zod';

export const SessionStopEventSchema = z.object({
  type: z.literal('session_stop'),
  roomId: z.string().min(1),
});

export type SessionStopEvent = z.infer<typeof SessionStopEventSchema>;
