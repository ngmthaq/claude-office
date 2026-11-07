# Title: Plan: change usage badge text order and add spacing

- Classification: feature
- Description: Change the badge text to `resets in 3h 55m · 38% used`, and add more space between it and the buttons.

## Changes

- **New text:**
  - **Text:** `resets in 3h 55m · 38% used`. The `5h` prefix goes away. The hover text still says "5-hour limit resets at …" and the hourglass icon stays.
  - **Partial data:** with only a reset time it shows `resets in 3h 55m`. With only a % it shows `38% used`.
  - **After the reset time:** it shows `reset · 38% used`.
- **Spacing:** add a right margin of `1rem` (`me-3`) to the badge. Today the gap is the group's `gap-2`, which is `0.5rem`.
- **Clean-up:** remove the `window` (`5h`) label from `USAGE_LIMIT_TEXT` if nothing else uses it, and add a `used` label.

## Files in Scope

- `apps/web/src/components/molecules/UsageLimitBadge.tsx`
- `apps/web/src/configs/ui.config.ts`

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Change the badge text order to the format above and add `me-3`. Clean up `USAGE_LIMIT_TEXT`. | developer | none | The text matches the 3 cases above. The gap to the buttons is 1rem bigger than before. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
