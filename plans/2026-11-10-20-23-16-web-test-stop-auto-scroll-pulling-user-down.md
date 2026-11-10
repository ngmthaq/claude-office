# Title: Web Test Plan — Stop chat auto-scroll from pulling the user down

- Classification: feature
- Description: Check in a real browser that auto-scroll stops when the user scrolls up, starts again at the bottom, and works the same in both panels.
- Target URL: http://127.0.0.1:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop 1440x900

---

## Goal

- Prove every acceptance item of issue #5 with real streaming output.
- Prove the two approved changes: any small scroll up stops auto-scroll, and sending a message jumps to the bottom.
- Prove the sub-agent details panel works the same way.

## Scope

- In scope: the chat panel (`MessageList`) and the sub-agent details panel (`SubagentDetails`).
- Out of scope: mobile sizes, touch input, and the office map.

## Preconditions

- I run `pnpm dev` in the background and stop it at the end.
- A new room exists, started in a new empty folder: `/Users/ngmthaq/claude-office-autoscroll-test`. The user approved this folder during the run, because the New session picker cannot reach the first folder under `/private/tmp`.
- The room's permission mode is **Auto**, so TC-07 and TC-08 do not stop on permission cards.
- The Claude login on this device works. If the app asks for a login, I stop and ask you.

## Risks & Assumptions

- Each `⚠️` step sends a real prompt to the test room and uses your Claude usage. Your approval of this plan covers the steps listed here, and I will not send any other prompts.
- The test prompts ask only for text, plus `date` and `sleep` commands in the empty folder. They change no project files.
- The test room stays in your office list after the run.
- Browser tool calls take a few seconds, so I measure streaming with a small read-only script in the page. It records `scrollTop`, `scrollHeight` and whether the button is shown.
- Wheel ticks are too large for TC-03, so that case sets `scrollTop` by script. This fires the same scroll event as a trackpad, but it is not a real trackpad.
- A streaming reply can end before a step finishes. If that happens, I send the same prompt again for that case.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: none

## Test Cases

Prompt A is: `Write a numbered list from 1 to 300. Each line is one full sentence about office plants. Do not use any tools.`

Prompt B is: `Use the Task tool to start one sub-agent. The sub-agent must run these Bash commands as 15 separate tool calls, one after the other: "date && sleep 4". Do nothing else.`

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Scroll up during streaming stops auto-scroll | high | Test room is open | 1. ⚠️ Send Prompt A. 2. Wait until the list overflows and text is streaming. 3. Scroll up 3 wheel ticks over the message list. 4. Record for 3 seconds. | Prompt A | `scrollTop` stays the same while `scrollHeight` grows. The **Scroll to bottom** button shows. |
| TC-02 | PASS | Button sits at the bottom-centre and does not change the layout | low | TC-01 state | 1. Take a screenshot. 2. Compare the button position with the list. | none | The button floats near the bottom-centre of the list, above the messages. The list width and height are the same as before. |
| TC-03 | PASS | A small scroll up stops auto-scroll | high | Text is streaming and view is at the bottom | 1. ⚠️ Send Prompt A if no reply is streaming. 2. Click the button if it shows. 3. Lower `scrollTop` by 10px by script. 4. Record for 3 seconds. | Prompt A | The view does not return to the bottom. The button shows. |
| TC-04 | PASS | Scrolling back to the bottom turns auto-scroll on | high | Text is streaming and button shows | 1. Scroll down with the wheel until the bottom. 2. Record for 3 seconds. | none | The button is gone. The view stays at the bottom as `scrollHeight` grows. |
| TC-05 | PASS | The button jumps to the bottom and turns auto-scroll on | high | Text is streaming | 1. ⚠️ Send Prompt A if no reply is streaming. 2. Scroll up 3 wheel ticks. 3. Click **Scroll to bottom**. 4. Record for 3 seconds. | Prompt A | The view is at the bottom at once. The button is gone. The view keeps following new text. |
| TC-06 | PASS | Sending a message while scrolled up jumps to the bottom | high | The reply has ended and list overflows | 1. Scroll up 5 wheel ticks. 2. Check that the button shows. 3. ⚠️ Type `Say hello in one word.` and send it. 4. Read the scroll values. | `Say hello in one word.` | The new user message is visible at the bottom. The button is gone. |
| TC-07 | PASS | Opening a room starts at the bottom | high | The list overflows | 1. Scroll up 5 wheel ticks. 2. Click **Back**. 3. Open the test room again. 4. Read the scroll values. | none | The view is at the bottom. The button is not shown. |
| TC-08 | PASS | Sub-agent panel: scroll up stops auto-scroll | high | Test room is open | 1. ⚠️ Send Prompt B. 2. Click the sub-agent card to open details. 3. Wait until the body overflows. 4. Scroll up 3 wheel ticks. 5. Record until 2 more tool calls arrive. | Prompt B | `scrollTop` stays the same while `scrollHeight` grows. The button shows. |
| TC-09 | PASS | Sub-agent panel: the button jumps and turns auto-scroll on | high | TC-08 state, sub-agent still working | 1. Click **Scroll to bottom**. 2. Record until 1 more tool call arrives. | none | The view is at the bottom. The button is gone. The view follows the new tool call. |
| TC-10 | PASS | Sub-agent panel: scrolling back to the bottom turns auto-scroll on | high | Sub-agent still working | 1. Scroll up 3 wheel ticks. 2. Scroll down with the wheel until the bottom. 3. Record until 1 more tool call arrives. | none | The button is gone after step 2. The view follows the new tool call. |
