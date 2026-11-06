# Title: Web Test Plan — Re-run live sub-agent result card

- Classification: bug
- Description: Confirm that, after the transcript-read fix, a live background sub-agent produces a result card, and "Open sub-agent" shows the full report.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only (current browser window)

---

## Goal

- Prove that the live card appears in an app-started session (TC-07).
- Prove that "Open sub-agent" opens the details panel with the full report (TC-08).

## Scope

- In scope: TC-07 and TC-08 from `plans/2026-11-06-16-08-00-web-test-subagent-result-card-rerun.md`.
- Out of scope: everything else (TC-03 passed last run).

## Preconditions

- Port 4317 is free (checked). I run `pnpm prod`, which rebuilds with the fix, and wait for "Server listening".

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
| TC-07 | FAIL | Live result shows a card | high | App open | 1. Start a **new session** in `claude-code-office`. 2. Send: "Use the Agent tool with run_in_background true to start a general-purpose sub-agent that lists the files in packages/shared/src/events and reports how many there are. Do not edit anything." 3. Wait for the sub-agent to finish. | the prompt in step 2 | A collapsed card titled "Result: …" with a green badge (complete or done) appears after the sub-agent finishes. Expanding it shows the report, with no `<note>` or output path. |
| TC-08 | PASS | "Open sub-agent" opens the details panel with the full report | high | TC-07 | 1. Expand the live card. 2. Click **Open sub-agent**. | none | The details panel opens for that sub-agent. Its Result shows the full report text, not "Agent … finished". |
