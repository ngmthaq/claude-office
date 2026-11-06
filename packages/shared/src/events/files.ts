import { z } from 'zod';
import { FileEntrySchema } from '../models/file-entry.ts';

export const FilesEventSchema = z.object({
  type: z.literal('files'),
  roomId: z.string(),
  files: z.array(FileEntrySchema),
  truncated: z.boolean(),
});

export type FilesEvent = z.infer<typeof FilesEventSchema>;
