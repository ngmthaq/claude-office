import { z } from 'zod';

export const PongEventSchema = z.object({
  type: z.literal('pong'),
  time: z.number(),
});

export type PongEvent = z.infer<typeof PongEventSchema>;
