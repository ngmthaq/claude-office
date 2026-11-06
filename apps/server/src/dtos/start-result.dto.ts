import { z } from 'zod';
import { RoomSummarySchema } from '@claude-office/shared';
import { FolderErrorCodeSchema } from '@/dtos/folder-error-code.dto.ts';

export const StartResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), room: RoomSummarySchema }),
  z.object({ ok: z.literal(false), code: FolderErrorCodeSchema }),
]);

export type StartResult = z.infer<typeof StartResultSchema>;
