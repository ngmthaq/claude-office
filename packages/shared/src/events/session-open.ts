import { z } from 'zod';

export const SessionOpenEventSchema = z.object({
  type: z.literal('session_open'),
  roomId: z.string().min(1),
});

export type SessionOpenEvent = z.infer<typeof SessionOpenEventSchema>;
