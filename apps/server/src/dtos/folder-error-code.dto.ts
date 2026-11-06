import { z } from 'zod';

export const FolderErrorCodeSchema = z.enum([
  'not_absolute',
  'not_found',
  'outside_home',
  'unreadable',
]);

export type FolderErrorCode = z.infer<typeof FolderErrorCodeSchema>;
