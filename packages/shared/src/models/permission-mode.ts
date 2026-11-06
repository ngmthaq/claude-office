import { z } from 'zod';

export const PermissionModeSchema = z.enum(['default', 'acceptEdits', 'auto']);

export type PermissionMode = z.infer<typeof PermissionModeSchema>;
