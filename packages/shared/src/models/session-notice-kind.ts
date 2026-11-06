import { z } from 'zod';

export const SessionNoticeKindSchema = z.enum(['stopped', 'closed']);

export type SessionNoticeKind = z.infer<typeof SessionNoticeKindSchema>;
