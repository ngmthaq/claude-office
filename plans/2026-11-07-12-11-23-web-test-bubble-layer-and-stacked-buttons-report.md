# Title: Web Test Report — Sub-agent label size, bubble layer, and stacked Send/Stop

- Classification: feature
- Description: Bubbles now draw on top and Send/Stop stack correctly, but a sub-agent name label can still be hidden behind the main desk.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-07-12-11-23-web-test-bubble-layer-and-stacked-buttons.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 6     | 5    | 1    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Idle room shows only Send | PASS | TEAL-WALRUS room: only Send, with the mode button under it. |
| TC-02 | New session starts | PASS | A new `claude-office` room appeared and was selected. |
| TC-03 | Busy main agent shows only Stop, bubble on top | PASS | Only Stop showed. The main agent's working bubble drew fully over the top wall. |
| TC-04 | Sub-agent bubbles and labels above furniture | FAIL | All bubbles drew above the desk, wall, and nearby agents. But the second sub-agent's name label was hidden behind the main desk. |
| TC-05 | Background sub-agents + idle main: Send above Stop | PASS | Send, Stop, and mode in one right-aligned column. The text box stretched to the same height. |
| TC-06 | After the sub-agents finish, only Send | PASS | After both sub-agents finished, only Send and the mode button showed. |

## Failures

### TC-04 — Sub-agent bubbles and labels above furniture

- Steps: With 2 background sub-agents working in the `claude-office` room, zoomed in on the room and took a screenshot.
- Expected: Each sub-agent's working bubble shows in full above desks, walls, and nearby sub-agents. The name label shows above each sub-agent at a smaller size than before, and is still readable.
- Actual: Bubbles: correct, all drawn on top (the second sub-agent's bubble draws over the main desk). Labels: the first label "general-pur…" is readable. The second sub-agent sits at the seat under the main desk, and its label is drawn behind the desk, so only "gen" shows, running into the first label ("general-pur..gen"). When only one sub-agent was left, its label showed in full.
- Evidence: zoomed screenshot `/var/folders/y6/424wn3213pzbhzj_cbm5t30c0000gn/T/claude-chrome-screenshots-OPvqxz/screenshot-1794028364823-0.png`. Cause from the code: the name label is a child of `SubagentSprite` inside `subagentLayer`, which `RoomView` adds before the desks (`apps/web/src/game/room-view.ts:87-88`). The approved plan kept labels out of the new overlay layer on purpose.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors. Note: console tracking started near the end of the run, so errors from earlier in the run would not show.
- Side note, not a test case: while the main agent relayed a sub-agent report, its working bubble and green lamp showed, but the chat input showed Send + Stop (not "Claude is working..."). The room state and the `busy` flag may not match for a short time.

## Next Steps

- To fix the FAIL case, run `/party-mode` and give it this report file: plans/2026-11-07-12-11-23-web-test-bubble-layer-and-stacked-buttons-report.md
