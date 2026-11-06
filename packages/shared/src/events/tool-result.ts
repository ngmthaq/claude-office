import { z } from 'zod';

export const ToolResultEventSchema = z.object({
  type: z.literal('tool_result'),
  roomId: z.string(),
  toolUseId: z.string(),
  content: z.string(),
  isError: z.boolean(),
});

export type ToolResultEvent = z.infer<typeof ToolResultEventSchema>;
