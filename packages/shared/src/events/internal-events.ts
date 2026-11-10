import { z } from 'zod';

export const InternalEventItemSchema = z.object({
  name: z.string(),
  detail: z.string(),
});

export const InternalEventsEventSchema = z.object({
  type: z.literal('internal_events'),
  roomId: z.string(),
  total: z.number(),
  items: z.array(InternalEventItemSchema),
  time: z.number(),
});

export type InternalEventItem = z.infer<typeof InternalEventItemSchema>;
export type InternalEventsEvent = z.infer<typeof InternalEventsEventSchema>;
