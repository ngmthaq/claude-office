import { z } from 'zod';
import { ArchivedRoomSchema } from '../models/archived-room.ts';

export const ArchivedEventSchema = z.object({
  type: z.literal('archived'),
  rooms: z.array(ArchivedRoomSchema),
});

export type ArchivedEvent = z.infer<typeof ArchivedEventSchema>;
