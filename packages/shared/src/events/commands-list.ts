import { z } from 'zod';

export const CommandsListEventSchema = z.object({
  type: z.literal('commands_list'),
  roomId: z.string(),
});

export type CommandsListEvent = z.infer<typeof CommandsListEventSchema>;
