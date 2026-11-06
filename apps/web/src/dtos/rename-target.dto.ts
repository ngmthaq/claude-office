import { z } from 'zod';

export const ScreenRectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export type ScreenRect = z.infer<typeof ScreenRectSchema>;

export const RenamePlaceSchema = z.enum(['sidebar', 'office']);

export type RenamePlace = z.infer<typeof RenamePlaceSchema>;

export const RenameTargetSchema = z.object({
  roomId: z.string(),
  place: RenamePlaceSchema,
  rect: ScreenRectSchema.nullable(),
});

export type RenameTarget = z.infer<typeof RenameTargetSchema>;
