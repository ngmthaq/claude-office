# Title: Plan — Fallback card for events the chat does not show yet

- Classification: feature
- Description: Show every dropped Claude event as a closed fallback card, or inside a grouped thin row if it is internal noise. Keep both after a reload or resume.

---

## Approach Summary / Goal

- **Goal:** nothing Claude sends is hidden from the user. Events that already have a view stay the same.
- The server sorts each dropped event into one of two groups. Important events become a `system_event` and show as a card. Events on a fixed internal list become an `internal_events` group and show as a thin grey row with a count.
- The server joins internal events that come in a row into one stored item. This keeps them from pushing real messages out of the 2,000-event room buffer.
- Live events and history use the same event types and the same web reducer, so cards show in the same order after a reload.

## Functional Requirements

- An event with no view and not on the internal list shows one card with its name and content.
- Cards always start closed, and the user can open and close them.
- Card content shows as Markdown, as indented JSON, or as plain text with line breaks kept.
- `/compact`, manual or automatic, shows one card with the trigger and the tokens before and after. It does not show the summary text, and the "Compacted" output does not add a second card.
- `/context` and `/usage` output shows in a card, with terminal color codes removed.
- These show as an error card: a `result` with an error, command stderr, a failed compact, and any event whose name holds `error`.
- Internal events in a row show as one row, such as "14 internal events". Clicking it shows each name and a short detail.
- After a reload or resume, the same cards show in the same order, with no raw `<local-command-…>` text.
- Messages, tool calls, sub-agents, and permissions show as today, with no extra card.

## Non-Functional Requirements

- The internal list is one constant in the server config. Users cannot change it.
- A successful `result` shows no card, because the assistant message already shows it.
- Stored data has size limits: normal truncation for card content, 500 characters per internal detail, and the last 50 items per group. The count stays correct when old items are dropped.
- `uuid` and `session_id` do not show in cards or rows.

## Files in Scope

| Area | Files |
| --- | --- |
| Shared (create) | `packages/shared/src/events/system-event.ts`, `packages/shared/src/events/internal-events.ts` |
| Shared (change) | `packages/shared/src/events/room-event.ts`, `packages/shared/src/events/index.ts` |
| Server (create) | `apps/server/src/configs/system-events.config.ts`, `apps/server/src/utils/internal-events.util.ts`, `apps/server/src/utils/sdk-event-content.util.ts` |
| Server (change) | `apps/server/src/configs/limits.config.ts`, `apps/server/src/services/sdk-event-mapper.service.ts`, `apps/server/src/services/session.service.ts`, `apps/server/src/services/event-bus.service.ts`, `apps/server/src/repositories/history.repository.ts` |
| Web (create) | `apps/web/src/components/atoms/SystemEventCard.tsx`, `apps/web/src/components/atoms/InternalEventsRow.tsx`, `apps/web/src/utils/event-content.util.ts` |
| Web (change) | `apps/web/src/dtos/chat-item.dto.ts`, `apps/web/src/hooks/store/useChatStore.ts`, `apps/web/src/services/ws-client.service.ts`, `apps/web/src/components/organisms/MessageList.tsx`, `apps/web/src/configs/ui.config.ts`, `apps/web/src/styles/chat.css` |

## Risks & Assumptions

- **Not checked yet:** I have no real sample of `/context` or `/usage` in this app. If the SDK marks them as terminal-only, the app hides them from autocomplete and they may send no output. Task 6 checks this. If they send nothing, I will tell you before closing the work.
- **Limit after a server restart:** Claude does not save most internal events to its transcript. Page reloads keep them while the server runs. After a server restart or a resume, the row shows only the events that were saved. Cards are not affected, because their events are saved.
- **History format:** the transcript uses different names than the live stream, such as `local_command` and `local_command_output`. Task 3 reads command output from one source only, so no duplicates show. The developer must check the real shape that `includeSystemMessages` returns.
- **Internal list (my choice from your answer):** `init`, `status` (unless a compact failed), `hook_started`, `hook_progress`, `hook_response`, `tool_progress`, `task_progress`, `task_updated`, `background_tasks_changed`, `session_state_changed`, `thinking_tokens`, `rate_limit_event`, `api_retry`, `commands_changed`, `files_persisted`, `control_request_progress`, `plugin_install`, `tool_use_summary`, `prompt_suggestion`, `memory_recall`, `permission_denied`, `worker_shutting_down`, `turn_duration`, `stop_hook_summary`, `away_summary`, `bridge_status`, and `informational` at level `info`. Any event not on this list gets a card, including new ones in future SDK versions.
- **Markdown check is a best guess:** the web app looks for headings, lists, code fences, tables, bold text, and links. Other text shows as plain text.
- **Tests:** the project uses Skip-Testing, so this plan has no tester tasks.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Add `system_event` and `internal_events` Zod schemas. Add both to `RoomEventSchema` and the events index. | developer | none | Both types are exported from `@claude-office/shared`. Shared typecheck passes. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server live path: add the internal list and limits. Map all dropped messages in `mapSdkMessage` and `mapSystem`, including `init` and `rate_limit_event` in `pump`. Add the compact, error, and ANSI handling. Join internal events in `EventBusService`. | developer | 1 | Each dropped SDK message gives one card or one group entry. Messages with a view give no extra event. A run of internal events is one buffer item. The compact card shows numbers only. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | Server history path: call `getSessionMessages` with `includeSystemMessages`. Map system messages and `<local-command-stdout>` / `<local-command-stderr>` text with the same rules. Drop the compact summary text. | developer | 1, 2 | A transcript with `/compact` replays one card in the right place. No wrapper or summary text shows. No duplicate cards show. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | Web state: add `system` and `internal` chat items. Add the reducer cases, merging an internal event into the last item when that item is internal. Route both events in `ws-client.service.ts`. | developer | 1 | Live and replayed events give the same items. Web typecheck passes with no unhandled event type. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | DONE | Web views: build `SystemEventCard` (closed `details`, error style, Markdown, JSON, or plain text) and `InternalEventsRow`, and add the format util. Wire both into `MessageList`, with text in `ui.config.ts` and styles in `chat.css`. | developer | 4 | Each format shows correctly. Cards start closed. Error cards look like errors. The row shows the count and expands to names and details. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | DONE | Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`. Then run `/compact`, `/context`, and `/usage` once in the running app and report the raw SDK messages for each. | developer | 2, 3, 4, 5 | All three checks pass. The result for each command is reported, including any command that sends no output. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
