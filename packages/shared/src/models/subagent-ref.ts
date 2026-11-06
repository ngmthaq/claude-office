import { z } from 'zod';

export const SubagentRefSchema = z.object({ id: z.string(), agentType: z.string() });

export type SubagentRef = z.infer<typeof SubagentRefSchema>;
