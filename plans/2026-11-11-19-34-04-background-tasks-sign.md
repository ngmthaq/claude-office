# Title: Plan — Show a sign when a room has background tasks or agents running

- Classification: feature
- Description: The server keeps the SDK's live list of background tasks for each room and sends it in the room summary. The sidebar, the chat panel, and the floor each show a sign from that list.
- Source: https://github.com/ngmthaq/claude-office/issues/9

---

## Approach Summary / Goal

- The SDK sends `background_tasks_changed` with the full list of live background tasks (sub-agents, shell commands, and others) every time the list changes. The server replaces its list for the room with each message. It does not pair start and end events, so a missed event cannot leave a stuck sign.
- The list goes into `RoomSummary`. The room list already reaches the browser on every change, on page load, and on reconnect, so the reload and reconnect rules work with no extra code.
- Goal: the user can always tell "the agent is replying" apart from "background work is running".

## Functional Requirements

- The server keeps `backgroundTasks` for each room. Each item has: task id, kind (`agent`, `command`, or `other`), description, linked sub-agent id (or none), and the time the server first saw it.
- The server leaves out tasks marked `ambient`.
- The server keeps the first-seen time of a task that is still in the list.
- The server links a background sub-agent task to its sub-agent by task id. It saves the task id on every `task_started` and handles `task_updated` when a foreground agent moves to the background.
- The server clears the list when the room's SDK query ends (close, crash, or stop timeout). Then it sends the new room list.
- Sidebar: when `backgroundTasks.length > 0`, the room shows an hourglass icon with a count. It looks different from the yellow busy spinner. It has a tooltip and an `aria-label`, such as "2 background tasks running".
- Chat panel: a pill above the chat input says "N background task(s) running". Clicking it opens a list. Each row shows a kind icon, the description, and how long the task has run (updated every second while the list is open).
- Clicking a background sub-agent row opens its details (`useSubagentDetailsStore.openDetails`). Command rows cannot be clicked.
- Floor: a second badge with an hourglass color and a count shows next to the blue sub-agent badge. It hides at 0.
- All three signs update live. They go away when the list is empty.
- Room state logic does not change.

## Non-Functional Requirements

- Send the room list again only when the background list really changes. Do not send it on every SDK message.
- The elapsed-time timer runs only while the list is open.
- Follow the layer rules: shared schema in `packages/shared/src/models`, pure molecules or atoms, stores and services connected only in organisms, and `game/` reads only `RoomSummary`.

## Files in Scope

- `packages/shared/src/models/background-task.ts` (new)
- `packages/shared/src/models/room-summary.ts`
- `packages/shared/src/index.ts`
- `apps/server/src/repositories/session-store.repository.ts` (`Session` type, new-session defaults, `toSummary`)
- `apps/server/src/services/sdk-event-mapper.service.ts` (`task_started`, `task_updated`, new background-list mapping)
- `apps/server/src/services/session.service.ts` (`pump`, `handleQueryEnd` / `endQuery`, session creation at lines ~64 and ~371, the place where `toSummary` gets its data)
- `apps/web/src/components/organisms/SessionList.tsx`
- `apps/web/src/components/atoms/BackgroundTasksBadge.tsx` (new)
- `apps/web/src/components/molecules/BackgroundTasksPill.tsx` (new)
- `apps/web/src/components/organisms/ChatPanel.tsx`
- `apps/web/src/game/room-view.ts`
- Any web test fixtures that build a `RoomSummary` and fail type checks after the new field is added.

## Risks & Assumptions

- Assumption: the installed SDK sends `background_tasks_changed`. The type is in `sdk.d.ts`, and the app already sees this message (`system-events.config.ts:10`).
- Assumption: task kinds come from `task_type`: `local_agent` maps to `agent`, `local_bash` maps to `command`, and anything else maps to `other`.
- Risk: the SDK may add a task to the list before `task_started`. So the server links a sub-agent when it builds the summary, not when it stores the list. The server also sends the room list again after a `task_started` for a task that is already in the list.
- Risk: "how long it has run" counts from when the server first saw the task. After a server restart the SDK process is gone, so the list starts empty.
- Assumption: the testing workflow is `Skip-Testing`, so this plan has no tester tasks. The user chose a browser test (web-test skill) after review.
- Out of scope: stopping background shell commands from the Stop button.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Add `BackgroundTaskSchema` (`id`, `kind`, `description`, `subagentId: string \| null`, `startedAt`) in `packages/shared/src/models/background-task.ts`. Add `backgroundTasks: z.array(BackgroundTaskSchema)` to `RoomSummarySchema`. Export both from `index.ts`. | developer | none | The shared package builds. `RoomSummary` has `backgroundTasks`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO | Server: store the raw background list on `Session`, with an empty default everywhere a session is created. In the mapper: save `taskId` on every sub-agent `task_started`, handle `task_updated.patch.is_backgrounded`, and add a pure method that turns a `background_tasks_changed` payload plus the old list into the new list (skip ambient tasks, keep `startedAt`). In `pump`: on that message, replace the list and call `notifyChanged()` only if the list changed; also call `notifyChanged()` after a `task_started` for a task already in the list. `toSummary` fills `subagentId` from the mapper's sub-agents by task id. Clear the list and notify when the query ends. | developer | 1 | Server type check and lint pass. The room summary shows background sub-agents and shell commands while they run, links each sub-agent task to its id, and returns `[]` after all of them end or the query ends. Ambient tasks are not in the list. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/CLEAN_CODE/SEPARATION_OF_CONCERNS.md` |
| 3   | TODO | Web sidebar: new atom `BackgroundTasksBadge` (props: `count`) that shows a `bi-hourglass-split` icon and the count, with `title` and `aria-label` "N background task(s) running". Use it in `SessionList.tsx` next to the busy spinner when `count > 0`. | developer | 1 | The badge shows only when the count is above 0. It looks different from the spinner. It has a tooltip and an accessible label. Web type check and lint pass. | `.claude/guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
| 4   | TODO | Web chat panel: new molecule `BackgroundTasksPill` (props: `tasks`, `onOpenSubagent`). It shows a pill "N background task(s) running" with a tooltip and `aria-label`. On click it opens a react-bootstrap popover list with a kind icon, the description, and the elapsed time (a 1-second timer only while the popover is open). Agent rows with a `subagentId` are buttons that call `onOpenSubagent`. Use it in `ChatPanel.tsx` just above the chat input and connect it to `useSubagentDetailsStore.openDetails`. Reuse an existing duration helper if one exists. | developer | 1 | The pill shows only when the list is not empty. The list shows every task with a correct elapsed time. Clicking an agent row opens its details. Command rows are not clickable. Web type check and lint pass. | `.claude/guides/CLEAN_CODE/ATOMIC_DESIGN.md`, `.claude/guides/CLEAN_CODE/KISS.md` |
| 5   | TODO | Floor: in `room-view.ts`, add a second badge (hourglass color, such as amber) with the `backgroundTasks.length` count, placed next to the sub-agent badge. Cap it at `badgeMax` and hide it at 0. Update it in the same update path as `syncSubagents`. | developer | 1 | The floor badge count matches the sidebar count. It hides at 0. It does not overlap the sub-agent badge. Web type check passes. | `.claude/guides/CLEAN_CODE/DRY.md` |
| 6   | TODO | Run the full workspace type check, lint, and build, then run `graphify update .`. | developer | 2, 3, 4, 5 | All checks pass and the graph is updated. | — |
