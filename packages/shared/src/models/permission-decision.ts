import { z } from 'zod';

export const PermissionDecisionSchema = z.enum(['allow', 'deny']);

export type PermissionDecision = z.infer<typeof PermissionDecisionSchema>;
