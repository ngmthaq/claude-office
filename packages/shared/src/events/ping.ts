import { z } from 'zod';

export const PingEventSchema = z.object({
  type: z.literal('ping'),
  time: z.number(),
});

export type PingEvent = z.infer<typeof PingEventSchema>;
