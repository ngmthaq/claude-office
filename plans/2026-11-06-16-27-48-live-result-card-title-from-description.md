# Title: Plan — Live result card title from the sub-agent description

- Classification: bug
- Description: Build the live card title from the sub-agent's `description`, kept in the mapper state, instead of from the live `summary`. Give shell tasks a short one-line title, and add a debug log of when the card is emitted.

---

## Approach Summary / Goal

- **Root cause:** `SdkEventMapperService.buildTaskResultEvent` sets `title: TaskNotificationUtil.buildTitle(notification.summary)`. In the transcript, `<summary>` is `Agent "<description>" finished`. But the live system `task_notification.summary` holds the sub-agent's result text. `buildTitle` doesn't recognise it, so it returns the summary itself, and the whole report becomes the card header.
- **Fix:**
  - Store `description` in `SubagentState` when the sub-agent starts.
  - In `SessionService.pump`, read the description for that `tool_use_id` (or matching `task_id`) **before** `mapSdkMessage` removes the entry. Pass it to `buildTaskResultEvent`.
  - The title rule becomes:
    - a sub-agent with a description gets "Result: `<description>`"
    - a sub-agent without one gets `null` (the web shows "Sub-agent result")
    - a non-sub-agent task gets the first line of `summary`, cut to 80 characters with "…"
  - Add one debug log with ids and timing only.
- **Goal:** the live card header reads "Result: List files in events folder". History cards keep their current titles.

## Functional Requirements

- **Live sub-agent card:** title "Result: `<description>`". If the description is empty, the title is `null`, and the card shows "Sub-agent result".
- **Live shell-task card:** title is the first line of `summary`, at most 80 characters, ending in "…" when cut.
- **Unchanged:** body, badge, link, details panel update and duplicate guard. History cards (`TaskNotificationUtil.parse`) keep the `<summary>`-based title.
- **Debug log:** a `debug`-level log when the live card is emitted, with `roomId`, `taskId`, `readMs` (how long the transcript read took) and whether the transcript text was used. No content in the log.

## Non-Functional Requirements

- `TASK_TITLE_MAX` (80) is a named constant in `configs/limits.config.ts`.
- `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Modify `apps/server/src/repositories/session-store.repository.ts`: add `description: string` to `SubagentState`
- Modify `apps/server/src/services/sdk-event-mapper.service.ts`: store `description` in `startSubagent`, add a public lookup for a sub-agent's description by `tool_use_id`/`task_id`, and add a `description` parameter to `buildTaskResultEvent` with the new title rule
- Modify `apps/server/src/services/session.service.ts`: capture the description before mapping, pass it on, and add the debug log
- Modify `apps/server/src/configs/limits.config.ts`: `TASK_TITLE_MAX`

## Risks & Assumptions

- **Description timing:** this assumes the sub-agent entry is still in `MapperState.subagents` when the system `task_notification` arrives, which is the same lookup `mapSystem` already uses. If it's missing, the title falls back to `null` ("Sub-agent result"), never to the report text.
- **Testing:** the project is `Skip-Testing`, so the plan has no tester task. The developer checks the title rule with a small in-memory call. After review, I'll re-run `/web-test` TC-07.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Store `description` in `SubagentState` (`startSubagent`). Add a public `subagentDescription(state, toolUseId, taskId)` that returns the description or null, using `findSubagentId`. | developer | none | Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | `buildTaskResultEvent(roomId, notification, body, description: string \| null, isSubagent: boolean)`. Title: sub-agent with a description → "Result: …". Sub-agent without one → null. Otherwise → the first line of the summary, cut to `TASK_TITLE_MAX` with "…". | developer | 1 | In-memory checks: (`desc` "List files in events folder", sub-agent) → "Result: List files in events folder". (empty, sub-agent) → null. (shell, a 200-char summary) → ≤ 80 chars ending "…". | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | `SessionService.pump`: for a system `task_notification`, read the description before `mapSdkMessage`, and pass it on (plus `isSubagent`) through `emitTaskResultCard`. Add the debug log (`roomId`, `taskId`, `readMs`, `usedTranscript`). | developer | 1, 2 | Typecheck, lint and build pass. The log has ids and timing only. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
