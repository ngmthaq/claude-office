import { z } from 'zod';
import { PermissionItemSchema } from '@/dtos/permission-item.dto';
import { SubagentItemSchema } from '@/dtos/subagent-item.dto';
import { ToolResultSchema } from '@/dtos/tool-result.dto';

export const ChatItemSchema = z.union([
  z.object({ kind: z.literal('user'), id: z.string(), text: z.string() }),
  z.object({ kind: z.literal('assistant'), id: z.string(), text: z.string() }),
  z.object({
    kind: z.literal('tool'),
    id: z.string(),
    name: z.string(),
    input: z.unknown(),
    result: ToolResultSchema.nullable(),
    stopped: z.boolean().optional(),
  }),
  z.object({ kind: z.literal('error'), id: z.string(), code: z.string(), message: z.string() }),
  z.object({ kind: z.literal('auth'), id: z.string(), message: z.string() }),
  z.object({ kind: z.literal('notice'), id: z.string(), notice: z.enum(['stopped', 'closed']) }),
  PermissionItemSchema,
  SubagentItemSchema,
]);

export type ChatItem = z.infer<typeof ChatItemSchema>;
