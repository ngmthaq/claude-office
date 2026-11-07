# Title: Plan — Sub-agent name labels on the top layer, and shorter labels

- Classification: bug
- Description: Attach each sub-agent's name label to the room's `overlayLayer`, and cut labels to 9 characters so neighbors don't touch.

---

## Approach Summary / Goal

- Root cause: `typeLabel` is a child of `SubagentSprite`, which lives in `subagentLayer`. `RoomView` adds that layer before the desks (`room-view.ts:87-88`), so the main desk covers the label of a sub-agent sitting under it. The round before only moved bubbles and the error mark to `overlayLayer`.
- Fix 1: add `typeLabel` to `SubagentSprite.overlays`. `RoomView` already attaches every overlay on spawn and detaches them on remove, so `room-view.ts` needs no change.
- Fix 2: lower `SubagentSprite.labelMaxChars` from 12 to 9. A label then fits inside the 32 px between seats.
- Goal: no furniture covers a sub-agent name, and neighboring names don't run into each other.

## Functional Requirements

- A sub-agent's name label draws above desks, walls, plants, and other agents, and below `darkLayer`.
- Labels longer than 9 characters show the first 8 plus "…" (for example "general-…").
- Labels still show only in the selected room (`setLabelVisible` works as before).
- The label still moves with its sub-agent, and is removed from the layer when the sub-agent leaves.

## Non-Functional Requirements

- Keep the current class style. Type-check and lint pass.

## Files in Scope

- `apps/web/src/game/subagent-sprite.ts`

## Risks & Assumptions

- Assumption: the 8 standing spots (side walls, `x: 4` and `x: 124`) are far enough from the seats that 9-character labels won't touch.
- Risk: a label on the top layer can now draw over a neighbor's bubble if they are close. The label sits just above its own bubble (both use `markY = -12`), so this should be rare.
- `Skip-Testing`: no regression test. The fix is checked by reading the diff, and you can run `/web-test` again.
- The busy-flag mismatch from the side note is out of scope.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | In `apps/web/src/game/subagent-sprite.ts`: add `typeLabel` to the `overlays` getter, and set `labelMaxChars = 9`. | developer | none | `overlays` returns bubbles, `errorMark`, and `typeLabel`. Labels cut at 9 characters with "…". The label shows only in the selected room. Type-check and lint pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
