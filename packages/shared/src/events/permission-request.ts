import { z } from 'zod';

export const PermissionRequestEventSchema = z.object({
  type: z.literal('permission_request'),
  roomId: z.string(),
  requestId: z.string(),
  toolName: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  input: z.unknown(),
  fromSubagent: z.boolean(),
  time: z.number(),
});

export type PermissionRequestEvent = z.infer<typeof PermissionRequestEventSchema>;
