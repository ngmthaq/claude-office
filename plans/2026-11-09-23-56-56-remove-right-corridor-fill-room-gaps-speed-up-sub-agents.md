# Title: Plan — Remove right corridor, fill room gaps, speed up sub-agents

- Classification: feature
- Description: Replace the right corridor with lobby floor in the gaps between rooms, and move sub-agents at a fixed speed.

---

## Approach Summary / Goal

- Goal: no black strips between rooms, no extra blue strip on the right, and sub-agents that walk at a normal speed.
- The 16 px gaps between rooms become lobby floor. They link each hallway to the next one, so the rooms stay connected without the corridor.
- Sub-agents use a fixed speed of 180 px per second, so short parts of the walk no longer crawl.

## Functional Requirements

- The right corridor is gone. Hallways end at the right edge of the last column.
- Each gap with a room on its left is lobby floor, using the same tint as the hallways.
- A gap beside an empty slot has a 4 px wall on its right side.
- Gaps in the top row have a 4 px wall at the top.
- Hallways are open into the gaps. Wall lines remain only above empty slots.
- A full sub-agent walk takes about 0.6–0.7 s to a seat or standing spot.

## Non-Functional Requirements

- Lobby sprites stay inside the lobby area, using the existing crop.
- The lobby is still rebuilt only when rows, columns or room count change.
- No new dependencies.

## Files in Scope

- Change: `apps/web/src/game/lobby-view.ts`, `apps/web/src/game/office-scene.ts`, `apps/web/src/game/subagent-sprite.ts`
- Update by command: `graphify-out/`

## Risks & Assumptions

- The gaps are 16 px wide, so they are narrow connections. Sub-agents do not walk through them.
- The empty slot in an unfinished row stays as dark background, because you asked only about the gaps between rooms.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks.

## Open Questions / Blockers

- None block the plan. See the browser check question below.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `lobby-view.ts`, remove the corridor and its walls. Hallways end at `columns * 208 - 16`. Add a right-end wall to each hallway. | developer | none | No floor or wall is drawn past x `columns * 208 - 16`. Each hallway has walls at both ends. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | In `lobby-view.ts`, draw tinted floor in each gap that has a room on its left, for y `r * 172` to `r * 172 + 128`. Add the side and top walls. Keep wall lines only above empty slots. | developer | 1 | No black strip remains between two rooms. A gap beside an empty slot has a 4 px right wall. Top-row gaps have a 4 px top wall. Each pair of hallways is joined by at least one gap when there are 2 or more columns. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | In `office-scene.ts`, set the bounds width to `columns * 208 - 16`. | developer | 1 | The camera fits the office without the corridor. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | In `subagent-sprite.ts`, replace `walkMs` with a speed of 180 px per second, and work out each part's time from its distance. | developer | none | The hallway-to-door part takes about 170 ms. Sprites still finish at the exact door, spot and hallway points. A part with no distance does not get stuck. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | DONE | Run typecheck, lint and build. Run `graphify update .`. | developer | 1–4 | All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
