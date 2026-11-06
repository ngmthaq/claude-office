import { z } from 'zod';
import { FileEntrySchema, SlashCommandEntrySchema } from '@claude-office/shared';

export const TriggerSchema = z.enum(['/', '@']);

export type Trigger = z.infer<typeof TriggerSchema>;

export const AutocompleteTokenSchema = z.object({
  trigger: TriggerSchema,
  query: z.string(),
  start: z.number(),
  end: z.number(),
});

export type AutocompleteToken = z.infer<typeof AutocompleteTokenSchema>;

export const AutocompleteRowsSchema = z.discriminatedUnion('trigger', [
  z.object({ trigger: z.literal('/'), items: z.array(SlashCommandEntrySchema) }),
  z.object({ trigger: z.literal('@'), items: z.array(FileEntrySchema) }),
]);

export type AutocompleteRows = z.infer<typeof AutocompleteRowsSchema>;

export const ListKindSchema = z.enum(['commands', 'files']);

export type ListKind = z.infer<typeof ListKindSchema>;
