import { z } from 'zod';

export const SessionCloseEventSchema = z.object({
  type: z.literal('session_close'),
  roomId: z.string().min(1),
});

export type SessionCloseEvent = z.infer<typeof SessionCloseEventSchema>;
