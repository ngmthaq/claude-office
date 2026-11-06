import { z } from 'zod';
import { SessionStateSchema } from '../models/session-state.ts';

export const SessionStateEventSchema = z.object({
  type: z.literal('session_state'),
  roomId: z.string(),
  state: SessionStateSchema,
});

export type SessionStateEvent = z.infer<typeof SessionStateEventSchema>;
