import { z } from 'zod';

export const SystemEventEventSchema = z.object({
  type: z.literal('system_event'),
  roomId: z.string(),
  eventId: z.string(),
  name: z.string(),
  content: z.string(),
  isError: z.boolean(),
  time: z.number(),
});

export type SystemEventEvent = z.infer<typeof SystemEventEventSchema>;
