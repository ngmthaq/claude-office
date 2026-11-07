# Title: Web Test Plan — Re-check sub-agent labels on the top layer

- Classification: bug
- Description: Confirm sub-agent name labels are no longer covered by the main desk, no longer run into each other, and still show only in the selected room.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current window)

---

## Goal

- Confirm the fix for TC-04 in `plans/2026-11-07-12-11-23-web-test-bubble-layer-and-stacked-buttons-report.md`: the second sub-agent's label (the seat under the main desk) now shows in full.
- Confirm neighboring labels are cut to 9 characters ("general-…") and don't touch.
- Confirm labels hide in rooms you haven't selected, and leave with their sub-agent.

## Scope

- In scope: sub-agent name labels on the office canvas.
- Out of scope: Send/Stop buttons (passed last run), the error mark, the busy-flag mismatch, and mobile.

## Preconditions

- The app runs at http://localhost:5173 (Vite hot-reloads; I'll refresh the page).
- I'll reuse the "Parallel file listing…" room from the last run, so no new session is needed.

## Risks & Assumptions

- TC-01 sends one prompt to that room. It runs 2 small read-only background sub-agents, uses some tokens, and edits no files. I'll allow only read-only tools.
- The first two sub-agents take seats 1 and 2 (x = 16 and 48), the same spots as last run. The second seat is the one under the main desk.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Label under the main desk shows in full | high | App open | 1. Refresh and select the "Parallel file listing…" room. 2. Send the prompt. 3. When both sub-agents sit down, zoom in on the room and screenshot it. | "Use the Agent tool with run_in_background true to start 2 general-purpose sub-agents in parallel. One lists files in apps/web/src/game, the other lists files in packages/shared/src/events. Each should then read every file it found before reporting. Do not edit anything." | Both labels show in full above their sub-agents. The second one draws over the main desk. |
| TC-02 | PASS | Neighboring labels don't touch | high | TC-01 | 1. Look at the same zoomed screenshot. | none | Each label reads "general-…" (9 characters) with a visible gap between the two. |
| TC-03 | PASS | Labels hide in a room you haven't selected | medium | TC-01, sub-agents still working | 1. Select another room in the sidebar. 2. Screenshot the office. 3. Select the "Parallel file listing…" room again. | none | No labels in the test room while it isn't selected. They show again after you select it. |
| TC-04 | PASS | Labels leave with their sub-agent | medium | TC-01 | 1. Wait until both sub-agents finish. 2. Zoom in on the room. | none | No label or bubble is left behind in the room. |
