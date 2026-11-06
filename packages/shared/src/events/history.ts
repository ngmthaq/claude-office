import { z } from 'zod';
import { HistoryEntrySchema } from '../models/history-entry.ts';

export const HistoryEventSchema = z.object({
  type: z.literal('history'),
  entries: z.array(HistoryEntrySchema),
});

export type HistoryEvent = z.infer<typeof HistoryEventSchema>;
