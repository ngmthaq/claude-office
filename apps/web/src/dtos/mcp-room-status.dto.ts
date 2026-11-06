import { z } from 'zod';
import { McpServerEntrySchema } from '@claude-office/shared';

export const McpRoomStatusSchema = z.object({
  status: z.enum(['loading', 'ready', 'error']),
  live: z.boolean(),
  servers: z.array(McpServerEntrySchema),
  fetchedAt: z.number().nullable(),
});

export type McpRoomStatus = z.infer<typeof McpRoomStatusSchema>;
