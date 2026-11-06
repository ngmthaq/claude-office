# Title: Web Test Report — Sub-agent details in the MCP panel style

- Classification: feature
- Description: All 6 test cases passed. The sub-agent details show one header like the MCP panel, scroll correctly, and close on Back and on a room switch.
- Target URL: http://127.0.0.1:5173 (run with `?fakeRooms=1` to get a second room)
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-11-15-19-web-test-subagent-details-panel.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 6     | 6    | 0    | 0       | 0       |

## Test Results

| ID | Title | Result | Notes |
| --- | --- | --- | --- |
| TC-01 | Details show one header | PASS | 1 `.chat-panel__header`, 1 Back button ("Back to chat"), title "party-mode-developer · onsight_sms_ecp", badge "done" on the right. |
| TC-02 | Header matches the MCP panel | PASS | Both headers: 48px tall, flex, padding 8px 16px, bottom border, Back first, bold title. |
| TC-03 | Body scrolls on its own | PASS | Body `overflow-y: auto` (838px visible, 1109px content). After scrolling up, `scrollTop` = 0 and the header stayed at top 48px. |
| TC-04 | Back returns to the chat | PASS | After Back: no details panel, title "onsight_sms_ecp", message list and chat input shown. |
| TC-05 | Switching rooms closes the details | PASS | With details open, clicking project-1 showed its chat. Clicking onsight_sms_ecp again showed its chat, not the details. |
| TC-06 | Prompt box keeps its height | PASS | Prompt box 192px tall (= max-height 12rem); its content is 1570px and scrolls inside the box. |

## Failures

- None.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors.

## Next Steps

- The user asked for more space between the Prompt box and the "Tool calls" heading. That is a separate style change for party-mode.
