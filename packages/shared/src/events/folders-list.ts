import { z } from 'zod';

export const FoldersListEventSchema = z.object({
  type: z.literal('folders_list'),
  path: z.string().optional(),
});

export type FoldersListEvent = z.infer<typeof FoldersListEventSchema>;
