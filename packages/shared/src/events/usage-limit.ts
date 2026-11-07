import { z } from 'zod';
import { UsageLimitSchema } from '../models/usage-limit.ts';

export const UsageLimitEventSchema = z.object({
  type: z.literal('usage_limit'),
  limit: UsageLimitSchema,
});

export type UsageLimitEvent = z.infer<typeof UsageLimitEventSchema>;
