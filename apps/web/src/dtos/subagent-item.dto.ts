import { z } from 'zod';
import { ToolResultSchema } from '@/dtos/tool-result.dto';

export const SubagentToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  input: z.unknown(),
  result: ToolResultSchema.nullable(),
});

export type SubagentTool = z.infer<typeof SubagentToolSchema>;

export const SubagentItemSchema = z.object({
  kind: z.literal('subagent'),
  id: z.string(),
  agentType: z.string(),
  description: z.string(),
  prompt: z.string(),
  status: z.enum(['working', 'done', 'error', 'stopped']),
  tools: z.array(SubagentToolSchema),
  result: z.string().nullable(),
  hiddenToolCalls: z.number(),
});

export type SubagentItem = z.infer<typeof SubagentItemSchema>;
