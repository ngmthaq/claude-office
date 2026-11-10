# Title: Plan — Bigger code viewer modal with a fixed-width sidebar

- Classification: feature
- Description: Change the code viewer's CSS and modal props, so the sidebar stays at 280 px and the modal follows the window size.

---

## Approach Summary / Goal

- The modal gets its own CSS class. This class sets the size from the window, with a 16 px margin on each side.
- The code area stops using the fixed `75vh` height and fills the modal instead.
- The sidebar gets `min-width: 0`, so long names cannot push it wider than 280 px.
- Goal: the sidebar does not move, and the user has more room to read code.

## Functional Requirements

- The sidebar stays 280 px wide when the user opens folders, picks files, or views long lines.
- Long file and folder names are cut with "…".
- Hovering a file or folder row shows its full path.
- From 992 px wide, the modal fills the window with a 16 px margin on each side.
- Below 992 px wide, the modal is full screen with no margin, as it is today.
- The modal resizes with the browser window.
- Long code lines scroll inside the code area.

## Non-Functional Requirements

- The change follows the existing plain CSS and `react-bootstrap` patterns.
- The change adds no new library.
- The change has no effect on other modals, because the new CSS is scoped to the code viewer.
- The modal itself must not show a page scrollbar.

## Files in Scope

- `apps/web/src/components/organisms/CodeViewerDialog.tsx` (change)
- `apps/web/src/components/molecules/FileTree.tsx` (change)
- `apps/web/src/styles/code-viewer.css` (change)

## Risks & Assumptions

- Assumption: the missing `min-width: 0` is why the sidebar width changes. I found this by reading the code, and have not seen it in a browser.
- Assumption: folder hover text shows the full path, the same as file rows do today.
- Behaviour change: below 992 px, the code area also fills the modal, instead of staying at `75vh`.
- Risk: the error and notice lines above the code area take some height. The code area must shrink to make room for them.
- The project uses Skip-Testing, so this plan has no tester task.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `CodeViewerDialog.tsx`, replace `size="xl"` with `dialogClassName="code-viewer-dialog"`. Keep `fullscreen="lg-down"`. In `code-viewer.css`, add the `.code-viewer-dialog` rules for 992 px and up. Make the modal content and body fill the height. Replace `height: 75vh` on `.code-viewer__body` so it fills the modal. | developer | none | From 992 px, the modal has a 16 px margin on each side and resizes with the window. Below 992 px, it is full screen. The modal has no page scrollbar, including when a notice line shows. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | In `code-viewer.css`, add `min-width: 0` to `.code-viewer__side`. In `FileTree.tsx`, add `title={node.path}` to the folder row button. | developer | none | The sidebar is 280 px with long names, deep folders, and long code lines. Long names show "…". Folder and file rows show the full path on hover. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
