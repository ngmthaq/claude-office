import { AttachmentKindSchema } from '@claude-office/shared';
import { z } from 'zod';

export const AttachmentDraftSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  kind: AttachmentKindSchema,
  mediaType: z.string(),
  status: z.enum(['reading', 'ready', 'error']),
  error: z.string().optional(),
  data: z.string().optional(),
});

export type AttachmentDraft = z.infer<typeof AttachmentDraftSchema>;
