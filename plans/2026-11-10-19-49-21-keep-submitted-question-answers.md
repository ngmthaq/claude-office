# Title: Plan — Keep submitted question answers after a room switch

- Classification: bug
- Description: Make `replaceHistory` keep the submitted answers that the web store already holds.

---

## Approach Summary / Goal

- **Root cause:** the server never stores submitted answers, so its room history has none. `markPermissionSending` saves them only on the chat item in the web store. Each room open makes `replaceHistory` build the chat items again from that history, which drops the answers.
- **Fix:** when `replaceHistory` builds the new items, it copies `answers` from the old permission item with the same ID.
- I chose this because you asked to keep answers in the store only. A server fix would need event and history changes that you do not need.
- **Goal:** an answered question card shows its answers after a room switch.

## Functional Requirements

- After the user submits a question card and switches rooms and back, the card shows each submitted answer.
- A skipped card still shows **Skipped**, with no answers.
- A page reload still clears the answers, as it does today.

## Non-Functional Requirements

- Only the web store changes. There are no server or shared package changes.
- The code follows `CODING_CONVENTIONS.md`.

## Files in Scope

- Change `apps/web/src/hooks/store/useChatStore.ts`

## Risks & Assumptions

- **Callers:** only the `session_history` route in `ws-client.service.ts` calls `replaceHistory`. Live events do not use it, so they do not change.
- **Reload:** after a reload, an answered card still has no answers to show. This matches your "no need to keep after refresh".
- **Regression test:** the party-mode rules ask for an automated test on each bug fix, but this project uses Skip-Testing and has no test setup. I will use a browser re-run of TC-09 as the regression check, if you allow it below.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `useChatStore.replaceHistory`, copy `answers` from the room's current permission items to the rebuilt items with the same ID. | developer | none | After `replaceHistory`, a permission item that had `answers` still has them. Other items are the same as what the events build. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
