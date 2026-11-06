import { z } from 'zod';

export const UserMessageEventSchema = z.object({
  type: z.literal('user_message'),
  roomId: z.string(),
  messageId: z.string(),
  text: z.string(),
  time: z.number(),
});

export type UserMessageEvent = z.infer<typeof UserMessageEventSchema>;
