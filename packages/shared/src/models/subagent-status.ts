import { z } from 'zod';

export const SubagentStatusSchema = z.enum(['done', 'error', 'stopped']);

export type SubagentStatus = z.infer<typeof SubagentStatusSchema>;
