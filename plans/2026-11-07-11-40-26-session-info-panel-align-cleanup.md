# Title: Plan — Session info panel: center rows, remove copy and progress bar

- Classification: feature
- Description: Center each label next to its value from top to bottom (vertically). Remove the copy-path button and the context progress bar.

---

## Approach Summary / Goal

- **Alignment:** in `chat.css`, add `align-items: center` to the `.session-info__list` grid. Each label then sits at the middle height of its value, even when the value wraps.
- **Removals:** in `SessionInfoPanel.tsx`:
  - Remove the copy `IconButton`, the `copied` state, the timer ref and its clean-up, `copyFolder`, and `COPIED_MS`.
  - Remove the `ProgressBar` import and element. The Context row keeps only its text.
- **Clean-up:** remove the unused `copy` / `copied` keys from `SESSION_INFO_TEXT` and the `.session-info__progress` CSS rule.

## Functional Requirements

- Every label is vertically centered next to its value. Both columns stay left-aligned.
- The working dir row shows only the full path. It has no button.
- The Context row shows only `34% · 68k / 200k` (or `—`). It has no bar.
- Everything else works the same as before: the panel opens and closes the same way, and focus still goes to ✕ on open.

## Files in Scope

- Modify `apps/web/src/components/molecules/SessionInfoPanel.tsx`
- Modify `apps/web/src/styles/chat.css`
- Modify `apps/web/src/configs/ui.config.ts`

## Risks & Assumptions

- None. The focus code picks the first `button` in the card, and that is still the ✕ button.

## Open Questions / Blockers

- None.

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Add the vertical centering, remove the copy button and the progress bar, and clean up the unused config keys and CSS. | developer | none | Rows are vertically centered. A search finds no `ProgressBar`, `clipboard`, `copied`, or `session-info__progress` in the web app. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
