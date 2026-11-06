# Title: Plan — Sub-agent details use the MCP panel style

- Classification: feature
- Description: Show the sub-agent details as a full panel with one header, the same way the MCP panel works.

## Approach Summary / Goal

- `ChatPanel` returns `<SubagentDetails ...>` early when details are open, the same way it returns `McpStatusPanel` now. The room header no longer shows above it.
- `SubagentDetails` renders `<main className="chat-panel">` with a `chat-panel__header`: Back ("Back to chat"), the title "<agent type> · <room name>", and the status badge on the right.
- The body (Task, Prompt, Tool calls, Result) goes in a scrolling body div, styled like `mcp-panel__body`.

## Functional Requirements

- Only one header row, with one Back button. Back returns to the chat.
- The title shows the agent type and the room name. The status badge (working / done / error / stopped) is on the right of the header.
- The body scrolls on its own, and it still scrolls to the end when new tool calls arrive.
- Switching rooms still closes the details, as it does now.

## Files in Scope

- `apps/web/src/features/subagents/SubagentDetails.tsx`
- `apps/web/src/features/chat/ChatPanel.tsx`
- `apps/web/src/styles.css`

## Risks & Assumptions

- If both are open, MCP wins, because it is checked first. That is the same order as now.
- No tests (`Skip-Testing`).

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | `SubagentDetails` becomes a full `chat-panel` with a `chat-panel__header` (Back, "<agentType> · <roomName>", badge on the right) and a scrolling body. Add a `roomName` prop. `ChatPanel` returns it early when details are open. Update the CSS | developer | none | The details show one header that looks like the MCP panel. Back works. The body scrolls and follows new tool calls. `pnpm typecheck` and `pnpm lint` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
