import { z } from 'zod';
import { SlashCommandEntrySchema } from '../models/slash-command-entry.ts';

export const CommandsEventSchema = z.object({
  type: z.literal('commands'),
  roomId: z.string(),
  source: z.enum(['sdk', 'disk']),
  commands: z.array(SlashCommandEntrySchema),
});

export type CommandsEvent = z.infer<typeof CommandsEventSchema>;
