import { z } from 'zod';
import { SessionNoticeKindSchema } from '../models/session-notice-kind.ts';

export const SessionNoticeEventSchema = z.object({
  type: z.literal('session_notice'),
  roomId: z.string(),
  kind: SessionNoticeKindSchema,
  time: z.number(),
});

export type SessionNoticeEvent = z.infer<typeof SessionNoticeEventSchema>;
