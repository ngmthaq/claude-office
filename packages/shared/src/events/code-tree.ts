import { z } from 'zod';
import { FileEntrySchema } from '../models/file-entry.ts';
import { GitFileStatusSchema } from '../models/git-file-status.ts';

export const CodeTreeEventSchema = z.object({
  type: z.literal('code_tree'),
  roomId: z.string(),
  files: z.array(FileEntrySchema),
  truncated: z.boolean(),
  isGitRepo: z.boolean(),
  statuses: z.array(
    z.object({
      path: z.string(),
      status: GitFileStatusSchema,
      oldPath: z.string().optional(),
    }),
  ),
});

export type CodeTreeEvent = z.infer<typeof CodeTreeEventSchema>;
