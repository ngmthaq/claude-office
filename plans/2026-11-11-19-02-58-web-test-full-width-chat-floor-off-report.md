# Title: Web Test Report — Full-width chat when "Show floor" is off (issue #7)

- Classification: feature
- Description: With the floor off, messages and cards fill the panel, but table grids do not; the sub-agent details panel could not be opened from history.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-11-19-02-58-web-test-full-width-chat-floor-off.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 8     | 6    | 1    | 1       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Floor on: no change | PASS | Computed `max-width` is 768px on assistant, user, tool, peer and internal rows. Drawer is 447px, so items are 447px. |
| TC-02 | Floor off: assistant messages fill the panel | PASS | Drawer gets `chat-drawer--full`. List content 1168px; all assistant messages 1168px, left edge 256 = list left. |
| TC-03 | Floor off: cards fill the panel | PASS | Across all 8 sessions: tool, peer and system cards are 1168px. No session had a permission/question or sub-agent card in history, so those two were not seen. |
| TC-04 | Floor off: code blocks and tables use the width | FAIL | Code blocks pass. Table boxes are 1150px, but the grid inside is narrower in 2 of 4 tables (re-checked on request). |
| TC-05 | Floor off: sides kept, user bubble ≤80% | PASS | User bubble 934px (80% of 1168), right edge 1424 = list right edge. Assistant messages start at the left. Internal rows stay 110px on the left. |
| TC-06 | Floor off: window resize | PASS | At 1000px window: list content 728px; assistant, tool, peer 728px; user 582px (80%). Window restored to 1440x802. |
| TC-07 | Floor off: sub-agent details panel | BLOCKED | No way to open the panel from history (see below). |
| TC-08 | Floor on again: restored | PASS | `chat-drawer--full` removed, floor canvas shown, assistant `max-width` back to 768px. |

## Failures

### TC-04 — Floor off: code blocks and tables use the width

- Steps: Hide the floor, open "Parallel file listing", expand the peer cards, scroll to each table, measure the `<table>` box and its first row.
- Expected: Tables fill their parent message or card.
- Actual: Every `<table>` box is 1150px (= parent), but the rows inside are 977px, 1149px, 864px and 1149px. Two tables leave empty space on the right.
- Cause: `chat.css` gives tables `display: block` (for horizontal scroll). The real grid then sits in an anonymous inner table that only grows to fit its content, not to the box width. This is the same with the floor on; it only shows more with the floor off.
- Evidence: /var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-WAM6Uz/screenshot-1794398753743-3.jpg

## Blocked / Skipped

- TC-07: History peer cards have no "open sub-agent" link (it shows only for live sub-agents), and no session had a `.subagent-card`. Opening the panel needs a live session with a running sub-agent, which is out of scope (no messages sent). By code: the panel renders inside the same `.chat-drawer`, so the `.chat-drawer--full` rules apply to it.

## Console and Network Problems

- No console errors in the tab during the run.

## Next Steps

- TC-04 fixed in round 2 (see below). Optionally re-check TC-07 and the permission/question and sub-agent cards during a live session.

Screenshots:

- Floor on: /var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-WAM6Uz/screenshot-1794398615607-0.jpg
- Floor off: /var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-WAM6Uz/screenshot-1794398633976-1.jpg

---

## Re-check after fix (round 2)

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-04 | Floor off: code blocks and tables use the width | PASS | 19 tables across "Parallel file listing" and "Toggle button with tooltip": every first row is within 1px of its parent width (1149/1150, 1167/1168), including 2-column tables. |
| TC-04b | Wide tables still scroll | PASS | List narrowed to 560px by a temporary inline style (window resize did not apply): 12 wide tables overflow and scroll inside their message or card (`overflow-x: auto`); message list and page do not scroll sideways. |
| TC-01 | Floor on: no change | PASS | Tables keep `display: block`; grid sizes the same as before the fix. |
| TC-08 | Floor on again: restored | PASS | Floor shown, `chat-drawer--full` removed after reload. |

Updated summary: 8 total, 7 PASS, 0 FAIL, 1 BLOCKED (TC-07). No console errors.
