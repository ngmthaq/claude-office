# Title: Web Test Report — Background tasks sign (issue #9)

- Classification: feature
- Description: 11 of 12 cases pass; the "agent row opens details" case is blocked because the test sub-agent ended early.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-11-19-40-08-web-test-background-tasks-sign.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 12    | 11   | 0    | 1       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | No sign when there is no background work | PASS | No element with a "background" label, and no amber floor badge. The new room was named "claude-office" (later auto-titled "Background sleep jobs and sub-agent"), not "BG Test". |
| TC-02 | Sidebar sign stays after the main reply ends | PASS | After "started", the sidebar showed the hourglass badge with 3 and no busy spinner (`aside .spinner-grow` count 0). |
| TC-03 | Sidebar sign looks different and is accessible | PASS | `span.badge.rounded-pill.bg-info.text-dark` with an hourglass icon. `title` and `aria-label` = "3 background tasks running". |
| TC-04 | Chat pill shows the count | PASS | A button above the input read "3 background tasks running", with the same `title` and `aria-label`. |
| TC-05 | Chat list shows each task and its run time | PASS | 3 rows with descriptions and run times; times went from 22s to 25s over 3 s. All 3 rows were commands (terminal icon), not 1 agent + 2 commands: the sub-agent ran its `sleep 150` as its own background command and then ended. The list showed this real state correctly. |
| TC-06 | Command rows cannot be clicked | PASS | Every command row is a plain `div`, not a button. |
| TC-07 | Agent row opens sub-agent details | BLOCKED | No background sub-agent was running (see TC-05), so there was no agent row to click. |
| TC-08 | Floor badge matches the sidebar | PASS | An amber badge with "3" showed at the room's top-right corner. The blue sub-agent badge was hidden (no sub-agent running), so there was nothing to overlap. |
| TC-09 | Signs are right after a page reload | PASS | After the reload, the sidebar and the pill showed 3. Run times continued (1m 7s) and did not reset. |
| TC-10 | Count goes down live as tasks end | PASS | Went 3 → 2 → 1 in the sidebar, the pill, and the floor with no reload. The open list dropped to one row, "Sleep 260 seconds". |
| TC-11 | Signs go away when all work is done | PASS | The sidebar badge, the pill, and the floor badge were all gone, the open list closed by itself, and the room was idle. |
| TC-12 | Server restart clears the sign | PASS | With 1 task running, `pnpm dev` was stopped and started again. After the reload the room showed as closed with no background sign. No `sleep` process was left over. |

## Failures

- None.

## Blocked / Skipped

- TC-07: Claude did not keep the sub-agent running in the background. It put the sub-agent's `sleep 150` in the background and ended the sub-agent, so no agent row appeared. To check it, run again with a trigger that tells the sub-agent to run `sleep 150` in the foreground (not `run_in_background`).

## Console and Network Problems

- Not checked. The console and network tools were not used in this run.

## Other Observations

- In the list, a run time like "1m 2s" wraps onto two lines when the description is long.
- The top bar's usage-limit text already uses the same hourglass icon (`bi-hourglass-split`) as the new background sign.
- The sidebar "closed" badge is in the row's text but can't be seen, because the label is cut off.
- User requests during the run (not part of this test): remove the sidebar "closed" badge, and show a closed room with a different row color instead.

## Next Steps

- No FAIL cases. To fix the observations or the closed-room requests, run `/party-mode` and give it this report file: plans/2026-11-11-19-40-08-web-test-background-tasks-sign-report.md
- Optional: run TC-07 again with a foreground-sleep sub-agent trigger.
