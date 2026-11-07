# Title: Plan — Fix code viewer diff layout and diff editor unmount error

- Classification: bug
- Description: Make the diff always side-by-side, and stop the unhandled "TextModel got disposed" error by managing the diff models ourselves.

---

## Approach Summary / Goal

- **Root cause 1:** Monaco's `DiffEditor` turns on `useInlineViewWhenSpaceIsLow` by default. Under 900 px it shows one column. Our editor area is about 810 px. **Fix:** set `useInlineViewWhenSpaceIsLow: false`.
- **Root cause 2:** on unmount, `@monaco-editor/react` disposes the original and modified models before the diff widget lets go of them. Monaco 0.57 throws `TextModel got disposed before DiffEditorWidget model got reset`. **Fix:**
  - Pass `keepCurrentOriginalModel` and `keepCurrentModifiedModel`, so the library does not dispose the models.
  - Keep the editor from `onMount`. In our own unmount cleanup, call `editor.setModel(null)` first, then dispose both models. This avoids both the error and a model leak.
- **Goal:** two-column diff at every width, and no console errors when you switch files, switch modes, or close the modal.

## Functional Requirements

1. Diff mode always shows two columns (old left, new right), at any modal width.
2. Switching between files, switching Diff ↔ File, Refresh, and closing the modal cause no `TextModel got disposed…` error (or any other error) in the console.
3. Diff models are disposed when the diff editor unmounts, so they do not pile up.
4. Everything else works as before: read-only, toggle rules, unavailable messages, Refresh.

## Non-Functional Requirements

- Small change, in one file only.
- Follow `.claude/references/CODING_CONVENTIONS.md`. `CodeEditorView` stays a pure molecule (React hooks for local refs are allowed).

## Files in Scope

- Change: `apps/web/src/components/molecules/CodeEditorView.tsx`

## Risks & Assumptions

- **Callers:** only `CodeViewerDialog.tsx` uses `CodeEditorView`, through `React.lazy`. The props do not change.
- **Edge case:** on refresh of the same file, the `DiffEditor` stays mounted and gets new `original` / `modified` values. The models must update, not be disposed. Only unmount disposes them.
- **Risk:** React runs the parent's unmount cleanup before the library child's cleanup. The developer must check this order in the browser console: no error, and no leak, with `monaco.editor.getModels().length` staying flat after many switches.
- **Regression test:** the project is **Skip-Testing**, with no test framework set up, so there is no tester task. To check the fix, I re-run **TC-03** and do a console check in the browser (`/web-test`) after the fix. I will ask you before that run.
- **Out of scope:** the TC-01 first-click note.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `CodeEditorView.tsx`: add `useInlineViewWhenSpaceIsLow: false` to the `DiffEditor` options. Add `keepCurrentOriginalModel` and `keepCurrentModifiedModel`. Keep the editor from `onMount` in a ref. In an unmount cleanup, call `setModel(null)`, then dispose the original and modified models. | developer | none | Diff shows two columns at 810 px editor width. No console errors when switching files, switching modes, or closing the modal (checked in `pnpm dev`). Model count does not grow after repeated switches. `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm format:check` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
