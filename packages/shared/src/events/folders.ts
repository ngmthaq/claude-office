import { z } from 'zod';
import { FolderEntrySchema } from '../models/folder-entry.ts';

export const FoldersEventSchema = z.object({
  type: z.literal('folders'),
  path: z.string(),
  parent: z.string().nullable(),
  entries: z.array(FolderEntrySchema),
});

export type FoldersEvent = z.infer<typeof FoldersEventSchema>;
