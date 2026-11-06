# Title: Plan — Fix sub-agent result card (task notifications and bold status)

- Classification: bug
- Description: Show `<task-notification>` results (live and history) in the same card, linked to the sub-agent through `<tool-use-id>`. Put the full report in the details panel. Make the status parser accept bold `**Status:**`, and let wide tables scroll.

---

## Approach Summary / Goal

- **Root cause, TC-07/08:** sessions started through the SDK deliver a background sub-agent's result as a user message with `origin.kind: 'task-notification'` and a `<task-notification>` text block. They never send an `<agent-message>` peer hand-back. `mapPeerText` only handles `peer`, and `PeerMessageUtil` only knows `<agent-message>`. So the result is dropped live, and shows as a raw bubble in history.
- **Root cause, TC-03:** `report-status.util.ts` uses `status\s*:\s*(…)`, which fails on markdown emphasis (`**Status:** complete`).
- **Fix:** a new server `TaskNotificationUtil.parse(text)` reads `<task-id>`, `<tool-use-id>`, `<status>`, `<summary>` and `<result>`. Both the live mapper and the history loader use it to emit the existing `peer_message` event, extended with a `source` (`handback` / `peer` / `task`), a `title` and a `taskStatus`. `subagentId` is the `<tool-use-id>`, which is the web's sub-agent id, so the link works without any server state. When a `task` card arrives for a tracked sub-agent, the web store also writes the full report into that sub-agent's `result`.
- **Goal:** the card appears live in app-started sessions with a working "Open sub-agent" link, the badge is right for bold status lines, the raw `<task-notification>` bubbles in history are gone, and wide tables scroll.

## Functional Requirements

- **Live:** after a background sub-agent finishes, a collapsed card appears.
  - Its title is "Result: `<description>`", taken from `<summary>` `Agent "<description>" finished`.
  - If the summary has a different shape, the title falls back to "Sub-agent result" for Agent tasks, or to the summary text for other tasks (see Risks).
  - Its body is the `<result>` markdown. If there is no `<result>`, the body is the summary.
- **Badge:** the report's own status (complete / incomplete / blocked) when one is found. Otherwise `<status>` is mapped: `completed` → green "done", `failed` → red "failed", `killed` → grey "stopped".
- **Link:** "Open sub-agent" shows when `<tool-use-id>` matches a tracked sub-agent, and it opens the details panel.
- **Details panel:** the sub-agent's Result shows the full `<result>` markdown, not "Agent … finished".
- **History:** `<task-notification>` text becomes the same card (with no link, because history has no sub-agent items). No raw `<task-notification>` user bubbles remain.
- **Bold status:** `parseReportStatus` reads `**Status:** complete`, `**Status**: complete`, `_Status:_ complete`, plus every format that already works.
- **Tables:** wide tables in the card scroll sideways inside the card. The page does not scroll sideways.
- **`<agent-message>` hand-backs:** work exactly as before.

## Non-Functional Requirements

- No raw HTML rendering. The `<note>` and `<output-file>` path are never shown.
- Parsers are pure helpers in `utils/`, with markers as named constants.
- `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Modify `packages/shared/src/events/peer-message.ts`: replace `isHandback` with `source: 'handback' | 'peer' | 'task'`, and add `title: string | null` and `taskStatus: 'completed' | 'failed' | 'killed' | null`
- Create `apps/server/src/utils/task-notification.util.ts`
- Modify `apps/server/src/utils/peer-message.util.ts` (only if it needs the new `source` shape)
- Modify `apps/server/src/services/sdk-event-mapper.service.ts`: handle `origin.kind === 'task-notification'` (and plain `<task-notification>` text)
- Modify `apps/server/src/repositories/history.repository.ts`: detect `<task-notification>` before the peer envelope
- Modify `apps/web/src/dtos/chat-item.dto.ts`, `apps/web/src/hooks/store/useChatStore.ts` (the peer item, and updating the matching sub-agent's `result`)
- Modify `apps/web/src/utils/report-status.util.ts`, `apps/web/src/configs/ui.config.ts` (the done / failed / stopped badge colours and labels)
- Modify `apps/web/src/components/atoms/PeerMessageCard.tsx`, `apps/web/src/components/organisms/MessageList.tsx`
- Modify the existing web stylesheet (table scroll inside `.peer-card`)

## Risks & Assumptions

- **Background shell tasks:** these also send `<task-notification>` (for example `Background command "…" failed`). They get the same card, with the summary as the title and the `<status>` badge. "Open sub-agent" only shows when the id is a tracked sub-agent.
- **Repeated notifications:** a task can notify more than once (the harness note says so). Each one shows its own card, and the latest one updates the details panel.
- **Old `subagent_finished` event:** the live system `task_notification` still sends it with the summary. The full report then replaces that summary when the user-message notification arrives. If that message never arrives, the panel keeps the summary, as it does today.
- **Regression tests:** the project's Testing Workflow is `Skip-Testing`, and there is no test runner, so the plan has no tester task. Instead, the developer checks the parsers on real samples (`d31d658b-….jsonl` for the task notification, and the "Party-mode server layered structure" session for bold status). After review, I suggest re-running `/web-test` on TC-03, TC-07 and TC-08.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Extend `peer-message.ts` (`source`, `title`, `taskStatus` instead of `isHandback`), and update the current producers and consumers to compile. | developer | none | Typecheck passes. Hand-backs still emit `source: 'handback'`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | `task-notification.util.ts`: `parse(text)` returns `{taskId, toolUseId, status, summary, title, body} \| null`. The title comes from `Agent "…" finished`, and the body is `<result>` or the summary. Use it in `mapPeerText` (live: `origin.kind === 'task-notification'` or the text has `<task-notification>`) and in `history.repository.ts` `pushUserText` (before the peer check). | developer | 1 | On `d31d658b-….jsonl`: title "Result: List files in events folder", `subagentId: toolu_01VY…`, the body starts with "The folder `packages/shared/src/events` exists…", no `<note>` or path. Live mode emits one `peer_message` with `source: 'task'`. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
| 3   | TODO   | Web store: for a `peer_message` with `source: 'task'` whose `subagentId` matches a `subagent` item, set that item's `result` to the body (and `status: 'done'` / `'error'` from `taskStatus`, if it is still working). | developer | 1 | The details panel shows the full report after a live run. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | TODO   | `report-status.util.ts`: allow `*`/`_` around `Status` and after the colon. Add the done / failed / stopped badge colours and labels in `ui.config.ts`. In `PeerMessageCard`, choose the title and badge per `source` (task: report status, then `taskStatus`). | developer | 1 | Samples pass: `**Status:** complete` → complete, `**Status**: blocked` → blocked, plus the old samples. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | TODO   | CSS: tables inside `.peer-card` scroll sideways (`display:block; overflow-x:auto` or a wrapper). Then run `pnpm typecheck`, `pnpm lint`, `pnpm build` and `graphify update .`. | developer | 2, 3, 4 | No clipping. All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
