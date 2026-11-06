import { z } from 'zod';

export const SubagentToolResultEventSchema = z.object({
  type: z.literal('subagent_tool_result'),
  roomId: z.string(),
  subagentId: z.string(),
  toolUseId: z.string(),
  content: z.string(),
  isError: z.boolean(),
});

export type SubagentToolResultEvent = z.infer<typeof SubagentToolResultEventSchema>;
