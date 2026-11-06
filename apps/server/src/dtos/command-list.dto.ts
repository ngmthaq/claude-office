import { z } from 'zod';
import { SlashCommandEntrySchema } from '@claude-office/shared';

export const CommandListSchema = z.object({
  source: z.enum(['sdk', 'disk']),
  commands: z.array(SlashCommandEntrySchema),
});

export type CommandList = z.infer<typeof CommandListSchema>;
