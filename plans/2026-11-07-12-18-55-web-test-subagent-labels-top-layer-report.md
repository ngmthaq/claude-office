# Title: Web Test Report — Re-check sub-agent labels on the top layer

- Classification: bug
- Description: The label fix works: sub-agent names draw over the main desk, fit side by side, hide in rooms you haven't selected, and leave with their sub-agent.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-07-12-18-55-web-test-subagent-labels-top-layer.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 4     | 4    | 0    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Label under the main desk shows in full | PASS | Both labels showed in full. The second one drew over the main desk. |
| TC-02 | Neighboring labels don't touch | PASS | Both read "general-…" with a clear gap between them. |
| TC-03 | Labels hide in a room you haven't selected | PASS | Selecting TEAL-WALRUS moved the camera off the test room, so I cleared the selection with the chat panel's back arrow instead. In the full office view, the test room showed bubbles but no labels. Labels came back after selecting it again. |
| TC-04 | Labels leave with their sub-agent | PASS | After both sub-agents finished, no label or sub-agent bubble was left in the room. |

## Failures

- None.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors (tracking started right after the page loaded).

## Notes

- The first attempt to type the prompt missed the text box (the click landed below it), so nothing was sent. The second attempt worked. This was my click, not an app bug.
- During the run I allowed 6 read-only Bash commands from the sub-agents (`find`/`wc`, `graphify query`/`wc`, and `grep`s).
- At the end, the main agent in the "Parallel file listing…" room asked to run a read-only `grep` and `git diff --stat`. That was outside the test steps, so I left it pending for you.
- Evidence: `/var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-OPvqxz/screenshot-1794028806146-2.png` (labels, TC-01/02) and `/var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-OPvqxz/screenshot-1794028935933-3.png` (empty room, TC-04).

## Next Steps

- none
