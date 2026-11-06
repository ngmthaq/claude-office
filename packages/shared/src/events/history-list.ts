import { z } from 'zod';

export const HistoryListEventSchema = z.object({
  type: z.literal('history_list'),
});

export type HistoryListEvent = z.infer<typeof HistoryListEventSchema>;
