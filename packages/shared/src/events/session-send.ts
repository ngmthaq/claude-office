import { z } from 'zod';

export const SessionSendEventSchema = z.object({
  type: z.literal('session_send'),
  roomId: z.string().min(1),
  text: z.string().min(1).max(100000),
});

export type SessionSendEvent = z.infer<typeof SessionSendEventSchema>;
