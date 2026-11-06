import { z } from 'zod';
import { SubagentStatusSchema } from '../models/subagent-status.ts';

export const SubagentFinishedEventSchema = z.object({
  type: z.literal('subagent_finished'),
  roomId: z.string(),
  subagentId: z.string(),
  status: SubagentStatusSchema,
  result: z.string(),
  hiddenToolCalls: z.number().int().min(0),
  time: z.number(),
});

export type SubagentFinishedEvent = z.infer<typeof SubagentFinishedEventSchema>;
