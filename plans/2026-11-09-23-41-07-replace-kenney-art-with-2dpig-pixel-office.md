# Title: Plan — Replace Kenney art with 2dpig Pixel Office

- Classification: feature
- Description: Remove both Kenney packs and draw the office with named sprites from the 2dpig sheet.

---

## Approach Summary / Goal

- Goal: rooms look like a real office, using only art that is safe to ship.
- The new art is not on a grid, so the loader will use a table of named sprite positions.
- People are 13–19 px wide and 21–24 px tall, compared with 16×16 before. Rooms grow from 144×96 to 192×128 so nine people fit without overlapping.

## Functional Requirements

- The office view uses only `PixelOfficeAssets.png`. No Kenney files or code remain.
- Each room has a floor, back wall, two windows, clock, two plants, a main desk with a computer and mug, and four small desks.
- Each agent gets one of the 5 people, chosen from its existing seed.
- The current behaviour still works: working and waiting bubbles, bob, sub-agents entering and leaving through the door, error mark, labels, clicks, and the dark closed room.

## Non-Functional Requirements

- Pixels stay sharp (nearest-neighbour scaling).
- Code follows the existing style in `apps/web/src/game`.
- No new dependencies.

## Files in Scope

- Add: `assets/2dpig-pixel-office/PixelOfficeAssets.png`, `LICENSE.txt`, `README.txt`
- Delete: `assets/kenney-roguelike-indoors/`, `assets/kenney-roguelike-characters/`
- Change: `assets/CREDITS.md`, `apps/web/src/game/asset-loader.ts`, `agent-sprite.ts`, `subagent-sprite.ts`, `room-view.ts`
- Update by command: `graphify-out/`

## Risks & Assumptions

- Each person has one still frame, so walking stays as a slide and bob.
- Only 5 looks exist. Sub-agents of the same type will still look the same, as they do today.
- Bigger rooms change the camera fit, so the overview may show rooms at a slightly different zoom.
- The floor sprite is 73 px wide, so a small break in the brick pattern repeats. It is minor in the mock-up.
- The side walls and bottom wall stay drawn in code, because the pack has no matching art.
- Old files in `plans/` that mention Kenney stay unchanged as history.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks.

## Open Questions / Blockers

- None block the plan. The project setting asks me to check with you about a browser test, so see the question below.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Copy the PNG, license and readme to `assets/2dpig-pixel-office/`. Delete both Kenney folders. Rewrite `assets/CREDITS.md`. | developer | none | Only the 2dpig folder and credits remain in `assets/`. Credits name 2dPig, the URL and CC0. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | In `asset-loader.ts`, replace `getTile` and `SheetName` with one sheet, a named frame table, and `getSprite(name)`. Move the room grid constant out of the loader. | developer | 1 | Frames as `x,y,w,h`: floor `3,68,73,24`; wall `84,70,26,20`; windows `59,96,26,21` and `88,96,26,21`; clock `159,108,19,6`; plant `170,65,14,19`; main desk `115,47,40,16`; small desk `85,47,26,16`; computer `233,106,15,19`; mug `169,95,8,7`; desk items `211,119,11,8`, `211,129,11,8`, `211,140,11,8`; people `2,105,15,23`, `19,104,19,24`, `40,107,13,21`, `3,132,17,23`, `22,132,17,23`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | In `agent-sprite.ts`, replace the skin, clothes and hair layers with one person picked by hash. Use a 20×24 cell, centred and bottom-aligned. Move the bubbles to fit. | developer | 2 | Same seed gives the same person. Bubbles sit above the head. Bob still works. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | In `subagent-sprite.ts`, set the door position to `88,100`. Use the 20×24 cell for the click area, label and error mark. | developer | 3 | Sub-agents enter and leave at the door and stay inside the room. Click and label work. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | DONE | In `room-view.ts`, set the room to 12×8 tiles. Draw the floor, back wall, decor and desks as in the mock-up. Update the agent position, seats and standing spots. | developer | 2, 3, 4 | Root agent at `72,26`. Desks at x `16,60,106,150`, y `96`. Seats at x `19,63,109,153`, y `74`. Standing spots `6,40`, `36,46`, `136,46`, `166,40`. Door centred in the bottom wall. Eight sub-agents do not overlap. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | DONE | Run typecheck, lint and build. Search for leftover Kenney code. Run `graphify update .`. | developer | 1–5 | All checks pass. No `kenney` or `getTile` remains in `apps/` or `assets/`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
