# Title: Plan — Stack Send, Stop, and mode buttons in one column

- Classification: bug
- Description: When Send and Stop both show, stack them in one column above the mode button, instead of side by side.

---

## Approach Summary / Goal

- Root cause: `.chat-input-buttons` (`apps/web/src/styles/chat-input.css:31`) is a horizontal flex row. When background sub-agents run while the main agent is idle, Send and Stop both render (this is intended), and they end up side by side with the mode button alone under Stop.
- Fix: set `.chat-input-buttons` to `flex-direction: column` with the same gap as `.chat-input-actions` (`0.25rem`). The order becomes Send, Stop, mode. When only one of Send or Stop shows, the layout looks the same as today.
- The button show/hide logic in `ChatInput.tsx` does not change.

## Functional Requirements

- When Send and Stop both show, they stack in one column (Send above Stop), and the mode button sits under them.
- When only Send or only Stop shows, the look doesn't change from today.
- All buttons keep their current size, color, and behavior.

## Non-Functional Requirements

- CSS change only. `pnpm lint` and `pnpm format:check` pass.

## Files in Scope

- `apps/web/src/styles/chat-input.css`

## Risks & Assumptions

- With three stacked buttons, the input row gets taller than the 2-row textarea. The textarea stretches to match (`align-items: stretch`), so the chat input grows a little only while both buttons show.
- The project's Testing Workflow is `Skip-Testing`, so there is no regression test, even though the bug rules normally ask for one. I'll check the change by reading the diff. You could also run `/web-test` afterwards.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | In `apps/web/src/styles/chat-input.css`, make `.chat-input-buttons` a column (`flex-direction: column`, `gap: 0.25rem`). | developer | none | Send sits above Stop when both show, and the mode button is under them. The single-button look doesn't change. Lint and format checks pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
