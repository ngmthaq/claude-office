import { z } from 'zod';

export const CodeTreeListEventSchema = z.object({
  type: z.literal('code_tree_list'),
  roomId: z.string(),
});

export type CodeTreeListEvent = z.infer<typeof CodeTreeListEventSchema>;
