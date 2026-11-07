# Title: Plan — Fix code viewer first click, tree scrollbar, and move toolbar buttons

- Classification: bug (first click, scrollbar) + feature (button placement)
- Description: Make tooltips ignore clicks, keep git marks clear of the scrollbar, and move Refresh to a tree header and the Diff/File toggle to an editor bar.

---

## Approach Summary / Goal

- **Root cause 1 (first click):**
  - Closing the New session dialog gives focus back to the **New session** button. Its `IconButton` tooltip (placement `bottom`) opens on focus and stays visible.
  - That tooltip covers the chat header's **Code viewer** button, so the first click hits `DIV.tooltip-inner`. I confirmed this in the browser with an event recorder.
  - **Fix:** `.tooltip { pointer-events: none; }` in the app's base CSS. Clicks then pass through any tooltip.
- **Root cause 2 (scrollbar):**
  - `.code-viewer__tree` uses `overflow: auto`, rows are `width: 100%`, and the mark is the last item with only `0.5rem` right padding.
  - Overlay scrollbars (macOS) float over the marks, and a horizontal scrollbar can also appear.
  - **Fix:** `overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable;` and row right padding `0.875rem`.
- **Feature (placement):**
  - Remove the toggle and Refresh from the modal header.
  - Add a tree header ("Files" + Refresh icon button).
  - Add an editor bar (open file path on the left, Diff/File toggle on the right).
- **Goal:** the button opens the modal on the first click, the marks are always visible, and the controls sit next to what they control.

## Functional Requirements

1. After you create a room with **New session**, the first click on **Code viewer** opens the modal.
2. Tooltips still show on hover and on keyboard focus, but never catch clicks.
3. In a tree long enough to scroll, every git mark and folder dot is fully visible. There is no horizontal scrollbar in the tree.
4. The modal header shows only the title and the close button.
5. Above the tree there is a header with the label "Files" and a Refresh icon button. Refresh works as before.
6. Above the editor there is a bar:
   - When a file is selected: the file path on the left (cut with an ellipsis if long, full path in the `title`), and the Diff/File toggle on the right (same show/hide rules as now).
   - When no file is selected: the bar shows nothing, or a short placeholder.
7. Everything else works as before.

## Non-Functional Requirements

- Plain CSS in `styles/`, using Bootstrap variables. All visible text goes in `CODE_VIEWER_TEXT`.
- Follow the web layer rules: the dialog stays the organism that wires things up.

## Files in Scope

- Change: `apps/web/src/styles/base.css`: add `.tooltip { pointer-events: none; }`
- Change: `apps/web/src/styles/code-viewer.css`: tree overflow, gutter, and row padding; new tree header and editor bar styles
- Change: `apps/web/src/components/organisms/CodeViewerDialog.tsx`: move the toggle and Refresh, add the tree header and editor bar
- Change: `apps/web/src/configs/ui.config.ts`: add a `files` label (and a placeholder text if needed) to `CODE_VIEWER_TEXT`

## Risks & Assumptions

- **Assumption:** `pointer-events: none` on `.tooltip` is safe. No tooltip in the app has links or buttons inside; they are all plain labels from `IconButton` and `RoomActionsMenu`. The developer checks this with a search.
- **Assumption:** the "not a git repo" and "list is cut" notes and the error alert stay where they are, above the two columns.
- **Risk:** `scrollbar-gutter` does nothing for overlay scrollbars. That is why the extra right padding is also needed.
- **Regression check:** the project is Skip-Testing. After the fix, I re-check in the browser, with the same setup and cleaned up after:
  - the first click right after **New session**
  - the marks in a long tree (I will add about 40 files to the test repo so it scrolls)
  - the new layout

  I will ask you before that run.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Add `.tooltip { pointer-events: none; }` to `styles/base.css`. Search the app to confirm that no tooltip holds clickable content. | developer | none | The rule is in `base.css`. The search result is reported. A click on a spot covered by a tooltip reaches the element below (checked later in the browser by the Root Agent). | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | In `code-viewer.css`: `.code-viewer__tree` gets `overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable;`, and `.file-tree__row` gets right padding `0.875rem`. | developer | none | Marks and dots stay fully visible with classic and overlay scrollbars. No horizontal scrollbar in the tree. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | In `CodeViewerDialog.tsx`: remove the toggle and Refresh from `Modal.Header`. Add a tree header ("Files" + Refresh `IconButton`) above `FileTree`, and an editor bar (path + Diff/File toggle) above the editor. Add the CSS for both bars and the labels in `CODE_VIEWER_TEXT`. | developer | task 2 | Matches FR 4–6. Toggle rules are unchanged. Refresh works. Long paths are cut with an ellipsis and have the full path in `title`. `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm format:check` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
