# Title: Web Test Report — Re-run sub-agent result card fixes

- Classification: bug
- Description: The bold-status fix and the history task cards work, but the live card still does not appear, because the SDK's live stream never sends the `<task-notification>` user message to the server.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-16-08-00-web-test-subagent-result-card-rerun.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 3     | 1    | 1    | 1       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-03 | Status badge matches the report (bold status) | PASS | Session "Party-mode server layered structure": all 5 hand-back cards show a green "complete" badge, including the 2 with `**Status:** complete` that failed before. Wide tables scroll inside the card (6 tables scroll), and no card is clipped. 0 raw `<task-notification>` bubbles remain. |
| TC-07 | Live result shows a card | FAIL | The sub-agent ran (2 read-only Bash calls, allowed automatically) and finished, and Claude replied "There are 52 files…". No `peer-card` appeared. |
| TC-08 | "Open sub-agent" opens the details panel with the full report | BLOCKED | No live card to click (see TC-07). |

## Failures

### TC-07 — Live result shows a card

- Steps: new session in `claude-code-office`, sent the approved prompt, waited for the sub-agent card to show "done" and for Claude's reply.
- Expected: a collapsed "Result: …" card with a green badge appears.
- Actual: no card. Sub-agent card: "general-purpose | Count files in events dir | done". Last chat item: Claude's reply "There are 52 files in packages/shared/src/events…".
- Evidence:
  - The session transcript (`7eddc0f5-….jsonl`) does contain the `<task-notification>` user entry (`origin.kind: 'task-notification'`). So the harness made the message, but the app's live view never got it.
  - Likely root cause: the Agent SDK's live output stream does not echo injected user messages (the task notification is queued as a prompt to the model). The SDK only sends them as `SDKUserMessageReplay` when user-message replay is on, and the app does not turn it on. The only live signal is the system `task_notification` message (`SDKTaskNotificationMessage`: `task_id`, `tool_use_id`, `status`, `summary`, `output_file`), which has **no result text**. So `mapPeerText`'s new task branch never runs live. I did not instrument the server to prove this; it is based on the SDK types and the transcript.
  - The history path does work for task notifications (TC-03 session: 7 `Result: …` cards, 0 raw bubbles).

## Blocked / Skipped

- TC-08: blocked by TC-07, since there is no live card.

## Console and Network Problems

- None seen. One `javascript_tool` call timed out after 45s because the wait loop inside it was too long (a test-script issue, not an app error). It was re-run with a shorter loop.

## Next Steps

- To fix the FAIL case, run `/party-mode` and give it this report file: `plans/2026-11-06-16-08-00-web-test-subagent-result-card-rerun-report.md`.
- Fix options for party-mode to weigh:
  - **A:** on the live system `task_notification`, build the card from the sub-agent's last assistant text. The mapper already sees sub-agent messages through `parent_tool_use_id`, if background sub-agent messages are streamed.
  - **B:** read the result from the SDK (for example the sub-agent transcript) when the system `task_notification` arrives.
  - **C:** check whether the SDK can replay user messages (`SDKUserMessageReplay`) and turn it on.
- A researcher should confirm which of these the SDK supports before planning.
