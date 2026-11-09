import { z } from 'zod';
import { ATTACHMENT_MAX_FILES, AttachmentUploadSchema } from '../models/attachment.ts';

export const SessionSendEventSchema = z
  .object({
    type: z.literal('session_send'),
    roomId: z.string().min(1),
    text: z.string().max(100000),
    attachments: z.array(AttachmentUploadSchema).max(ATTACHMENT_MAX_FILES).optional(),
  })
  .refine((event) => event.text.trim() !== '' || (event.attachments?.length ?? 0) > 0, {
    message: 'Text or at least one attachment is required.',
    path: ['text'],
  });

export type SessionSendEvent = z.infer<typeof SessionSendEventSchema>;
