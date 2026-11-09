# Title: Web Test Plan — Attach files to a chat message

- Classification: feature
- Description: Check that files can be added, sent to Claude, shown on messages, and rejected correctly, and that text chat still works.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop, the current browser window size

---

## Goal

- Prove the UI works in a real browser. So far it has only been checked by reading the code.
- Prove Claude can read an attached image, PDF, and text file through the real app.
- Prove rejected files keep the user's draft, and that normal text chat still works.

## Scope

- In scope: the chat panel, chips, send, chips on messages, rejection, the busy state, room change, and reload from the transcript.
- Out of scope: mobile size, Word or Excel clipboard content, thumbnails, and history of attachments.

## Preconditions

- I start the app with `pnpm dev`.
- I create test files in the scratchpad folder, outside the repo.
- I create two test rooms in empty scratchpad folders.

## Risks & Assumptions

- **Simulated input:** I add files by sending browser file, paste, and drop events to the page with JavaScript, because the tool cannot control the system file dialog or desktop drag. The app's real handlers run, but a real desktop drag or Cmd+V is not tested. You may want to try one of each yourself.
- **Usage:** TC-10, TC-11, TC-13, TC-14, and TC-16 send real messages to Claude and use a small amount of usage.
- **Data:** the two test rooms stay in the app's room list after the run. You can remove them yourself.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: none

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Picker adds a chip | high | Room A open | 1. Add one file to the file input | `note.txt` | Chip shows the name and size, and send is enabled |
| TC-02 | PASS | Remove a chip | high | TC-01 | 1. Click × on the chip | none | Chip is gone, and send is disabled |
| TC-03 | PASS | Unsupported type | high | Room A open | 1. Add the file | `a.zip` | Chip shows "Type not supported", and send stays disabled |
| TC-04 | PASS | Text file too big | high | Room A open | 1. Add the file | 2 MB `big.txt` | Chip shows "File too big (limit 1.0 MB)" |
| TC-05 | PASS | Too many files | medium | Room A open | 1. Add 11 files at once | 11 small `.txt` files | 10 chips are ready, and 1 shows "Too many files" |
| TC-06 | PASS | Big image is resized | high | Room A open | 1. Add the image 2. Wait for it to finish | 6 MB `big.png` | Chip is ready, the name is `big.jpg`, and the size is under 3.75 MB |
| TC-07 | PASS | Paste an image | high | Room A open | 1. Paste an image file into the text box | `shot.png` | A chip appears |
| TC-08 | PASS | Plain text paste is not changed | high | Room A open | 1. Paste plain text into the text box | "hello" | No chip appears, and the default paste is not stopped |
| TC-09 | PASS | Drag and drop | high | Room A open | 1. Drag a file over the panel 2. Drop it | `note.txt` | "Drop files to attach" shows during the drag and goes away. A chip appears |
| TC-10 | PASS | ⚠️ Send text with three files | high | Room A, no chips | 1. Add the files 2. Type the question 3. Press Enter 4. Wait for the answer | Red PNG, PDF with `PINEAPPLE-42`, `note.txt` with `MANGO-17`. Question: "What colour, PDF word, and file word?" | Chips show on the sent message, the draft clears, and the answer has red, `PINEAPPLE-42`, and `MANGO-17` |
| TC-11 | PASS | ⚠️ Send files only | high | Room A, not busy | 1. Add `note.txt` 2. Click send | `note.txt` | Chip shows on the message, with no empty text bubble |
| TC-12 | PASS | ⚠️ Server rejects a bad file | high | Room A, not busy | 1. Add the fake PNG 2. Type "keep me" 3. Click send | Text content named `fake.png`, type `image/png` | Error "does not match its file type" shows in chat. Text and chip stay, and the box is unlocked |
| TC-13 | PASS | ⚠️ Add a file while Claude is busy | medium | Room A | 1. Send "Count from 1 to 30" 2. Add `note.txt` during the reply | `note.txt` | Chip appears, and no send is possible until the reply ends |
| TC-14 | PASS | ⚠️ Text-only send | high | Room A, not busy | 1. Type "Say OK" 2. Press Enter | "Say OK" | Box clears at once, the message shows, and Claude replies |
| TC-15 | PASS | No carry-over to another room | high | Rooms A and B | 1. Add a chip in A 2. Open room B | `note.txt` | Room B shows no chip |
| TC-16 | PASS | ⚠️ Reload from transcript hides the file text | high | TC-10 done | 1. Restart the server 2. Open room A again | none | No bubble shows the `<attached-file` text or `MANGO-17` from the file. The typed question still shows |
