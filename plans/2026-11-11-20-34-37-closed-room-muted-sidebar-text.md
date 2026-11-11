# Title: Plan — Muted text for closed rooms in the sidebar

- Classification: feature
- Description: Remove the hidden "closed" badge from sidebar rows and show closed rooms with grey text instead.

---

## Approach Summary / Goal

- The "closed" badge sits inside the cut-off room name, so users almost never see it. Color works at any name length.
- A closed, unselected row uses Bootstrap's grey secondary text color (`text-body-secondary`). A selected row stays normal blue.
- Goal: users can tell closed rooms from open rooms at a glance.

## Functional Requirements

- The sidebar no longer shows a "closed" badge.
- A closed room that is not selected shows its name in light grey (`text-body-tertiary`) instead of the normal body color. (Changed from `text-body-secondary` after user review: the difference was too small.)
- A closed room that is selected looks the same as any selected room (blue button, white text).
- Screen readers still hear that the room is closed: a visually hidden ` (closed)` text (`visually-hidden` class) follows the name.
- Open rooms look the same as now.

## Non-Functional Requirements

- Use Bootstrap theme classes only. Add no new CSS, so light and dark mode both work.
- Add no new code comments.

## Files in Scope

- `apps/web/src/components/organisms/SessionList.tsx`

## Risks & Assumptions

- Assumption (my default, tell me if you don't want it): screen readers get a hidden "(closed)", because without the badge the color would be the only sign.
- `Badge` stays imported only if something else in `SessionList.tsx` still uses it. Otherwise the import is removed.
- The redesigned background tasks popup from earlier is still uncommitted. This task does not touch those files.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | In `SessionList.tsx`, remove the "closed" `Badge`. When `room.state === 'closed'` and the room is not selected, use `text-body-secondary` instead of `text-body` on the row button. After the name, add `<span className="visually-hidden"> (closed)</span>` for closed rooms. Remove the `Badge` import if it is no longer used. | developer | none | No "closed" badge. Closed unselected rows have grey text, and selected rows look like any other selected row. Screen readers read "(closed)". Open rows are unchanged. Web type check, eslint, and prettier pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/CLEAN_CODE/KISS.md` |
| 2   | TODO   | Run `graphify update .`. | developer | 1 | The graph is updated. | — |
