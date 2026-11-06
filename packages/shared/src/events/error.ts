import { z } from 'zod';

export const ErrorEventSchema = z.object({
  type: z.literal('error'),
  code: z.string(),
  message: z.string(),
});

export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
