import { z } from 'zod';

export const ToolResultSchema = z.object({
  content: z.string(),
  isError: z.boolean(),
});

export type ToolResult = z.infer<typeof ToolResultSchema>;
