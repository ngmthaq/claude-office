import { z } from 'zod';

export const SessionStartEventSchema = z.object({
  type: z.literal('session_start'),
  folder: z.string().min(1),
});

export type SessionStartEvent = z.infer<typeof SessionStartEventSchema>;
