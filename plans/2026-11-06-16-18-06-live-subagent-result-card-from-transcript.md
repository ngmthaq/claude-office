# Title: Plan — Live sub-agent result card from the sub-agent transcript

- Classification: bug
- Description: When the live system `task_notification` arrives, read the sub-agent's final answer from its transcript with the SDK's `getSubagentMessages`. Then emit the same `peer_message` (`source: 'task'`) card the history path already makes. Background shell tasks get a card built from the summary.

---

## Approach Summary / Goal

- **Root cause:** the app's live SDK stream never delivers the harness-injected `<task-notification>` user message. It is written only to the transcript, so `mapPeerText`'s task branch never runs live. The live system `task_notification` (`SDKTaskNotificationMessage`) does arrive, but it has no result text. The text lives in the sub-agent transcript: `~/.claude/projects/<project>/<sessionId>/subagents/agent-<task_id>.jsonl`. Its last assistant `text` block is the full report. This was checked on 2 real sessions.
- **Fix:**
  - A new `SubagentTranscriptRepository` calls `getSubagentMessages(sessionId, task_id, { dir: session.folder })` and returns the last assistant text. It retries a few times (about 1 second in total) in case the file hasn't been flushed yet.
  - In `SessionService.pump`, when a system `task_notification` maps to a `subagent_finished` event, it starts a non-blocking read. It then emits a `peer_message` (`source: 'task'`) through the event bus. A pure mapper helper builds that event.
  - If there's no text after the retries, or the task is not a sub-agent (a background shell task), the card uses the summary instead.
- **Goal:** in app-started sessions, a "Result: …" card appears live after a background sub-agent finishes. "Open sub-agent" works, and the details panel shows the full report. That is the web store change from the last round.

## Functional Requirements

- **Live sub-agent card:** after a background sub-agent finishes, one `peer_message` card appears.
  - `source: 'task'`
  - `subagentId` = `tool_use_id`
  - `title` comes from the summary, using the same rule as history: "Result: `<description>`"
  - `taskStatus` comes from `status` (`completed` → completed, `failed` → failed, `stopped` → killed)
  - The body is the sub-agent's final answer.
- **Retry:** if the transcript has no final assistant text yet, retry (`TRANSCRIPT_READ_RETRIES` × `TRANSCRIPT_READ_DELAY_MS`, about 1 second in total). Then fall back to the summary as the body.
- **Shell tasks:** a live `task_notification` that does not match a tracked sub-agent (a background shell task) gets a summary card right away, with no transcript read.
- **No blocking:** the read never blocks the stream loop or turn handling. A read error is logged (with the error name only, no content) and falls back to the summary.
- **Unchanged:** history cards, hand-back cards and `subagent_finished` events behave as before.

## Non-Functional Requirements

- The read goes through the SDK API (`getSubagentMessages`) from the `~/.claude` store, never the temp `output_file` path.
- Retry counts and delays are named constants in `configs/limits.config.ts`.
- Layering: the SDK call lives in a repository, events are built in the mapper, and the orchestration happens in `session.service.ts`. The repository is wired in `main.ts`, and instances are named with the full class name in camelCase.
- `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Create `apps/server/src/repositories/subagent-transcript.repository.ts`
- Modify `apps/server/src/services/session.service.ts`: start the read after `subagent_finished`, and emit the card
- Modify `apps/server/src/services/sdk-event-mapper.service.ts`: a pure `buildTaskResultEvent(roomId, notification, body)` helper
- Modify `apps/server/src/utils/task-notification.util.ts`: make the title builder public for reuse
- Modify `apps/server/src/configs/limits.config.ts`: the retry constants
- Modify `apps/server/src/main.ts`: wire the new repository into `SessionService`

## Risks & Assumptions

- **Flush timing:** whether the final transcript line is written before the system event is untested. The retry and the summary fallback cover it.
- **No `sessionId` yet:** if `session.sessionId` is still null (it shouldn't be by then), we fall back to the summary card.
- **Possible double cards:** if the SDK ever starts echoing the user-message notification live, the old live branch in `mapPeerText` could make a second card. That doesn't happen today. To be safe, the session keeps a small set of task ids that already have a card, and skips repeats.
- **Testing:** the project is `Skip-Testing`, so the plan has no tester task. The developer runs the repository against the 2 real sessions (`d31d658b`, `7eddc0f5`) to check the extracted text. After review, I'll re-run `/web-test` TC-07 and TC-08.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | `SubagentTranscriptRepository.readFinalText(sessionId, agentId, dir)`: calls `getSubagentMessages`, finds the last assistant message's text blocks, and retries per the config constants. Returns the text, or null. | developer | none | On `d31d658b` / `afabe91756dca0c2e` it returns text starting "The folder `packages/shared/src/events` exists…". On `7eddc0f5` it returns that session's report. An unknown id returns null after the retries. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | Mapper `buildTaskResultEvent(roomId, notification, body)` (pure). It uses `TaskNotificationUtil`'s title rule, maps the status, and sets `subagentId = tool_use_id ?? null`. | developer | none | Typecheck passes. For the sample summary the event has title "Result: List files in events folder". | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | `SessionService.pump`: on a system `task_notification`, if the mapped events include `subagent_finished` for that `tool_use_id`, start a non-blocking read (task 1) and then emit the event (task 2). Otherwise emit the summary card right away. Skip task ids that already have a card. Catch errors and log the error name only. Wire the repository in `main.ts`. | developer | 1, 2 | The stream loop is not awaited on the read. Typecheck, lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
