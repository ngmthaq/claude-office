# Title: Web Test Plan — Live result card title (debug log run)

- Classification: bug
- Description: Confirm that the live result card is titled "Result: `<description>`", and use the debug log to time when the card is sent.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `LOG_LEVEL=debug pnpm prod`)
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only (current browser window)

---

## Goal

- Prove that the live card's title is the sub-agent's description, not the report.
- Record when the server sends the card (`task result card emitted`: `readMs`, `usedTranscript`) next to when it shows up in the browser, to check the earlier "late card" observation.

## Scope

- In scope: TC-07 from `plans/2026-11-06-16-22-36-web-test-live-subagent-result-card.md`, with the title check made strict.
- Out of scope: TC-08 (it passed last run), history cards.

## Preconditions

- Port 4317 is free (checked). I run `LOG_LEVEL=debug pnpm prod` (it rebuilds with the fix) and wait for "Server listening".

## Risks & Assumptions

- One new session and one prompt for a small read-only background sub-agent. It uses some tokens and edits no files. I'll allow only read-only tools.
- The debug log will also print the SDK's other debug output, if any. I'll only read the `task result card emitted` line and the sub-agent start and finish lines.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-07 | FAIL | Live result shows a card with the right title | high | App open | 1. Start a **new session** in `claude-code-office`. 2. Send: "Use the Agent tool with run_in_background true to start a general-purpose sub-agent that lists the files in packages/shared/src/events and reports how many there are. Do not edit anything." 3. Poll the chat every 2 s until the card shows up, and note the time. 4. Read the server log line `task result card emitted`. | the prompt in step 2 | A collapsed card with the header "Result: `<sub-agent description>`" (one short line) and a green badge appears after the sub-agent finishes. Expanding it shows the report, with no `<note>` or output path. The log has one `task result card emitted` line with `usedTranscript: true`, and the card shows in the browser within a few seconds of that line. |
