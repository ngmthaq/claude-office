# Title: Plan — Draw empty slots as vacant offices

- Classification: feature
- Description: Fill each empty grid slot with an unfurnished, dimmed room so no black section remains.

---

## Approach Summary / Goal

- Goal: an unfinished row looks like vacant offices instead of a black hole.
- `RoomView` already draws the floor, back wall, side walls and door. It will share those parts through one new helper, so vacant rooms always match real rooms.
- `LobbyView` already knows which slots are empty, so it will draw the vacant rooms.
- Every slot now looks like a room, so the special wall code around empty slots can go.

## Functional Requirements

- Each empty slot in an unfinished row shows a room with floor, back wall, side walls, bottom wall and door.
- A vacant room has no furniture, windows, clock, plants, people, lamp, name or badge.
- A vacant room is dimmed the same way as a closed room.
- A vacant room cannot be clicked or selected.
- All gaps between slots are lobby floor, in every row.
- A vacant room disappears when a new session fills its slot.

## Non-Functional Requirements

- Vacant rooms are drawn only when rows, columns or room count change.
- Code follows the style in `apps/web/src/game`. No new dependencies.

## Files in Scope

- Change: `apps/web/src/game/room-view.ts`, `apps/web/src/game/lobby-view.ts`
- Update by command: `graphify-out/`

## Risks & Assumptions

- I treated windows and the clock as furniture, so vacant rooms have plain walls. This makes them easy to tell apart from closed rooms.
- Removing the empty-slot wall code also fixes the small wall break noted earlier at 7 rooms.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks.

## Open Questions / Blockers

- None block the plan. See the browser check question below.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `room-view.ts`, add a public static `createVacantRoom()` that returns the floor, back wall, walls and door with a dark layer on top. Reuse the existing helpers and the closed-room alpha. | developer | none | The result is 192×128, has no furniture or windows, and draws nothing outside the room. Real rooms look the same as before. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | In `lobby-view.ts`, draw a vacant room at each empty slot, under the walls and decor. Draw gap floor for every column gap in every row. Remove the empty-slot wall line and the right wall beside empty slots. | developer | 1 | With 5 rooms, slot 6 shows a vacant room and no black section remains. With 7 rooms, both empty slots are vacant rooms. Top-row gap walls and hallway end walls stay. The lobby does not rebuild when the room count is unchanged. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | Run typecheck, lint and build. Run `graphify update .`. | developer | 1–2 | All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
