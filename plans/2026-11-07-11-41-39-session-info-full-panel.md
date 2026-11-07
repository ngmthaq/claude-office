# Title: Plan — Session info as a full panel (like the MCP panel)

- Classification: feature
- Description: Replace the overlay with a full panel that takes the place of the chat view, built the same way as `McpStatusPanel`.

---

## Approach Summary / Goal

- **New panel:** a new organism `SessionInfoPanel` (`roomId`, `roomName`) follows `McpStatusPanel.tsx`.
  - It renders `<main className="chat-panel" aria-label="Session info">`.
  - Its header has an `arrow-left` "Back to chat" button and the title `Session info · {roomName}`.
  - Its body has the same `<dl>` rows: centered, with no copy button and no progress bar.
  - It reads `room.info` from `useSessionsStore`, so values still update live.
- **ChatPanel:**
  - Add `if (infoRoomId === room.id) return <SessionInfoPanel … />`, placed next to the MCP check.
  - The (i) button opens the panel.
  - Remove the `chat-panel__body` wrapper and the backdrop.
- **Esc:** it still closes only the panel and goes back to the chat. It does not close the room.
- **Removed:**
  - The overlay molecule.
  - The backdrop and card CSS.
  - `position: relative` on `.chat-panel`.
  - The `toggle` action in the store, since nothing uses it now.
- **Goal:** session info looks and works like the MCP panel.

## Functional Requirements

- The (i) button in the chat header opens the full Session info view for that room.
- **Header:** Back arrow, then `Session info · <room name>`.
- **Body:** rows in this order: Working dir · Branch · PR/MR · Model · Effort · Context.
  - Labels sit vertically centered next to their values.
  - Long values wrap. Nothing is cut off.
  - A missing value shows `—`.
- **Closing:** the Back arrow or Esc goes back to the chat. Switching rooms closes the panel. Opening MCP is not possible from this view (the MCP button only shows in the chat view), so the two never overlap.
- **Chat view:** the chat looks exactly as it did before this feature (header, messages, input).

## Files in Scope

- **Create:** `apps/web/src/components/organisms/SessionInfoPanel.tsx`
- **Delete:** `apps/web/src/components/molecules/SessionInfoPanel.tsx`
- **Modify:**
  - `apps/web/src/components/organisms/ChatPanel.tsx`
  - `apps/web/src/hooks/store/useSessionInfoStore.ts` (remove `toggle`)
  - `apps/web/src/styles/chat.css` (remove the overlay CSS, add a `.session-info__body` that copies `.mcp-panel__body`, keep the list/label/value rules)
  - `apps/web/src/configs/ui.config.ts` (add a "Back to chat" label if needed, remove unused keys)

## Risks & Assumptions

- **Running work:** the previous round finished before this plan was approved, so this task starts on top of its result.
- **Assumption:** the panel needs no Refresh button. Values already refresh at each turn end and when the room opens.

## Open Questions / Blockers

- None.

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Build the `SessionInfoPanel` organism like `McpStatusPanel`, wire it into `ChatPanel`, and remove the overlay molecule, its CSS, and `toggle`. | developer | the previous round (done) | Meets the Functional Requirements. A search finds no `session-info__backdrop`, `chat-panel__body`, or `molecules/SessionInfoPanel`. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
