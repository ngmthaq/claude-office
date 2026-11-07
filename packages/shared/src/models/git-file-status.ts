import { z } from 'zod';

export const GitFileStatusSchema = z.enum(['M', 'A', 'U', 'D', 'R']);

export type GitFileStatus = z.infer<typeof GitFileStatusSchema>;
