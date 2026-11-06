import { z } from 'zod';

export const ToolCallEventSchema = z.object({
  type: z.literal('tool_call'),
  roomId: z.string(),
  toolUseId: z.string(),
  name: z.string(),
  input: z.unknown(),
});

export type ToolCallEvent = z.infer<typeof ToolCallEventSchema>;
