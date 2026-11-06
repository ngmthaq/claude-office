# Title: Web Test Plan — Re-run sub-agent result card fixes

- Classification: bug
- Description: Confirm the fixes for TC-03 (bold status badge), TC-07 (live card from `<task-notification>`) and TC-08 ("Open sub-agent" and full report in the details panel).
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only (current browser window)

---

## Goal

- Confirm that history cards with `**Status:** complete` now show a green "complete" badge.
- Confirm that a live background sub-agent in an app-started session produces a collapsed card titled "Result: …" with a badge.
- Confirm that "Open sub-agent" on that card opens the details panel, and the panel shows the full report.

## Scope

- In scope: TC-03, TC-07, TC-08 from `plans/2026-11-06-15-55-38-web-test-subagent-result-card.md`. I'll also check that wide tables no longer clip, as part of TC-03.
- Out of scope: the other cases (they passed last run), and the duplicate pointer card in CLI-resumed sessions (a known follow-up).

## Preconditions

- Port 4317 is free (checked). I run `pnpm prod` (this rebuilds with the fix) and wait for "Server listening".
- History session "Party-mode server layered structure" exists (it was used last run).

## Risks & Assumptions

- TC-07 starts one new session and sends one prompt for a small read-only background sub-agent. That uses some tokens and edits no files. I'll allow only read-only tools.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-03 | PASS | Status badge matches the report (bold status) | high | App open | 1. Open **History**. 2. Open "Party-mode server layered structure". 3. For each hand-back card, read the badge and the report's status line. 4. Expand a card with a table. | that session | Every card whose report says `Status: complete` (bold or not) shows a green "complete" badge. No card shows "report" when its report has a status line. Wide tables scroll inside the card (card scrollWidth = clientWidth). |
| TC-07 | FAIL | Live result shows a card | high | App open | 1. Start a **new session** in `claude-code-office`. 2. Send: "Use the Agent tool with run_in_background true to start a general-purpose sub-agent that lists the files in packages/shared/src/events and reports how many there are. Do not edit anything." 3. Wait for the sub-agent to finish. | the prompt in step 2 | A collapsed card titled "Result: …" with a green badge (complete or done) appears after the sub-agent finishes. Expanding it shows the report, with no `<note>` or output path. |
| TC-08 | BLOCKED | "Open sub-agent" opens the details panel with the full report | high | TC-07 | 1. Expand the live card. 2. Click **Open sub-agent**. | none | The details panel opens for that sub-agent. Its Result shows the full report text, not "Agent … finished". |
