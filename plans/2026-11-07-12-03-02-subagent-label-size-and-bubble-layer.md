# Title: Plan — Smaller sub-agent name and message bubbles on top

- Classification: feature
- Description: Make the sub-agent name font smaller, and draw agent bubbles and the error mark in a per-room Pixi `RenderLayer` above the room furniture.

---

## Approach Summary / Goal

- Change `SubagentSprite.labelFontSize` from `6` to `5`.
- In `RoomView`, add a `RenderLayer` (Pixi 8.22) as a child placed after the walls, lamp, and badge, and before `darkLayer`. Bubbles and the error mark stay children of their own sprites, so they still move with the agent. They are only *rendered* in the bubble layer.
- `AgentSprite` and `SubagentSprite` expose their bubble and mark objects. `RoomView` attaches them to the layer for the main agent and for each sub-agent it spawns.
- Goal: no wall, desk, plant, lamp, badge, or other agent ever covers a bubble. Unselected rooms still dim bubbles.

## Functional Requirements

- The sub-agent name label uses font size 5.
- The working bubble, the waiting bubble (main agent and sub-agents), and the sub-agent error mark render above the floor, agents, desks, plants, walls, lamp, and badge.
- These items render below the room's `darkLayer`, so unselected rooms still dim them.
- Bubbles still follow the agent (walking, bobbing). Show/hide and blink still work as before.
- Clicks and hit areas don't change. The bubble layer does not catch pointer events.
- No leak: when a sub-agent is destroyed, its items leave the layer.

## Non-Functional Requirements

- Keep the current class style: `private static readonly` constants, camelCase, no new files.
- `pnpm` type-check and lint pass for `apps/web`.

## Files in Scope

- `apps/web/src/game/subagent-sprite.ts`
- `apps/web/src/game/agent-sprite.ts`
- `apps/web/src/game/room-view.ts`

## Risks & Assumptions

- Assumption: "message bubble" means the working and waiting bubbles over agents, not chat bubbles in the side panel.
- Risk: when Pixi destroys a `RenderLayer`-attached child, it detaches the child itself in v8. The developer must confirm this, or detach the items in `removeSubagent`.
- Sub-agents also cover each other's bubbles today. The shared layer fixes that too.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | In `subagent-sprite.ts`, set `labelFontSize = 5`. Add a public getter that returns the overlay items: the agent's bubbles plus `errorMark`. | developer | none | Font size is 5. The getter returns the bubble items and the error mark. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | In `agent-sprite.ts`, add a public getter (for example `overlays`) that returns `[workingBubble, waitingBubble]`. | developer | none | The getter exists. Bubble behavior does not change. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | In `room-view.ts`, create a `RenderLayer` (`eventMode` none) and add it after the badge and before `darkLayer`. Attach the main agent's overlays in the constructor. Attach each sub-agent's overlays in `spawnSubagent`, and detach them in `removeSubagent` if Pixi does not do it on destroy. | developer | 1, 2 | Bubbles and the error mark draw above walls, desks, and other agents, and below `darkLayer`. No errors when a sub-agent is removed. Type-check and lint pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
