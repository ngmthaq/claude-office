
# Title: Web Test Report — Read-only code viewer

- Classification: feature
- Description: 12 of 13 cases pass. The diff shows inline instead of side-by-side, and the diff editor throws an unhandled error each time it unmounts.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-07-22-16-45-web-test-read-only-code-viewer.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 13    | 12   | 1    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Open the modal from the chat header | PASS | Title "Code viewer · code-viewer-test", tree on the left, "Select a file" on the right. The first click by element ref did not open it. A second click by coordinates did. Could not tell if this was the tool or the app. |
| TC-02 | Tree shows git marks | PASS | `src` has a dot. app.ts M, new.ts A, renamed.ts R, notes.txt U, old.txt D with strike-through. big.txt, logo.png, README.md have no mark. |
| TC-03 | Modified file opens as a diff | FAIL | The diff content is right, and the toggle shows with Diff selected. But the view is inline (one column), not side-by-side. |
| TC-04 | Diff/File toggle | PASS | File shows the current app.ts. Diff brings the diff back (still inline, see TC-03). |
| TC-05 | Untracked file | PASS | Old side is empty. The new side has "untracked notes". Toggle shown. Inline view. |
| TC-06 | Deleted file | PASS | Old text shows as removed. New side is empty. No toggle. |
| TC-07 | Renamed file | PASS | Shows the HEAD content of before.ts. It is the same as the current content, which is right for a pure rename. |
| TC-08 | Unchanged file | PASS | README in File mode. No toggle. |
| TC-09 | Binary file | PASS | "Cannot preview: binary file". |
| TC-10 | File over 1 MB | PASS | "Cannot preview: file is larger than 1 MB". |
| TC-11 | Refresh reloads the tree and the open file | PASS | After Refresh, the diff shows the new line `// refreshed`. |
| TC-12 | Editor is read-only | PASS | Typing `xyz` changed nothing. Monaco showed "Cannot edit in read-only editor". |
| TC-13 | Esc closes only the modal | PASS | The first Esc closed Monaco's "Cannot edit" message (normal editor behaviour). The second Esc closed the modal. The chat panel stayed open. |

## Failures

### TC-03 — Modified file opens as a diff

- Steps: 1. Click `src/app.ts` in the tree.
- Expected: A side-by-side diff shows the old line (left) and the new line (right). The Diff/File toggle shows, with Diff selected.
- Actual: The diff shows in one column (inline). The red old line sits above the green new line. The toggle is right.
- Evidence:
  - The window is 1440x625, and the editor area is about 810 px wide.
  - Monaco's `DiffEditor` switches to inline view when the width is under `renderSideBySideInlineBreakpoint` (default 900 px), because `useInlineViewWhenSpaceIsLow` is on by default.
  - `apps/web/src/components/molecules/CodeEditorView.tsx` sets `renderSideBySide: true` but does not turn off `useInlineViewWhenSpaceIsLow`.

## Blocked / Skipped

- None.

## Console and Network Problems

- **8 unhandled exceptions** in the console, also logged by Vite as `[Unhandled error]`:
  - The message is `Error: TextModel got disposed before DiffEditorWidget model got reset`.
  - The stack goes through `@monaco-editor/react`, where `TextModel.dispose` is called from a React effect cleanup (`commitHookEffectListUnmount`).
  - It happens each time the `DiffEditor` unmounts: when you switch to another file, switch Diff to File, or close the modal.
  - No visible break came from it during the run. But it is an unhandled error on every diff close.
- No failed network requests were seen. The server log has no `code tree failed` or `code file failed` lines.

## Next Steps

- To fix the FAIL case and the console error, run `/party-mode` and give it this report file: `plans/2026-11-07-22-16-45-web-test-read-only-code-viewer-report.md`.
