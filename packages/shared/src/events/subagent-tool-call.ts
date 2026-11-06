import { z } from 'zod';

export const SubagentToolCallEventSchema = z.object({
  type: z.literal('subagent_tool_call'),
  roomId: z.string(),
  subagentId: z.string(),
  toolUseId: z.string(),
  name: z.string(),
  input: z.unknown(),
});

export type SubagentToolCallEvent = z.infer<typeof SubagentToolCallEventSchema>;
