# Title: Plan — Fallback card history fix (read cards from the transcript file)

- Classification: feature
- Description: Bring back all fallback cards after a server restart or resume by reading system rows directly from Claude's transcript file.

---

## Approach Summary / Goal

- **Goal:** meet the issue's last open criterion: after a reopen or resume, the same cards show in the same order.
- A new small repository finds `<sessionId>.jsonl` under `~/.claude/projects/*/` and returns the system rows in file order. Searching by session id means we do not need to copy Claude's rule for folder names.
- History merges these rows with the SDK messages by their place in the file.
- If the file cannot be read, history works as it does now.

## Functional Requirements

- After a server restart, `/context` and `/usage` cards show with the same name and content as live.
- The compact card shows the trigger and token numbers, not "Conversation compacted".
- Cards from before a compact also return, in order, before the compact card. Chat messages from before a compact stay hidden, as today.
- Saved internal events show in grouped rows, using the same fixed list.
- No duplicates show. When the file is readable, command output comes only from the system rows.
- Empty output (such as `/clear`), sub-agent rows, and raw wrapper text do not show.

## Non-Functional Requirements

- The session id must be a valid UUID before it is used in a path.
- A missing or broken file, or a broken line, never fails history. The server logs the error name only, never the content.
- The reader goes through the file line by line and parses only system rows, so large sessions stay fast.

## Files in Scope

- Create: `apps/server/src/repositories/transcript-system-rows.repository.ts`
- Change: `apps/server/src/repositories/history.repository.ts`, `apps/server/src/services/sdk-event-mapper.service.ts`, `apps/server/src/utils/sdk-event-content.util.ts`, `apps/server/src/main.ts`, `apps/web/src/hooks/store/useChatStore.ts`, `apps/web/src/configs/ui.config.ts`
- Already changed in round 1, keep: `packages/shared/src/events/server-event.ts` (outside the first plan's list, but the server needs it to typecheck)

## Risks & Assumptions

- The transcript format is private to Claude and can change. If it changes, cards fall back to today's limited view, and chat still works.
- The reader assumes the default `~/.claude` folder, like `command.repository.ts` does today.
- The sorting rule moves from the mapper service to a util, because a repository must not import a service. Live behavior stays the same.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 7 | DONE | Move the internal-or-card rule to `SdkEventContentUtil`, and use it in the mapper. Move `INTERNAL_ITEMS_KEEP_MAX` from the store to `ui.config.ts`. | developer | none | Live cards and rows are unchanged. Typecheck passes. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 8 | DONE | Add `TranscriptSystemRowsRepository`, and pass it to `HistoryRepository` in `main.ts`. | developer | 7 | Returns the non-sub-agent system rows in file order, with their place among the file's message rows. Returns null on a missing or broken file. Rejects an invalid session id. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 9 | DONE | Merge the rows into `loadRoomEvents`. Map `compact_boundary` with numbers, `local_command` with name `/<command>`, and other rows with the shared rule. Keep today's path as the fallback. | developer | 8 | The real test session shows `/context`, `/usage`, and the compact card with numbers after a restart. No duplicates and no wrapper text show. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 10 | DONE | Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, and the secret scan. Then I test in the browser again, including a server restart, and also a session with no compact. | developer | 9 | All checks pass. The restart test matches the live order for cards. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
