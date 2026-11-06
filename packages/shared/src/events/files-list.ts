import { z } from 'zod';

export const FilesListEventSchema = z.object({
  type: z.literal('files_list'),
  roomId: z.string(),
});

export type FilesListEvent = z.infer<typeof FilesListEventSchema>;
