# Title: Web Test Report — Stop chat auto-scroll from pulling the user down

- Classification: feature
- Description: All 10 test cases passed with real streaming output in both panels.
- Target URL: http://127.0.0.1:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-10-20-23-16-web-test-stop-auto-scroll-pulling-user-down.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 10    | 10   | 0    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Scroll up during streaming stops auto-scroll | PASS | `scrollTop` stayed at 1069 while `scrollHeight` grew from 1798 to 2062. The button showed. |
| TC-02 | Button sits at the bottom-centre and does not change the layout | PASS | Button centre x is 1151.5, the same as the list centre. The list height stayed 381. |
| TC-03 | A small scroll up stops auto-scroll | PASS | After a 10px scroll up, `scrollTop` stayed at 2631 while `scrollHeight` grew from 3022 to 3286. The button showed. |
| TC-04 | Scrolling back to the bottom turns auto-scroll on | PASS | Distance from the bottom stayed 0 while `scrollHeight` grew from 3334 to 3574. The button was gone. |
| TC-05 | The button jumps to the bottom and turns auto-scroll on | PASS | Distance went from 324 to 0 after the click, and stayed 0 while `scrollHeight` grew to 3910. |
| TC-06 | Sending a message while scrolled up jumps to the bottom | PASS | Distance went from 500 to 0. The new user message was visible, and the button was gone. |
| TC-07 | Opening a room starts at the bottom | PASS | Left the room at distance 500. On reopening, the distance was 0 and the button was not shown. |
| TC-08 | Sub-agent panel: scroll up stops auto-scroll | PASS | `scrollTop` stayed at 0 while `scrollHeight` grew from 786 to 1010 (4 more tool calls). The button showed. |
| TC-09 | Sub-agent panel: the button jumps and turns auto-scroll on | PASS | The view went to the bottom, the button was gone, and the view followed one more tool call. |
| TC-10 | Sub-agent panel: scrolling back to the bottom turns auto-scroll on | PASS | The button showed after the scroll up and was gone after the scroll down. The view followed one more tool call. |

## Failures

None.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors were found, but console tracking started only at the end of the run. Errors from earlier in the run may not be included.
- Network requests were not checked.

## Run Notes

- The real viewport was 1440x625, not the planned 1440x900.
- TC-03 used a script to scroll 10px, as the plan says. A real trackpad was not used.
- The test room is `Office plants numbered list`, in `/Users/ngmthaq/claude-office-autoscroll-test`. It stays in the office list.

## Next Steps

- None.
