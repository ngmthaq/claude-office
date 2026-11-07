import { z } from 'zod';

export const UsageLimitSchema = z.object({
  utilization: z.number().nullable(),
  resetsAt: z.number().nullable(),
  updatedAt: z.number(),
});

export type UsageLimit = z.infer<typeof UsageLimitSchema>;
