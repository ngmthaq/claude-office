# Title: Web Test Report — Sub-agent result card

- Classification: feature
- Description: The card works for `<agent-message>` hand-backs in history, but its badge misses bold `**Status:**` lines, and app-started (SDK) sessions never show the card live, because their sub-agent results arrive as `<task-notification>`, not as a peer hand-back.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-15-55-38-web-test-subagent-result-card.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 9     | 6    | 2    | 1       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | History hand-back shows as a card, not a raw bubble | PASS | Session "Party-mode server layered structure": 5 `peer-card` cards, 0 user bubbles with `<agent-message` text. |
| TC-02 | Card is collapsed by default | PASS | All 5 had `open: false`. A closed card is 40px high, summary row only. |
| TC-03 | Status badge matches the report | FAIL | 3 of 5 correct (green "complete"). 2 of 5 show grey "report", but the report says `**Status:** complete`. |
| TC-04 | Report renders as markdown, boilerplate removed | PASS | Headings and 3–6 real `<table>`s per card. No "[Subagent hand-back]", `[harness:`, trailing note, or pipe text. Note: a wide table (488px) is clipped inside the 445px card, with no horizontal scroll. |
| TC-05 | History card has no "Open sub-agent" link | PASS | No button in any history card. |
| TC-06 | Other chat items still render normally | PASS | User bubbles, assistant markdown and Bash tool cards look as before. Note: 7 raw `<task-notification>` user bubbles still show (old behaviour, not part of this change). |
| TC-07 | Live hand-back shows a card | FAIL | The sub-agent ran and finished (sub-agent card "done"), and Claude replied with its result. No `peer-card` appeared. |
| TC-08 | "Open sub-agent" opens the details panel | BLOCKED | No live card to click (see TC-07). |
| TC-09 | Browser console has no new errors | PASS | No console errors or exceptions. |

## Failures

### TC-03 — Status badge matches the report

- Steps: opened the session from History, read the badge on each card, expanded the cards.
- Expected: the badge matches the report's status line.
- Actual: cards 3 and 5 show the grey "report" badge. Their status line renders as `<strong>Status:</strong> complete`, so the raw markdown is `**Status:** complete`. The regex in `apps/web/src/utils/report-status.util.ts` (`status\s*:\s*(complete|…)`) does not allow the `**` between the `:` and the word.
- Evidence: DOM check, card 3: summary "Sub-agent result | report", `badge bg-secondary`, status HTML `<strong>Status:</strong> complete`.

### TC-07 — Live hand-back shows a card

- Steps: new session in `claude-code-office`, sent the approved prompt (background general-purpose sub-agent listing `packages/shared/src/events`), waited for it to finish.
- Expected: a collapsed card "Result from …" with a badge appears after the sub-agent finishes.
- Actual: no card. In the session transcript (`d31d658b-….jsonl`), the result arrived as a user message with `origin.kind: 'task-notification'` and text starting `<task-notification>` (it holds `<task-id>`, `<status>`, `<summary>`, `<result>`). There was no `origin.kind: 'peer'` message. The new mapper only handles `peer`, so it emits nothing. The `<agent-message>` hand-back format comes from the sub-agent hand-back tool in the Claude Code CLI. Sessions the app starts through the SDK do not use it.
- Evidence: transcript user entries: prompt → `tool_result` → `<system-reminder>` (meta) → `task-notification` origin. Screenshot saved during the run.

## Blocked / Skipped

- TC-08: blocked by TC-07, since there is no live card to click.

## Console and Network Problems

- None.

## Next Steps

- To fix the FAIL cases, run `/party-mode` and give it this report file: `plans/2026-11-06-15-55-38-web-test-subagent-result-card-report.md`.
  - TC-03: let the status parser allow markdown emphasis around `Status:` (for example `**Status:** complete`).
  - TC-07: also map `origin.kind: 'task-notification'` messages (live) and `<task-notification>` text (history) to the same card. Use `<result>` as the body and `<status>`/`<summary>` for the badge and title. Link it to the sub-agent through `<task-id>` / `<tool-use-id>`. This also removes the raw `<task-notification>` bubbles seen in TC-06.
- Optional: let wide tables scroll sideways inside the card.
