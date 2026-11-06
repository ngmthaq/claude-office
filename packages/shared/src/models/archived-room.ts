import { z } from 'zod';

export const ArchivedRoomSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  folder: z.string(),
  sessionId: z.string(),
  archivedAt: z.number(),
});

export type ArchivedRoom = z.infer<typeof ArchivedRoomSchema>;
