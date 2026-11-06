import { z } from 'zod';

export const TurnDoneEventSchema = z.object({
  type: z.literal('turn_done'),
  roomId: z.string(),
  isError: z.boolean(),
});

export type TurnDoneEvent = z.infer<typeof TurnDoneEventSchema>;
