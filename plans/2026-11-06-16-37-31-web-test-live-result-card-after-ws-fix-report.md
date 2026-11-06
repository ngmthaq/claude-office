# Title: Web Test Report — Live result card (after ws-client fix)

- Classification: bug
- Description: The live result card now shows in the browser less than 1 second after the server sends it, with the title "Result: <description>", a green badge, and the full report.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `LOG_LEVEL=debug pnpm prod`)
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-16-37-31-web-test-live-result-card-after-ws-fix.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 1     | 1    | 0    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-07 | Live result shows a card with the right title | PASS | The header is "Result: Count files in events dir", one line, 38px high, with a green "done" badge. The card is collapsed by default. Expanded, the body starts "packages/shared/src/events holds 52 files…" and has an "Open sub-agent" button. No `<note>`, output path or `task-notification` text appears. It showed in the browser 0.7s after the server log line (the poll runs every 1s). |

## Evidence

- Server log (UTC):
  - `09:38:31.761 subagent started`
  - `09:38:44.991 subagent finished`
  - `09:38:45.258 task result card emitted {readMs: 266, usedTranscript: true, taskId: a82d0fe7f10c6c7c0}`
- Browser poll: the sub-agent card showed "done" and the result card appeared at the same poll, `09:38:45.957Z`. There was 1 card.
- Screenshot: `/var/folders/0l/_3ct7ncx4kx2p4j3mq1my9vh0000gq/T/claude-chrome-screenshots-WcZwdV/screenshot-1793957947690-11.jpg`

## Failures

- None.

## Blocked / Skipped

- None.

## Console and Network Problems

- None seen.

## Next Steps

- None for this test. The earlier failures from this work (TC-03, TC-07, TC-08) are all fixed and checked in the browser.
