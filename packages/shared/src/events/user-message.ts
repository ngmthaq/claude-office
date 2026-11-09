import { z } from 'zod';
import { AttachmentInfoSchema } from '../models/attachment.ts';

export const UserMessageEventSchema = z.object({
  type: z.literal('user_message'),
  roomId: z.string(),
  messageId: z.string(),
  text: z.string(),
  time: z.number(),
  attachments: z.array(AttachmentInfoSchema).optional(),
});

export type UserMessageEvent = z.infer<typeof UserMessageEventSchema>;
