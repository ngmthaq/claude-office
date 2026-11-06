import { z } from 'zod';

export const PermissionStatusSchema = z.enum(['pending', 'sending', 'allow', 'deny', 'cancelled']);

export type PermissionStatus = z.infer<typeof PermissionStatusSchema>;

export const PermissionItemSchema = z.object({
  kind: z.literal('permission'),
  id: z.string(),
  toolName: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  input: z.unknown(),
  fromSubagent: z.boolean(),
  status: PermissionStatusSchema,
});

export type PermissionItem = z.infer<typeof PermissionItemSchema>;
