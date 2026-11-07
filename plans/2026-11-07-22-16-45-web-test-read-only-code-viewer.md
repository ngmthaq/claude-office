# Title: Web Test Plan — Read-only code viewer

- Classification: feature
- Description: Check that the Code viewer modal shows the file tree with git marks, diffs, and file views correctly, and that it is read-only.
- Target URL: http://localhost:5173 (`pnpm dev` from this repo)
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current Chrome window size)

---

## Goal

- Prove that FR 1–10 and 12 of `plans/2026-11-07-22-05-56-read-only-code-viewer.md` work in a real browser.
- Prove that Esc closes only the modal, and that the editor cannot be edited.

## Scope

- In scope: the chat header button, the modal, the tree, git marks, Diff/File modes, the unavailable messages, Refresh, Esc, and read-only.
- Out of scope:
  - Auto-refresh after a Claude turn (FR 11). It needs a chat prompt, which costs Claude usage.
  - Mobile sizes.
  - The 5000-entry "list is cut" note.
  - A non-git folder.

## Preconditions

- You stop the server on port 4317. I run `pnpm dev` in the background.
- I create a test repo at `~/code-viewer-test` with these files:

| File | State | Expected mark |
| --- | --- | --- |
| `README.md` | committed, unchanged | none |
| `src/app.ts` | committed, then changed | **M** |
| `src/new.ts` | new, staged | **A** |
| `notes.txt` | new, not tracked | **U** |
| `old.txt` | committed, then deleted with `rm` | **D** |
| `src/before.ts` → `src/renamed.ts` | `git mv` | **R** |
| `logo.png` | committed binary | none |
| `big.txt` | committed, about 1.5 MB | none |

- I create one room with **New session** on `~/code-viewer-test`. I send no chat message.

## Risks & Assumptions

- **Assumption:** opening a new session with no prompt costs no Claude usage.
- **Changes on disk:** TC-11 changes `src/app.ts` in the test repo. This is safe, because the repo is only for testing.
- **Clean-up:** at the end, I remove the test room from the app and delete `~/code-viewer-test`. I ask you before I do either.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: —

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Open the modal from the chat header | high | Test room is selected | 1. Click the **Code viewer** icon button (file-with-code icon) in the chat header. | none | A large modal opens. Its title is "Code viewer · {room name}". The tree is on the left, and "Select a file" is on the right. |
| TC-02 | PASS | Tree shows git marks | high | TC-01 | 1. Open the `src` folder in the tree. 2. Look at all rows. | test repo | `src` has a dot. `app.ts` shows M, `new.ts` shows A, `renamed.ts` shows R, `notes.txt` shows U, and `old.txt` shows D with a strike-through. `README.md`, `logo.png` and `big.txt` have no mark. |
| TC-03 | FAIL | Modified file opens as a diff | high | TC-02 | 1. Click `src/app.ts`. | none | A side-by-side diff shows the old line (left) and the new line (right). The Diff/File toggle is shown, with Diff selected. |
| TC-04 | PASS | Diff/File toggle | high | TC-03 | 1. Click **File**. 2. Click **Diff**. | none | After step 1, one editor shows the current `app.ts`. After step 2, the side-by-side diff shows again. |
| TC-05 | PASS | Untracked file | medium | TC-01 | 1. Click `notes.txt`. | none | Diff mode. The left side is empty, and the right side shows the file text. The toggle is shown. |
| TC-06 | PASS | Deleted file | medium | TC-01 | 1. Click `old.txt`. | none | Diff mode. The left side shows the old text, and the right side is empty. No toggle. |
| TC-07 | PASS | Renamed file | medium | TC-02 | 1. Click `src/renamed.ts`. | none | Diff mode. The left side shows the content of `before.ts` from HEAD, and the right side shows the current content. |
| TC-08 | PASS | Unchanged file | medium | TC-01 | 1. Click `README.md`. | none | File mode with the README text. No toggle. |
| TC-09 | PASS | Binary file | medium | TC-01 | 1. Click `logo.png`. | none | The message "Cannot preview" (binary file) shows. No editor. |
| TC-10 | PASS | File over 1 MB | medium | TC-01 | 1. Click `big.txt`. | none | The message "Cannot preview" (larger than 1 MB) shows. No editor. |
| TC-11 | PASS | Refresh reloads the tree and the open file | high | TC-03 | 1. Open `src/app.ts`. 2. I add a line to `src/app.ts` in the terminal. 3. Click the **Refresh** button. | new line `// refreshed` | The diff now shows the new line `// refreshed`. |
| TC-12 | PASS | Editor is read-only | high | TC-08 | 1. Click inside the README editor. 2. Type `xyz`. | `xyz` | The text does not change. |
| TC-13 | PASS | Esc closes only the modal | high | Modal open | 1. Press **Esc**. | none | The modal closes. The chat panel for the test room is still open. |
