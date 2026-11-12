# Title: Web Test Report — Agent text shows in the chat when "Show floor" is off (issue #10)

- Classification: bug
- Description: All 8 test cases pass. Agent text replies show at full height with the floor off, and the root cause is confirmed.
- Target URL: http://127.0.0.1:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-12-19-56-32-web-test-show-assistant-text-when-floor-off.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 8     | 8    | 0    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Floor on: baseline | PASS | Session "Parallel file listing in game and events": 24 items, 6 assistant messages. The list scrolls (5254px content in 381px). No message is cut. Widest assistant message is 545px (under 768px). |
| TC-02 | Floor off: issue steps (bug repro) | PASS | Drawer has `chat-drawer--full`. List scrolled top to bottom. All 6 assistant messages have height = content height (144, 696, 752, 168, 384, 232px). Screenshot taken. |
| TC-03 | Root cause check | PASS | With a temporary `flex-shrink: 1 !important` style, all 6 assistant messages shrank to 0px. No other item shrank. After removing the style, all were back to full height. |
| TC-04 | Floor off: other items | PASS | User messages, tool cards, internal-event rows and peer cards: none is shorter than its content. |
| TC-05 | Toggle on and off again | PASS | Floor on: 24 items, 0 cut. Floor off again: 24 items, 6 assistant messages, 0 cut. |
| TC-06 | Floor off: wide tables still scroll sideways | PASS | Table from the TC-07 reply fills its message (1168px = 1168px). With a temporary 2500px table width, the message scrolls sideways (scrollWidth 2500 vs 1168), keeps full height, and the page does not scroll sideways. Temporary width removed. |
| TC-07 | Floor off: new messages show right away | PASS | Sent the approved prompt. The reply arrived in about 3 seconds and was at full height in every 1-second sample and after the turn ended (295px = content). |
| TC-08 | Floor on again: no change | PASS | Floor canvas is back, 48rem cap is back (widest assistant message 545px), 0 cut. The saved toggle value is `true`, the same as at the start. |

## Failures

- None.

## Blocked / Skipped

- None.

## Console and Network Problems

- None. No console errors were seen.

## Next Steps

- None.
