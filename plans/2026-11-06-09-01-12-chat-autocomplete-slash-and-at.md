# Title: Plan — Autocomplete for `/` commands and `@` files in the chat box

- Classification: feature
- Description: The server sends a list of commands and a list of files for the room's folder; the chat box shows a filtered popup and inserts the picked item as text.

---

## Approach Summary / Goal

- Add two new client → server requests: `commands_list` and `files_list` (both with `roomId`). The server replies with `commands` and `files` events.
- Commands: use SDK `query.supportedCommands()` when the room has a live query. If not, scan `.claude/commands/*.md` and `.claude/skills/*/SKILL.md` in the room folder and in `~/.claude`. Hide terminal-only commands (from the SDK `init` message field `terminal_slash_commands`).
- Files: run `git ls-files` (plus untracked, not ignored) in the room folder. If it is not a git repo, walk the folder and skip `node_modules`, `.git`, `dist`, `build`. Add folders too. Cap the list.
- The web app asks for each list once when the popup opens, and filters it in the browser as the user types. Picking an item inserts text only. The user still presses Enter to send.

## Functional Requirements

1. Typing `/` at the very start of the text box opens the command popup.
2. Typing `@` at the start or after a space/new line opens the file popup.
3. The popup filters by the text after the trigger (case-insensitive, matching anywhere in the name/path; prefix matches come first).
4. Each command row shows `/name`, the argument hint (if any), and the description. Each file row shows the relative path; folders end with `/`.
5. Keys while the popup is open: ↑/↓ move, Enter or Tab picks, Esc closes. Enter does **not** send the message while the popup is open.
6. Mouse click on a row picks it.
7. Pick `/` → replace the token with `/name ` . Pick `@` → replace the token with `@relative/path ` .
8. The popup closes when the cursor leaves the token, on space after the token, or on Esc.
9. Terminal-only commands are hidden.
10. Works for live, new, and closed rooms (closed/new rooms use the disk fallback for commands).
11. Empty or failed list → the popup shows a short "No matches" / "Could not load" line. It never blocks typing.

## Non-Functional Requirements

- Security: the file list only covers paths inside the room folder (checked with the existing `resolveFolder`). Never return file contents. Never return files outside home.
- Speed: max 5000 file entries; the server caches each room's file list for 30 seconds. `git ls-files` runs with a timeout (about 3 s). Popup shows at most 50 rows.
- Uses zod schemas in `packages/shared` for all new events (project rule).
- Logs only counts and error codes, never file names or prompts.

## Files in Scope

- `packages/shared/src/session-events.ts` — new schemas and types: `CommandsListEvent`, `CommandsEvent`, `FilesListEvent`, `FilesEvent`, `SlashCommandEntry`, `FileEntry`.
- `packages/shared/src/events.ts` — add the new schemas to the client/server unions.
- `apps/server/src/sessions/command-catalog.ts` (new) — disk scan of commands and skills.
- `apps/server/src/sessions/file-index.ts` (new) — git list / folder walk, cap, cache.
- `apps/server/src/sessions/session-manager.ts` — new `listCommands(roomId)` and `roomFolder(roomId)`; save `terminal_slash_commands` from the `init` message.
- `apps/server/src/ws/ws-route.ts` — handle `commands_list` and `files_list`.
- `apps/web/src/features/chat/use-autocomplete-store.ts` (new) — cached lists per room, loading/error state.
- `apps/web/src/features/chat/autocomplete.ts` (new) — pure helpers: find the active token at the cursor, filter and rank, build the new text.
- `apps/web/src/features/chat/AutocompletePopup.tsx` (new) — the popup list.
- `apps/web/src/features/chat/ChatInput.tsx` — wire trigger detection, keys, and the popup.
- `apps/web/src/features/connection/ws-client.ts` (or wherever server events are routed) — route `commands` / `files` events to the new store.
- `apps/web/src/styles.css` — popup styles (pixel look like the rest of the app).

## Risks & Assumptions

- Assumption: Claude Code handles `/command` and `@path` text in a prompt sent through the SDK, the same way as in the terminal. If a built-in command does not work through the SDK, it still shows in the list (we only hide the terminal-only ones).
- Assumption: the `@` path is relative to the room folder.
- Risk: `supportedCommands()` may wait for the query to start. We will call it only when the query is live, with a short timeout, and fall back to disk on timeout.
- Risk: very large repos are cut at 5000 entries. Files past the cap do not show.
- Assumption: no new libraries are needed.
- Skip-Testing: no tester task. I will check the work by type-check, lint, and code review. Playwright check is `Ask-User` — I will ask you after the review if you want a browser test.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1 | DONE | Shared + server: add the 4 event schemas; build `command-catalog.ts` and `file-index.ts`; add `listCommands` / folder lookup in `session-manager.ts` (SDK first, disk fallback, hide terminal-only); handle `commands_list` and `files_list` in `ws-route.ts` | developer | none | `pnpm -r typecheck` and lint pass. `commands_list` returns SDK commands for a live room and disk commands for a closed room. `files_list` returns relative paths inside the folder only, max 5000, cached 30 s, non-git fallback works. Unknown room → `error` event. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/SECURITY_SCANNER/` |
| 2 | DONE | Web: `autocomplete.ts` helpers, `use-autocomplete-store.ts`, `AutocompletePopup.tsx`, wire into `ChatInput.tsx`, route new events, add CSS | developer | task 1 | Functional Requirements 1–11 all work. Enter does not send while popup is open. Typecheck and lint pass. No `any`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/ATOMIC_DESIGN.md` |
