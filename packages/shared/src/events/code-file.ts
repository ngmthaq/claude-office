import { z } from 'zod';
import { GitFileStatusSchema } from '../models/git-file-status.ts';

export const CodeFileEventSchema = z.object({
  type: z.literal('code_file'),
  roomId: z.string(),
  path: z.string(),
  status: GitFileStatusSchema.nullable(),
  head: z.string().nullable(),
  current: z.string().nullable(),
  unavailable: z.enum(['too_large', 'binary', 'not_found']).nullable(),
});

export type CodeFileEvent = z.infer<typeof CodeFileEventSchema>;
