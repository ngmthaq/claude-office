# Title: Plan — Use a toggle button with a tooltip for the floor control

- Classification: feature
- Description: Replace the "Show floor" switch in the header with an `IconButton` that stays filled while the floor is shown.

---

## Approach Summary / Goal

- `HeaderActions.tsx` uses the existing `IconButton` in place of `Form.Check`.
- Bootstrap's `active` style shows the on and off states, and `aria-pressed` tells screen readers the state.
- The store, layout, and saved value do not change.
- Goal: the control matches the other header buttons and takes less space.

## Functional Requirements

- The header shows an icon button with the `building` icon, in the same place as the switch.
- The tooltip and accessible name are always "Show floor", below the button like its neighbours.
- Floor shown: the button looks filled and `aria-pressed` is `true`.
- Floor hidden: the button looks like the other outline buttons and `aria-pressed` is `false`.
- A click, or Enter or Space on the focused button, turns the floor on or off.
- All other behaviour from issue #6 stays the same.

## Non-Functional Requirements

- Web app only. `IconButton` itself does not change.
- Code follows `CODING_CONVENTIONS.md`.

## Files in Scope

- `apps/web/src/components/organisms/HeaderActions.tsx` (change)
- `apps/web/src/configs/ui.config.ts` (change)

## Risks & Assumptions

- Assumption: the tooltip stays "Show floor" and does not change to "Hide floor". With `aria-pressed`, a label that changes would confuse screen readers, because "Hide floor, pressed" has an unclear meaning.
- Assumption: the `building` icon is the best match for the office floor.
- Change from issue #6: the issue asks for a "switch". This plan replaces it with a toggle button, as you asked.
- Automated tests are skipped, because the project setting is `Skip-Testing`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1 | DONE | In `HeaderActions.tsx`, replace `Form.Check` with `IconButton` (`icon="building"`, `placement="bottom"`, `active`, `aria-pressed`, and an `onClick` that flips the value). Remove the `Form` import. Rename `FLOOR_TEXT.switchLabel` to `toggleLabel` in `ui.config.ts`. | developer | none | No switch in the DOM. The button shows the tooltip "Show floor". `active` and `aria-pressed` follow the store. A click and the keyboard both flip the value. | `guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
| 2 | SKIPPED | Automated tests. Reason: the project uses `Skip-Testing`. | tester | none | None. | `agents/party-mode-tester.md#testing-workflow` |

After the review, I will check the button in a real browser with Claude in Chrome: the tooltip, both looks, keyboard use, and that the value is kept after a reload.
