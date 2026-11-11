# Title: Web Test Plan — Background tasks sign (issue #9)

- Classification: feature
- Description: This run checks that the sidebar, chat panel, and floor show a sign while background work runs, and that the sign updates live and survives a reload.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only, at the current browser window size

---

## Goal

- Prove that a room with background work running shows a sign in the sidebar, chat panel, and floor after the main reply ends.
- Prove that the sidebar sign looks different from the busy spinner and has a tooltip and an accessible label.
- Prove that the chat list shows each task with its run time, and that a background sub-agent row opens its details.
- Prove that the count goes down as tasks end, that the sign goes away at 0, and that the state is right after a page reload.

## Scope

- In scope: `SessionList.tsx` (sidebar badge), `BackgroundTasksPill.tsx` in `ChatPanel.tsx` (pill and list), `room-view.ts` (floor badge), and the server list in the room data. This covers the work in `plans/2026-11-11-19-34-04-background-tasks-sign.md`.
- Out of scope: the Stop button with background commands, mobile sizes, other browsers, and long reconnects without a server restart.

## Preconditions

- I start `pnpm dev` and stop it at the end.
- The floor is turned on.
- I create one test room ("BG Test") in this repo folder and archive it at the end.

## Risks & Assumptions

- The trigger message runs only `sleep` commands, so no files change. It uses a small number of tokens.
- Assumption: Claude follows the prompt and starts the work in the background (`run_in_background`). If it runs anything in the foreground instead, I will mark the affected cases `Blocked` and say why.
- Timings are long enough (150 s, 200 s, 260 s) for the checks to finish before the first task ends.
- TC-12 restarts `pnpm dev` while one background command runs. The correct result is that the sign is gone, because the Claude process ends with the server.
- Archiving can be undone from the Archived dialog.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: —

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | No sign when there is no background work | medium | App open, "BG Test" room created and selected | 1. Look at the "BG Test" sidebar row. 2. Look above the chat input. 3. Look at the room on the floor. | none | No hourglass badge in the sidebar, no "background task" pill, and no amber floor badge. |
| TC-02 | PASS | Sidebar sign stays after the main reply ends | high | TC-01 | 1. Send the trigger message. 2. Wait until the busy spinner on the row goes away. | Trigger message (below) | The row shows the hourglass badge with **3**. The yellow busy spinner is not shown. |
| TC-03 | PASS | Sidebar sign looks different and is accessible | high | TC-02 | 1. Hover the badge. 2. Read the badge element's attributes. | none | It is a blue-green pill with an hourglass icon, not a grow spinner. `title` and `aria-label` are "3 background tasks running". |
| TC-04 | PASS | Chat pill shows the count | high | TC-02 | 1. Look above the chat input. | none | A pill reads "3 background tasks running", with `title` and `aria-label` set. |
| TC-05 | PASS | Chat list shows each task and its run time | high | TC-04 | 1. Click the pill. 2. Read the list. 3. Wait 3 seconds and read it again. | none | The list has 3 rows: 1 agent (person icon) and 2 commands (terminal icon), each with a description and a run time. The run times go up by about 3 seconds. |
| TC-06 | PASS | Command rows cannot be clicked | medium | TC-05 | 1. Check the command rows in the list. | none | The command rows are plain text, not buttons, and clicking them does nothing. |
| TC-07 | BLOCKED | Agent row opens sub-agent details | high | TC-05 | 1. Click the agent row. | none | The list closes and the sub-agent details view opens for that agent. |
| TC-08 | PASS | Floor badge matches the sidebar | high | TC-02 | 1. Close the details. 2. Look at "BG Test" on the floor and zoom in on its top-right corner. | none | An amber badge with **3** sits next to the blue sub-agent badge, with no overlap. |
| TC-09 | PASS | Signs are right after a page reload | high | Work still running | 1. Reload the page. 2. Select "BG Test". 3. Check the sidebar, the pill, and the floor. 4. Open the list. | none | All three signs show **3**. The run times continue from before and do not reset to 0s. |
| TC-10 | PASS | Count goes down live as tasks end | high | TC-09 | 1. Wait until the background sub-agent ends (about 150 s). 2. Check all three signs. 3. Wait for the 200 s command to end and check again. | none | The count drops to **2** and then **1** in the sidebar, pill, and floor, with no reload. |
| TC-11 | PASS | Signs go away when all work is done | high | TC-10 | 1. Wait for the 260 s command to end. 2. Check all three places. | none | No sidebar badge, no pill, and no amber floor badge. The room does not look stuck. |
| TC-12 | PASS | Server restart clears the sign | low | TC-11 | 1. Send the second trigger. 2. When the badge shows **1**, stop and restart `pnpm dev`. 3. Reload the page after the server is up. | Second trigger (below) | After the reload, "BG Test" shows no background sign. |

**Trigger message (TC-02):**
> Start these three in the background and do not wait for them: (1) run `sleep 200` with Bash `run_in_background: true`; (2) run `sleep 260` with Bash `run_in_background: true`; (3) start one general-purpose sub-agent with `run_in_background: true` whose only job is to run `sleep 150` and then reply "done". Then reply "started" and end your turn.

**Second trigger (TC-12):**
> Run `sleep 300` with Bash `run_in_background: true`, reply "started", and end your turn.
