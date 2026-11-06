import { z } from 'zod';
import { McpServerEntrySchema } from '../models/mcp-server-entry.ts';

export const McpStatusEventSchema = z.object({
  type: z.literal('mcp_status'),
  roomId: z.string(),
  /** False when the room has no running Claude process, so there is no status to read. */
  live: z.boolean(),
  servers: z.array(McpServerEntrySchema),
});

export type McpStatusEvent = z.infer<typeof McpStatusEventSchema>;
