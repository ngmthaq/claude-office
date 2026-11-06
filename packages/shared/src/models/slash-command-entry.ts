import { z } from 'zod';

export const SlashCommandEntrySchema = z.object({
  name: z.string(),
  description: z.string(),
  argumentHint: z.string(),
});

export type SlashCommandEntry = z.infer<typeof SlashCommandEntrySchema>;
