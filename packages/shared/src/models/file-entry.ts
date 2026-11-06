import { z } from 'zod';

export const FileEntrySchema = z.object({
  path: z.string(),
  kind: z.enum(['file', 'dir']),
});

export type FileEntry = z.infer<typeof FileEntrySchema>;
