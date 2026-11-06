import { z } from 'zod';
import { PermissionDecisionSchema } from '../models/permission-decision.ts';

export const PermissionAnswerEventSchema = z.object({
  type: z.literal('permission_answer'),
  roomId: z.string().min(1),
  requestId: z.string().min(1),
  decision: PermissionDecisionSchema,
});

export type PermissionAnswerEvent = z.infer<typeof PermissionAnswerEventSchema>;
