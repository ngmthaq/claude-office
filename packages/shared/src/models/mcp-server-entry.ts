import { z } from 'zod';
import { McpServerStatusValueSchema } from './mcp-server-status-value.ts';

export const McpServerEntrySchema = z.object({
  name: z.string(),
  status: McpServerStatusValueSchema,
  source: z.string().nullable(),
  error: z.string().nullable(),
  toolCount: z.number(),
});

export type McpServerEntry = z.infer<typeof McpServerEntrySchema>;
