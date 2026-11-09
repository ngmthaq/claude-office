# Title: Plan — Connect all rooms with a lobby

- Classification: feature
- Description: Draw a hallway under each row of rooms, join the hallways with a side corridor, and make sub-agents walk in from the hallway.

---

## Approach Summary / Goal

- Goal: the office reads as one connected floor instead of separate boxes.
- A new `LobbyView` draws under all rooms. It is rebuilt only when the number of rows or columns changes.
- The room grid and bottom doors stay as they are, so room code barely changes.

## Functional Requirements

- Every row of rooms has a full-width hallway directly below it, 44 px tall.
- A 32 px corridor on the right runs the full office height and joins every hallway. It is drawn even with one row, to match the picture you chose.
- Hallways continue under empty slots in an unfinished row.
- Hallways have a few decorations: one sofa and one plant per column, kept away from the door.
- A sub-agent appears in the hallway outside its room's door, walks to the door, then to its spot. When it finishes, it walks to the door, then out to the hallway, then disappears.
- Room names stay readable when drawn over the hallway.
- With no room selected, the camera fits the whole office, including hallways and corridor.

## Non-Functional Requirements

- Lobby sprites stay inside the lobby area, using the existing crop in `getSprite`.
- The lobby is not rebuilt on every room update.
- Code follows the style in `apps/web/src/game`. No new dependencies.

## Files in Scope

- Add: `apps/web/src/game/lobby-view.ts`
- Change: `apps/web/src/game/office-scene.ts`, `subagent-sprite.ts`, `room-view.ts`, `asset-loader.ts`, `assets/CREDITS.md`
- Update by command: `graphify-out/`

## Risks & Assumptions

- The office gets taller and wider, so the overview zooms out a little.
- Selecting a room still frames only that room, so hallway walking may be mostly out of view there.
- A sub-agent cannot be clicked during the short moment it is in the hallway, because each room only takes clicks inside its own area.
- Sub-agents only use the hallway outside their own door. They do not walk between rooms.
- The art change from the last task is not committed yet, so this work will sit on top of it.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks.

## Open Questions / Blockers

- None block the plan. See the browser check question below.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `asset-loader.ts`, add frames for four sofas. | developer | none | Frames as `x,y,w,h`: grey `119,66,33,15`; blue `120,83,33,16`; green `120,102,33,16`; orange `120,121,33,16`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Create `LobbyView` with `setLayout(columns, rows)`. Draw the floor with tint `0x9aa5b8`, code-drawn walls in the room wall color at 4 px, and decor. | developer | 1 | Column step is 208 px. Row step is 172 px. Hallway at room y 128–172. Corridor x starts 16 px right of the last column. Wall line runs along hallway tops wherever no room is above, and around the outer edge. Sofas at column x 16, cycling colors, and plants at column x 150, both at hallway y 2. Nothing draws outside the lobby area. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | In `office-scene.ts`, add the lobby under the rooms, set the row step to 172, and include the hallways and corridor in `computeBounds`. | developer | 2 | Lobby is below all rooms. Bounds width is `columns * 208 - 16 + 48`. Bounds height is `rows * 172`. Lobby rebuilds only when rows or columns change. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | In `subagent-sprite.ts`, add the hallway start point at `88,130` and two-part walks: hallway to door to spot, and spot to door to hallway. | developer | none | The sprite starts at the hallway point and is removed only after it returns there. The error mark, labels and overflow spots still work. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | DONE | In `room-view.ts`, add a dark outline to room name labels. Add a lobby line to `assets/CREDITS.md`. | developer | none | Name labels are readable on the hallway floor. Rename by double click still works. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | DONE | Run typecheck, lint and build. Run `graphify update .`. | developer | 1–5 | All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
