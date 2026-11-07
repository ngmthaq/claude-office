# Title: Plan: close other panels when sub-agent details open

- Classification: bug
- Description: When sub-agent details open, close the Session info and MCP panels so the details show at once.

---

## Approach Summary / Goal

- **Root cause:** `ChatPanel` picks one view, checking MCP, then Session info, then sub-agent details. Clicking a sub-agent character (`game/subagent-sprite.ts:74`) sets `openSubagent`, but nothing closes the panels checked before it. So the details stay hidden.
- **Fix:** add a `useEffect` in `ChatPanel.tsx`. When `openSubagent` becomes non-null, it calls `closeInfo()` and `closeMcp()`.
  - The rule lives in the organism that already connects these stores. It matches the existing "close on room change" effects.
  - No store imports another store.
- **Goal:** clicking a sub-agent character always shows its details at once.

## Functional Requirements

- **From Session info:** Session info is open, and you click a sub-agent character. Its details show at once. Back from the details returns to the chat, not to Session info.
- **From MCP:** the same holds when the MCP panel is open.
- **No change elsewhere:** opening details from a sub-agent card in the chat works as before. Switching rooms works as before. Esc and the Back buttons work as before.

## Files in Scope

- Modify `apps/web/src/components/organisms/ChatPanel.tsx`

## Risks & Assumptions

- **Flash:** for one render frame, the old panel shows before the effect closes it. This is not visible in practice.
- **Tests:** the testing workflow is `Skip-Testing`, so there is no regression test. Normally a bug fix needs one, but this project skips tests.

## Open Questions / Blockers

- None.

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `ChatPanel.tsx`, add a `useEffect` on `openSubagent`. When it is non-null, call `closeInfo()` and `closeMcp()`. | developer | none | Clicking a sub-agent character while Session info or MCP is open shows its details at once. Back goes to the chat. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
