import { z } from 'zod';
import { McpServerEntrySchema } from '@claude-office/shared';

export const McpStatusListSchema = z.object({
  live: z.boolean(),
  servers: z.array(McpServerEntrySchema),
});

export type McpStatusList = z.infer<typeof McpStatusListSchema>;
