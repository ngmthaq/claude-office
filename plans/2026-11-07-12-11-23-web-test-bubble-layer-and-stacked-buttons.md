# Title: Web Test Plan — Sub-agent label size, bubble layer, and stacked Send/Stop

- Classification: feature
- Description: Check the smaller sub-agent name, bubbles drawn on top, and Send and Stop stacked in one column while background sub-agents run.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current window)

---

## Goal

- Prove the working and waiting bubbles over the main agent and sub-agents are not covered by walls, desks, plants, the lamp, the badge, or other sub-agents.
- Prove the sub-agent name label is smaller (font size 5) and still readable when zoomed in.
- Prove that while background sub-agents run and the main agent is idle, Send and Stop show in one column (Send above Stop), with the mode button under them.
- Prove the single-button layouts still look normal.

## Scope

- In scope: the office canvas room view, and the chat input buttons in the chat panel.
- Out of scope: the error-mark bubble (it needs a sub-agent to fail, which I can't set up reliably), closed rooms, mobile, and other panels.

## Preconditions

- The web app runs at http://localhost:5173 and the server at :4317 (both are up now).
- The browser has the latest build. Vite hot-reloads, but I'll refresh the page to be sure.

## Risks & Assumptions

- TC-03 starts **one new session** in this repo and sends one prompt. It uses some tokens and edits no files. I'll allow only read-only tools, and deny any write tool if one asks for permission.
- Background sub-agents may finish fast. If they finish before I can take a screenshot, I'll send a second prompt that asks for slower read-only work. If they still finish too fast, that case is `Blocked`.
- The label font size is checked by eye against a screenshot, plus reading the code value. The canvas can't be inspected like the DOM.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Idle room shows only Send | medium | App open | 1. Open http://localhost:5173 and refresh. 2. Select an idle room. 3. Screenshot the chat input. | none | Only the blue Send button, with the mode (shield) button right under it. No Stop. |
| TC-02 | PASS | New session starts | high | TC-01 | 1. Click the new-session button. 2. Click **Start session here** for this repo. | none | A new room appears in the office and is selected. |
| TC-03 | PASS | Busy main agent shows only Stop, bubble on top | high | TC-02 | 1. Send: "Use the Agent tool with run_in_background true to start 2 general-purpose sub-agents in parallel. One lists files in apps/web/src/game, the other lists files in packages/shared/src/events. Each should then read every file it found before reporting. Do not edit anything." 2. While the main agent works, screenshot the chat input and zoom in on the room. | the prompt in step 1 | Only red Stop shows (no Send). The working bubble over the main agent shows in full, not cut off by the top wall. |
| TC-04 | FAIL | Sub-agent bubbles and labels above furniture | high | TC-03, sub-agents in the room | 1. Zoom in on the selected room. 2. Screenshot it. | none | Each sub-agent's working bubble shows in full, above desks, walls, and nearby sub-agents. The name label shows above each sub-agent at a smaller size than before, and is still readable. |
| TC-05 | PASS | Background sub-agents + idle main: Send above Stop | high | Main turn done, sub-agents still working | 1. Wait for the main agent to go idle while the sub-agents still run. 2. Screenshot the chat input. | none | Send on top, Stop under it, and the mode button under Stop, all in one right-aligned column. The text box stretches to the same height. |
| TC-06 | PASS | After the sub-agents finish, only Send | medium | TC-05 | 1. Wait for all sub-agents to finish. 2. Screenshot the chat input. | none | Only Send and the mode button show, same as TC-01. |
