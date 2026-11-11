# Title: Web Test Plan — Full-width chat when "Show floor" is off (issue #7)

- Classification: feature
- Description: Check that chat items fill the chat panel when the floor is hidden, and that the floor-on view is unchanged.
- Target URL: http://localhost:5173 (`pnpm dev` from this repo, started by me)
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop at the current Chrome window size, plus one smaller window size for the resize check

---

## Goal

- Confirm the CSS change in `apps/web/src/styles/chat.css` (rules under `.chat-drawer--full`) meets every acceptance item in issue #7.
- Confirm the floor-on view still caps chat items at 48rem.

## Scope

- In scope: the header floor toggle, the chat panel message list, and the sub-agent details panel.
- Out of scope: sending messages, starting or stopping sessions, the PixiJS floor itself, and mobile sizes.

## Preconditions

- `pnpm dev` is running and the page loads.
- An existing session has assistant text, a user message, a code block or table, a tool card, and a sub-agent card.

## Risks & Assumptions

- The floor toggle is saved in the browser. I put it back to its first value at the end.
- No action sends data to Claude or changes sessions.
- I measure widths with read-only JavaScript (`getBoundingClientRect`) and back them up with screenshots.
- If no session has a table, TC-04 checks the code block only and says so.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Floor on: no change | high | floor on | 1. Open the chosen session. 2. Measure assistant messages and cards. | chosen session | Items are at most 48rem (768px) wide, same as before. |
| TC-02 | PASS | Floor off: assistant messages fill the panel | high | TC-01 | 1. Click the floor toggle button in the header to hide the floor. 2. Measure assistant messages against `.message-list` content width. | chosen session | Assistant messages are as wide as the list content (within 1px). |
| TC-03 | PASS | Floor off: cards fill the panel | high | TC-02 | 1. Measure tool, permission/question, sub-agent, peer and system/error cards on screen. | chosen session | Every card on screen is as wide as the list content. |
| TC-04 | PASS | Floor off: code blocks and tables use the width | medium | TC-02 | 1. Scroll to a code block and a table. 2. Measure them against their parent. | chosen session | They fill their parent message or card. |
| TC-05 | PASS | Floor off: sides kept, user bubble ≤80% | high | TC-02 | 1. Find a user message. 2. Measure its position and width. | chosen session | User bubble is right-aligned and at most 80% of list width. Assistant messages start at the left. |
| TC-06 | PASS | Floor off: window resize | medium | TC-02 | 1. Resize the window smaller. 2. Measure again. 3. Restore the window size. | none | Assistant messages and cards still match the list content width. |
| TC-07 | BLOCKED | Floor off: sub-agent details panel | medium | TC-02 | 1. Click a sub-agent card. 2. Measure items in the details panel. 3. Close the panel. | chosen session | Items in the panel fill its width. No 48rem cap. |
| TC-08 | PASS | Floor on again: restored | low | TC-07 | 1. Click the floor toggle to show the floor. 2. Measure one assistant message. | none | 48rem cap is back. Floor is shown. |
