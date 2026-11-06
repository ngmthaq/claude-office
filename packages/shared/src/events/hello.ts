import { z } from 'zod';

export const HelloEventSchema = z.object({
  type: z.literal('hello'),
  serverVersion: z.string(),
  time: z.number(),
});

export type HelloEvent = z.infer<typeof HelloEventSchema>;
