import { z } from 'zod';

export const PeerMessageSourceSchema = z.enum(['handback', 'peer', 'task']);
export const TaskStatusSchema = z.enum(['completed', 'failed', 'killed']);

export const PeerMessageEventSchema = z.object({
  type: z.literal('peer_message'),
  roomId: z.string(),
  messageId: z.string(),
  senderName: z.string().nullable(),
  subagentId: z.string().nullable(),
  source: PeerMessageSourceSchema,
  title: z.string().nullable(),
  taskStatus: TaskStatusSchema.nullable(),
  body: z.string(),
  time: z.number(),
});

export type PeerMessageEvent = z.infer<typeof PeerMessageEventSchema>;
