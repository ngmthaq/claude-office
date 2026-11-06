import { z } from 'zod';

export const McpListEventSchema = z.object({
  type: z.literal('mcp_list'),
  roomId: z.string(),
});

export type McpListEvent = z.infer<typeof McpListEventSchema>;
