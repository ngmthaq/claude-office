import { z } from 'zod';

export const McpServerStatusValueSchema = z.enum([
  'connected',
  'failed',
  'needs-auth',
  'pending',
  'disabled',
]);

export type McpServerStatusValue = z.infer<typeof McpServerStatusValueSchema>;
