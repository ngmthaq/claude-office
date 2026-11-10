import {
  AttachmentInfoSchema,
  InternalEventItemSchema,
  PeerMessageSourceSchema,
  TaskStatusSchema,
} from '@claude-office/shared';
import { z } from 'zod';
import { PermissionItemSchema } from '@/dtos/permission-item.dto';
import { SubagentItemSchema } from '@/dtos/subagent-item.dto';
import { ToolResultSchema } from '@/dtos/tool-result.dto';

export const ChatItemSchema = z.union([
  z.object({
    kind: z.literal('user'),
    id: z.string(),
    text: z.string(),
    attachments: z.array(AttachmentInfoSchema).optional(),
  }),
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
  z.object({
    kind: z.literal('peer'),
    id: z.string(),
    senderName: z.string().nullable(),
    subagentId: z.string().nullable(),
    source: PeerMessageSourceSchema,
    title: z.string().nullable(),
    taskStatus: TaskStatusSchema.nullable(),
    body: z.string(),
  }),
  z.object({
    kind: z.literal('system'),
    id: z.string(),
    name: z.string(),
    content: z.string(),
    isError: z.boolean(),
  }),
  z.object({
    kind: z.literal('internal'),
    id: z.string(),
    total: z.number(),
    items: z.array(InternalEventItemSchema),
  }),
  PermissionItemSchema,
  SubagentItemSchema,
]);

export type ChatItem = z.infer<typeof ChatItemSchema>;
