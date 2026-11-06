import { z } from 'zod';

export const ArchivedListEventSchema = z.object({
  type: z.literal('archived_list'),
});

export type ArchivedListEvent = z.infer<typeof ArchivedListEventSchema>;
