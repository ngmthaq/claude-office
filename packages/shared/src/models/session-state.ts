import { z } from 'zod';

export const SessionStateSchema = z.enum(['idle', 'working', 'waiting', 'closed']);

export type SessionState = z.infer<typeof SessionStateSchema>;
