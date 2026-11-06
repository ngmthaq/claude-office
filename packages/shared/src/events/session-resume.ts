import { z } from 'zod';

export const SessionResumeEventSchema = z.object({
  type: z.literal('session_resume'),
  sessionId: z.string().min(1),
});

export type SessionResumeEvent = z.infer<typeof SessionResumeEventSchema>;
