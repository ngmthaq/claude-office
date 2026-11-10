# Title: Web Test Plan — Keep the chat draft and question answers for each room

- Classification: feature
- Description: This run checks that text, files, and question answers stay with their room, and are cleared at the right times.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only, at the current browser window size

---

## Goal

- Prove that each room keeps its own unsent text, files, and half-finished question answers during a room switch.
- Prove that this data is cleared after a send, after a reload, and when the room is archived.

## Scope

- In scope: the chat box, attachments, and question card in the office page, for the changes in `plans/2026-11-10-19-36-11-chat-draft-per-room.md`.
- Out of scope: a message that the server rejects (it is hard to cause on purpose, so I checked this path by reading the code), mobile sizes, and other browsers.

## Preconditions

- The agent starts `pnpm dev` and stops it at the end.
- Two new rooms, called Room A and Room B below, are open in this repo folder.

## Risks & Assumptions

- The app uses your normal data folder, so the test rooms are real rooms.
- The two test rooms are archived at the end. They stay in the archive list, and your other rooms are not touched.
- Short messages to Claude use a few tokens.
- The test attaches a small file by script, because the browser tool cannot use the system file picker. The file is not private.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: none

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Text stays after a room switch | high | Room A open | 1. Type in Room A. 2. Open Room B. 3. Open Room A. | `draft for A` | Room A's chat box shows `draft for A`. |
| TC-02 | PASS | Each room shows only its own text | high | TC-01 | 1. Open Room B. 2. Check the box. 3. Type in Room B. 4. Open Room A. 5. Open Room B. | `draft for B` | Room B starts empty. Room A shows `draft for A`. Room B shows `draft for B`. |
| TC-03 | PASS | Files stay with their room | high | Room A open | 1. Attach a file in Room A. 2. Open Room B. 3. Open Room A. | `test-note.txt` | The file chip shows only in Room A, and it comes back in Room A. |
| TC-04 | PASS | Clearing by hand stays cleared | high | TC-02 | 1. In Room B, delete all text. 2. Open Room A. 3. Open Room B. | none | Room B's box is empty. |
| TC-05 | PASS | Autocomplete works with a saved draft | low | Room B open | 1. Type `/`. 2. Open Room A. 3. Open Room B. 4. Type `c`. 5. Delete the text. | `/c` | The command popup shows in Room B after the switch. |
| TC-06 | PASS | Send clears text and files | high | TC-03 | 1. In Room A, press **Send message** ⚠️ (sends to Claude). 2. Wait for the reply. | `draft for A` and `test-note.txt` | The message shows in the chat. The box and file chips are empty. |
| TC-07 | PASS | Send clears the draft when the user is in another room | high | Room B idle | 1. In Room B, type text. 2. Press Enter ⚠️ (sends to Claude). 3. Open Room A at once. 4. Open Room B. | `reply with one word` | Room B's box is empty, and the old text does not come back. |
| TC-08 | PASS | Question answers come back after a switch | high | Room A idle | 1. In Room A, ask Claude to ask two sample questions ⚠️. 2. Pick an answer for question 1. 3. Press **Next**. 4. Choose **Other** and type text. 5. Open Room B. 6. Open Room A. | `other answer` | The card is on step 2, with **Other** on and `other answer` in the field. Step 1 still has its answer. |
| TC-09 | PASS | Answered question shows its answers | medium | TC-08 | 1. Press **Submit** ⚠️ (sends to Claude). 2. Open Room B. 3. Open Room A. | none | The card is read-only and shows the submitted answers. |
| TC-10 | PASS | Reload clears drafts | high | Room A open | 1. Type in Room A. 2. Reload the page. 3. Open Room A. | `reload draft` | Room A's box is empty. |
| TC-11 | PASS | Archive removes the draft | high | Room B open | 1. Type in Room B. 2. Archive Room B ⚠️. 3. Restore Room B from the archive list. 4. Open Room B. | `archive draft` | Room B's box is empty after the restore. |
| TC-12 | PASS | Clean up the test rooms | low | All cases done | 1. Archive Room A ⚠️. 2. Archive Room B ⚠️. | none | The room list no longer shows the test rooms. |
