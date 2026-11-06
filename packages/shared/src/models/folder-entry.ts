import { z } from 'zod';

export const FolderEntrySchema = z.object({
  name: z.string(),
  path: z.string(),
});

export type FolderEntry = z.infer<typeof FolderEntrySchema>;
