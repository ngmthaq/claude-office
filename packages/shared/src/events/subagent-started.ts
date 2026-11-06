import { z } from 'zod';

export const SubagentStartedEventSchema = z.object({
  type: z.literal('subagent_started'),
  roomId: z.string(),
  subagentId: z.string(),
  agentType: z.string(),
  description: z.string(),
  prompt: z.string(),
  time: z.number(),
});

export type SubagentStartedEvent = z.infer<typeof SubagentStartedEventSchema>;
