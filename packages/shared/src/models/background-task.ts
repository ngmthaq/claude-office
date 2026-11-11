import { z } from 'zod';

export const BackgroundTaskSchema = z.object({
  id: z.string(),
  kind: z.enum(['agent', 'command', 'other']),
  description: z.string(),
  subagentId: z.string().nullable(),
  startedAt: z.number(),
});

export type BackgroundTask = z.infer<typeof BackgroundTaskSchema>;
