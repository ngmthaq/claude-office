import { z } from 'zod';

export const WidthBoundsSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export type WidthBounds = z.infer<typeof WidthBoundsSchema>;
