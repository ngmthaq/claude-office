# Title: Web Test Report — Attach files to a chat message

- Classification: feature
- Description: All 16 test cases passed in a real browser, using simulated file, paste, and drop events.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-09-23-13-48-web-test-attach-files-to-chat-message.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 16    | 16   | 0    | 0       | 0       |

## Test Results

| ID | Title | Result | Notes |
| --- | --- | --- | --- |
| TC-01 | Picker adds a chip | PASS | Chip `note.txt`, 28 B. Send enabled |
| TC-02 | Remove a chip | PASS | Chip gone. Send disabled |
| TC-03 | Unsupported type | PASS | `a.zip`: "Type not supported". Send disabled |
| TC-04 | Text file too big | PASS | `big.txt`: "File too big (limit 1.0 MB)" |
| TC-05 | Too many files | PASS | 10 ready chips. `f11.txt`: "Too many files" |
| TC-06 | Big image is resized | PASS | 7.4 MB `big.png` showed the loading state, then `big.jpg` at 1.5 MB |
| TC-07 | Paste an image | PASS | Chip `shot.png`. Default paste stopped |
| TC-08 | Plain text paste is not changed | PASS | No chip. Default paste not stopped |
| TC-09 | Drag and drop | PASS | "Drop files to attach" showed during the drag and went away. Chip added |
| TC-10 | Send text with three files | PASS | Chips on the message. Draft cleared. Answer: red, PINEAPPLE-42, MANGO-17 |
| TC-11 | Send files only | PASS | Chip on the message. No text bubble |
| TC-12 | Server rejects a bad file | PASS | Chat error: "fake.png" does not match its file type. Text and chip stayed. Box unlocked |
| TC-13 | Add a file while Claude is busy | PASS | Chip added while busy. No send button until the reply ended |
| TC-14 | Text-only send | PASS | Box cleared at once. Claude replied OK |
| TC-15 | No carry-over to another room | PASS | Chip in room A. None in room B |
| TC-16 | Reload from transcript hides the file text | PASS | After a server restart, no wrapper text or file content in any bubble. Typed messages still show |

## Failures

None.

## Blocked / Skipped

None.

## Console and Network Problems

- Console: no errors found.
- Network: not checked separately. The app uses one local WebSocket.

## Run Notes

- Files were built in the page with JavaScript, not read from the scratchpad folder. A real desktop drag, real Cmd+V, and the system file dialog were not tested.
- The app allows rooms only inside the home folder, so the test rooms used `~/claude-office-test-a` and `~/claude-office-test-b`, not scratchpad folders.
- After the server restart, room B (which never received a message) was no longer in the room list.
- One click during TC-16 opened an existing room by mistake because the room order changed. It was only read. No message was sent there.

## Next Steps

- none
