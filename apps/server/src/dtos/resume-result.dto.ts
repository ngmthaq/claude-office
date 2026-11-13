import { z } from 'zod';
import { RoomSummarySchema } from '@claude-office/shared';
import { FolderErrorCodeSchema } from '@/dtos/folder-error-code.dto.ts';

export const ResumeErrorCodeSchema = z.enum([
  ...FolderErrorCodeSchema.options,
  'session_not_found',
  'load_failed',
]);

export const ResumeResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), room: RoomSummarySchema }),
  z.object({ ok: z.literal(false), code: ResumeErrorCodeSchema }),
]);

export type ResumeResult = z.infer<typeof ResumeResultSchema>;
