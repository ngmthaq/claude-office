# Title: Web Test Plan — Agent text shows in the chat when "Show floor" is off (issue #10)

- Classification: bug
- Description: Check that the `flex-shrink: 0` fix keeps agent text replies visible with the floor off, and that the floor-on view does not change.
- Target URL: http://localhost:5173 (`pnpm dev` from this repo, started by me)
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop at the current Chrome window size

---

## Goal

- Confirm every acceptance item in issue #10 passes with the fix in `apps/web/src/styles/chat.css`.
- Confirm the root cause: if I undo the fix for this page only, assistant messages shrink again in the browser.
- Confirm the floor-on view and the sideways scrolling of wide tables still work.

## Scope

- In scope: the header floor toggle, and the chat panel message list in a long session.
- Out of scope: the PixiJS floor itself, the sub-agent details panel, mobile sizes, and the other side panels (MCP, info, code viewer).

## Preconditions

- `pnpm dev` is running and the page loads.
- An existing session has enough messages to scroll, with assistant text, a user message, cards, and a table if one exists.

## Risks & Assumptions

- The page saves the floor toggle in the browser. I put it back to its first value at the end.
- TC-07 sends one short prompt to Claude (⚠️). You allowed this. It uses a little Claude usage and adds messages to that session.
- I measure heights with read-only JavaScript (`getBoundingClientRect` compared with `scrollHeight`) and back them up with screenshots.
- TC-03 adds a temporary `<style>` tag in the open page only, and removes it right after. No file changes.
- If no session has a wide table, TC-06 uses the table from the TC-07 reply, or I mark it Blocked and say why.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Floor on: baseline | high | floor on | 1. Open the long session. 2. Measure each assistant message height against its content height. 3. Take a screenshot. | long session | All assistant text shows. Each message's height matches its content (within 1px). Items are at most 48rem wide. |
| TC-02 | PASS | Floor off: issue steps (bug repro) | high | TC-01 | 1. Click the floor toggle button in the header to hide the floor. 2. Scroll through the message list. 3. Measure every assistant message. 4. Take screenshots. | long session | Every assistant reply shows its full text. No message's height is smaller than its content. |
| TC-03 | PASS | Root cause check | medium | TC-02 | 1. Add a temporary style `.message-list > * { flex-shrink: 1 !important; }` in the page. 2. Measure assistant messages. 3. Remove the style. 4. Measure again. | none | With the style: assistant messages shrink below their content height (the bug comes back). After removing it: full height again. |
| TC-04 | PASS | Floor off: other items | high | TC-02 | 1. Measure user messages, tool cards, sub-agent cards and internal-event rows on screen. | long session | All show in full, same as with the floor on. |
| TC-05 | PASS | Toggle on and off again | high | TC-02 | 1. Click the floor toggle to show the floor. 2. Click it again to hide the floor. 3. Count the chat items and measure assistant messages. | none | The item count is the same every time. All assistant text shows. |
| TC-06 | PASS | Floor off: wide tables still scroll sideways | medium | TC-02 | 1. Find a table in an assistant message. 2. Check its parent `scrollWidth` vs `clientWidth`, and the page width. | a table | The table fills its message. A wider table scrolls inside the message. The page does not scroll sideways. |
| TC-07 | PASS | Floor off: new messages show right away | high | TC-02 | 1. With the floor off, type the test prompt in the chat input. 2. ⚠️ Click **Send**. 3. Wait for the reply. 4. Measure the new assistant messages. | prompt: "Reply with a short markdown table and two short paragraphs. Do not use any tools." | The reply text shows while it arrives and after it ends, at full height. |
| TC-08 | PASS | Floor on again: no change | low | TC-07 | 1. Click the floor toggle to show the floor. 2. Measure assistant messages. | none | All text shows. 48rem cap is back. Layout looks the same as in TC-01. |
