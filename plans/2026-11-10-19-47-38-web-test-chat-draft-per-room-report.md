# Title: Web Test Report — Keep the chat draft and question answers for each room

- Classification: feature
- Description: 11 of 12 test cases passed. One failed: an answered question card does not show its answers after a room switch.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-10-19-41-46-web-test-chat-draft-per-room.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 12    | 11   | 1    | 0       | 0       |

## Test Results

| ID | Title | Result | Notes |
| --- | --- | --- | --- |
| TC-01 | Text stays after a room switch | PASS | Room A showed `draft for A` after the switch. |
| TC-02 | Each room shows only its own text | PASS | Room B started empty. Each room then showed only its own text. |
| TC-03 | Files stay with their room | PASS | `test-note.txt` showed only in Room A and came back after the switch. |
| TC-04 | Clearing by hand stays cleared | PASS | Room B stayed empty after the switch. |
| TC-05 | Autocomplete works with a saved draft | PASS | The popup opened after the switch. It said "No matches" for `/c`, which is correct: no listed command starts with `c`. `/` listed 6 commands. |
| TC-06 | Send clears text and files | PASS | The message and file showed in the chat. The box and chips were empty. |
| TC-07 | Send clears the draft when the user is in another room | PASS | Room B's box was empty after the switch, and the message was in the chat. |
| TC-08 | Question answers come back after a switch | PASS | The card was on step 2 with **Other** on and `other answer`. Step 1 still had **Blue**. |
| TC-09 | Answered question shows its answers | FAIL | The card is read-only, but the answers are not shown after the room switch. |
| TC-10 | Reload clears drafts | PASS | Room A's box was empty after the reload. |
| TC-11 | Archive removes the draft | PASS | Room B's box was empty after the restore. |
| TC-12 | Clean up the test rooms | PASS | The room list no longer shows the test rooms. |

## Failures

### TC-09 — Answered question shows its answers

- Steps: Pressed **Submit** on the card, opened Room B, opened Room A.
- Expected: The card is read-only and shows the submitted answers.
- Actual: The card showed the two questions and the **Allowed** badge, but not `Blue` or `other answer`.
- Evidence: Page text was "Claude has questions for you / Color / What is your favorite color? / Fruit / What is your favorite fruit? / Allowed". Claude's reply in the same room confirmed it got Blue and "other answer".
- Likely cause (from reading the code, not from a run of the old code): the submitted answers are kept only on the chat item in `useChatStore`, set by `markPermissionSending`. Each room open sends `session_open`, and the `session_history` reply makes `replaceHistory` rebuild the items without the answers.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors were seen. Console tracking started during the run, after the page first loaded. Network requests were not checked.

## Next Steps

- To fix the FAIL case, run `/party-mode` and give it this report file: plans/2026-11-10-19-47-38-web-test-chat-draft-per-room-report.md.
