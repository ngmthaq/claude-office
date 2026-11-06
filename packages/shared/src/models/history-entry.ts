import { z } from 'zod';

export const HistoryEntrySchema = z.object({
  sessionId: z.string().min(1),
  folder: z.string(),
  title: z.string(),
  firstPrompt: z.string().optional(),
  lastModified: z.number(),
  openRoomId: z.string().nullable(),
  canResume: z.boolean(),
});

export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
