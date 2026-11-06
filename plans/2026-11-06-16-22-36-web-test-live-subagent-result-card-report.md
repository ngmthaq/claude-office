# Title: Web Test Report — Re-run live sub-agent result card

- Classification: bug
- Description: The live card now appears, and "Open sub-agent" shows the full report, but the live card's title is the whole report instead of "Result: <description>".
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-16-22-36-web-test-live-subagent-result-card.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 2     | 1    | 1    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-07 | Live result shows a card | FAIL | A collapsed card does appear live, with a green "done" badge, and its body is the full report with no `<note>` or output path. But the card's title (the `<summary>` header) is the entire report text, not "Result: List files in events folder". The header is 565px tall. |
| TC-08 | "Open sub-agent" opens the details panel with the full report | PASS | The card has an "Open sub-agent" button. Clicking it opens the details panel for "List files in events folder", and its Result shows the full report ("Top-level files: 52 … Total: 52"), not "Agent … finished". |

## Failures

### TC-07 — Live result shows a card

- Steps: new session in `claude-code-office`, sent the approved prompt, waited for the sub-agent to finish.
- Expected: a collapsed card titled "Result: …" with a green badge.
- Actual: the card's header text starts "The folder `/Users/nmthang6/Documents/Repositories/self/claude-code-office/packages/shared/src/events` exists and holds **52 files**…" and continues through the whole report (raw markdown, not rendered). The badge is green "done", which is expected because the report has no status line.
- Likely root cause: `SdkEventMapperService.buildTaskResultEvent` builds the title with `TaskNotificationUtil.buildTitle(notification.summary)`. Live, the system `task_notification` message's `summary` holds the sub-agent's result text, not `Agent "<description>" finished` like the `<summary>` tag in the transcript. The SDK type (`sdk.d.ts` ~6416, `summary: string`) has no doc comment. `buildTitle` returns the summary itself when it doesn't start with `Agent `, so the title becomes the whole report. This is inferred from the header text, not from logging the server.
- The same live `summary` is also what `subagent_finished.result` gets (truncated). That is why the details panel already showed report text before.
- Evidence: DOM of `details.peer-card > summary`: `<span class="small"><i class="bi bi-robot me-1">…</i>The folder `/Users/…` exists and holds **52 files**…`. Screenshot taken during the run.

## Blocked / Skipped

- None.

## Console and Network Problems

- None seen.
- Observation (not diagnosed): about 44 seconds after the sub-agent card showed "done", the chat still had no result card. After opening and closing the details panel, the card was there, placed before Claude's final reply. It may just have arrived late; I did not measure when it arrived.

## Next Steps

- To fix the FAIL case, run `/party-mode` and give it this report file: `plans/2026-11-06-16-22-36-web-test-live-subagent-result-card-report.md`.
- Suggested fix: for live cards, build the title from the sub-agent's `description` (known to the mapper from the Agent tool input at `subagent_started`), as `Result: <description>`, instead of from the live `summary`. For shell tasks, cap the title length. Optionally log or measure when the card is emitted, to check the delay observation.
