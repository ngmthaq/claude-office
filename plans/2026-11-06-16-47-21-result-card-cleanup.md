# Title: Plan — Result card clean-up: two bugs plus low-risk tidy-up

- Classification: bug
- Description: Stop the placeholder task card in history, fix the possible duplicate live card, and tidy the result card code (dead branch, unused exports, conventions, shared enums, Prettier) with no change to behaviour.

---

## Approach Summary / Goal

- **Bug A1, root cause:** in sessions resumed from the CLI, each background sub-agent saves both an `<agent-message>` hand-back (the full report) and a `<task-notification>` whose `<result>` only says "This agent's report was delivered to you as a message from …".
  - `HistoryRepository.pushUserText` turns both into cards.
  - The `task` card also overwrites the sub-agent's Result in the web store.
  - Fix: skip a task notification whose body starts with that placeholder line. The line is a named constant.
- **Bug A2, root cause:** in `SessionService.emitTaskResultCard`, `.then(emitCard).catch(() => emitCard(summary))` sends a second card if the first `emitCard` throws.
  - Fix: use `.then(onText, onReadError)`, so only a failed read falls back to the summary.
- **Tidy-up (B):** remove dead code and unused exports, follow the project's conventions, reuse the shared enums, and run Prettier. No behaviour change, except that history hand-back cards now show the sender name from the envelope.

## Functional Requirements

- **History, CLI-resumed sessions:** no `task` card whose body is the "delivered to you as a message" placeholder. The hand-back card (full report) stays. A sub-agent's Result is never replaced by the placeholder. A task notification with a real result still becomes a card.
- **History hand-back cards:** `senderName` = the envelope's `from` attribute. The card shows **Result** · `<from>`.
- **Live:** at most one result card per task, even if sending the card throws.
- **Everything else** behaves as before: live cards, badges, the link, and history task cards with real results.

## Non-Functional Requirements

- Follow `CODING_CONVENTIONS.md`:
  - utils are classes with static methods
  - helpers come after the main export
  - constants are named
  - comments are 2 lines at most
- The changed files pass `prettier --check`. `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- `apps/server/src/repositories/history.repository.ts` (A1, sender name)
- `apps/server/src/utils/task-notification.util.ts` (placeholder constant, drop `taskId`/`summary` from the type, `buildTitle` and `readTag` become private static)
- `apps/server/src/utils/peer-message.util.ts` (only if needed for the `from` → sender name change)
- `apps/server/src/services/session.service.ts` (A2)
- `apps/server/src/services/sdk-event-mapper.service.ts` (delete the dead `task-notification` branch in `mapPeerText` and the now-unused import and `cardedTasks` read)
- `apps/server/src/repositories/subagent-transcript.repository.ts` (`selectFinalText` no longer exported, helpers after the class, `sleep` → `AsyncUtil.sleep`)
- `apps/server/src/utils/async.util.ts` (add `sleep`)
- `apps/web/src/utils/report-status.util.ts` → a `ReportStatusUtil` class with `parse`, `ReportStatusValue` no longer exported. Update its callers (`PeerMessageCard.tsx`, `ui.config.ts`).
- `packages/shared/src/events/peer-message.ts` (export the `source`/`taskStatus` enum schemas), and `apps/web/src/dtos/chat-item.dto.ts` (reuse them)

## Risks & Assumptions

- **A1 relies on harness text:** the placeholder is an SDK/harness sentence that may change. If it does, the placeholder card simply comes back. That's harmless, and better than hiding real results.
- **Dead branch:** removing the `mapPeerText` task branch assumes the SDK keeps not sending that user message live, which the research and three browser runs showed. The live transcript path doesn't depend on it.
- **Testing:** the project is `Skip-Testing`, so the plan has no tester task. The developer replays real sessions through `HistoryRepository.loadRoomEvents` (`2afe9c40`, this CLI session with hand-backs, and `87afed1e`) and reports placeholder card counts before and after. After review, I suggest one `/web-test` visual check.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | A1: add a named placeholder constant. In `pushUserText`, skip (push nothing) a task notification whose body starts with it. Set history hand-back `senderName` from the envelope's `from`. | developer | none | Replay of `2afe9c40` and `87afed1e`: 0 placeholder `task` cards. Hand-back cards keep the full report and get `senderName`. Task cards with real results are unchanged in count. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | A2: `emitTaskResultCard` uses `.then(onText, onReadError)`. | developer | none | A throwing `emitCard` cannot trigger a second emit (shown by reading the code or a tiny in-memory check). | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | Server tidy-up: delete the dead `mapPeerText` task branch and its unused import and read. Drop `TaskNotification.taskId`/`summary`. Make `buildTitle` and `readTag` private static. Stop exporting `selectFinalText`. Put helpers after the main class. Move `sleep` → `AsyncUtil.sleep`. | developer | 1, 2 | Typecheck and lint pass. No other callers broken. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | TODO   | Web and shared tidy-up: `ReportStatusUtil.parse` class, with `ReportStatusValue` no longer exported and callers updated. Export the `source`/`taskStatus` enums from `peer-message.ts` and reuse them in `chat-item.dto.ts`. | developer | none | Typecheck passes. Same badge results for the old samples. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | TODO   | Run `prettier --write` on the changed files only. Then `pnpm typecheck`, `pnpm lint`, `pnpm build` and `graphify update .`. | developer | 1–4 | `prettier --check` is clean on the changed files. All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
