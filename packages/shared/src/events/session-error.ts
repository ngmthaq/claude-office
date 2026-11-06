import { z } from 'zod';

export const SessionErrorEventSchema = z.object({
  type: z.literal('session_error'),
  roomId: z.string(),
  code: z.string(),
  message: z.string(),
});

export type SessionErrorEvent = z.infer<typeof SessionErrorEventSchema>;
