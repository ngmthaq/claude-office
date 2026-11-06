# Title: Web Test Plan — Live result card (after ws-client fix)

- Classification: bug
- Description: Confirm that the live result card appears right away with the title "Result: `<description>`", now that the web client handles `peer_message`.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `LOG_LEVEL=debug pnpm prod`)
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only (current browser window)

---

## Goal

- Prove that the live card appears in the browser within a few seconds of the server's `task result card emitted` log line, with a one-line "Result: …" title, a green badge, and the report as its body.

## Scope

- In scope: TC-07 only, unchanged.
- Out of scope: everything else.

## Preconditions

- Port 4317 is free (checked). I run `LOG_LEVEL=debug pnpm prod` (it rebuilds with the fix) and wait for "Server listening".

## Risks & Assumptions

- One new session and one prompt for a small read-only background sub-agent. It uses some tokens and edits no files. I'll allow only read-only tools.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-07 | PASS | Live result shows a card with the right title | high | App open | 1. Start a **new session** in `claude-code-office`. 2. Send: "Use the Agent tool with run_in_background true to start a general-purpose sub-agent that lists the files in packages/shared/src/events and reports how many there are. Do not edit anything." 3. Poll the chat every 2 s until the card shows up, and note the time. 4. Read the server log line `task result card emitted`. | the prompt in step 2 | A collapsed card with the header "Result: `<sub-agent description>`" (one short line) and a green badge appears after the sub-agent finishes. Expanding it shows the report, with no `<note>` or output path. The log has one `task result card emitted` line with `usedTranscript: true`, and the card shows in the browser within a few seconds of that line. |
