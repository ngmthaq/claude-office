# Title: Plan — Add space between the Prompt box and "Tool calls"

- Classification: feature
- Description: Give the prompt box the same bottom space as the Task text.

## Approach Summary / Goal

- `.subagent-details__prompt` has `margin: 0`, so only the 0.5rem flex gap separates it from the "Tool calls" heading. The Task `<p>` above has a 1rem Bootstrap bottom margin.
- Change the prompt margin to `0 0 1rem` so the spacing matches.

## Files in Scope

- `apps/web/src/styles.css`

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `apps/web/src/styles.css`, change `.subagent-details__prompt { margin: 0; }` to `margin: 0 0 1rem;` | developer | none | The space under the prompt box matches the space under the Task text. `pnpm lint` passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
