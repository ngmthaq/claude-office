import { z } from 'zod';
import { PermissionDecisionSchema } from '../models/permission-decision.ts';

const MAX_ANSWERS = 4;

export const PermissionAnswerEventSchema = z.object({
  type: z.literal('permission_answer'),
  roomId: z.string().min(1),
  requestId: z.string().min(1),
  decision: PermissionDecisionSchema,
  answers: z
    .record(z.string().min(1).max(1000), z.string().min(1).max(5000))
    .refine((answers) => Object.keys(answers).length <= MAX_ANSWERS, {
      message: `At most ${MAX_ANSWERS} answers are allowed`,
    })
    .optional(),
});

export type PermissionAnswerEvent = z.infer<typeof PermissionAnswerEventSchema>;
