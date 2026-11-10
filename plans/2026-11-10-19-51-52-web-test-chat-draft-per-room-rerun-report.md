# Title: Web Test Report — Keep the chat draft and question answers for each room (re-run)

- Classification: bug
- Description: TC-08 and TC-09 pass after the fix in `useChatStore.replaceHistory`.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-10-19-41-46-web-test-chat-draft-per-room.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 2     | 2    | 0    | 0       | 0       |

## Test Results

| ID | Title | Result | Notes |
| --- | --- | --- | --- |
| TC-08 | Question answers come back after a switch | PASS | The card was on step 2 with **Other** on and `other answer`. Step 1 still had **Blue**. |
| TC-09 | Answered question shows its answers | PASS | After the switch, the read-only card showed `Blue` and `other answer`, and the **Allowed** badge. |

## Failures

- None.

## Blocked / Skipped

- None. The other cases were not re-run, because the fix changes only `replaceHistory`.

## Console and Network Problems

- No console errors were seen. Console tracking started during the run, after the page first loaded. Network requests were not checked.

## Next Steps

- None.
