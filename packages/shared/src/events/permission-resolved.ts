import { z } from 'zod';

export const PermissionResolvedEventSchema = z.object({
  type: z.literal('permission_resolved'),
  roomId: z.string(),
  requestId: z.string(),
  decision: z.enum(['allow', 'deny', 'cancelled']),
});

export type PermissionResolvedEvent = z.infer<typeof PermissionResolvedEventSchema>;
