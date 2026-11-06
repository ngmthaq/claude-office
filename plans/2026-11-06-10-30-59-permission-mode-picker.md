# Title: Plan — Permission mode picker (auto edit) in the chat input bar

- Classification: feature
- Description: Add a 3-way permission mode picker (Ask / Accept edits / Auto) for each room. It is saved in SQLite and sent to the Agent SDK.

---

## Approach Summary / Goal

- Each room gets a `permissionMode` field: `default`, `acceptEdits`, or `auto`. It is stored in a new `rooms.permission_mode` column.
- The server passes the mode to `query({ options: { permissionMode } })` when a session starts. When the user changes the mode while a session runs, the server calls `query.setPermissionMode(mode)`, so no restart is needed.
- The web app shows a small dropdown directly under the Send button (icon-only React-Bootstrap Dropdown, same size as the Send button; textarea stretches to fit) in `ChatInput`. It reads the mode from the room summary and sends a new `room_permission_mode` client event.
- Goal: the user can turn auto edit on or off per room, and the choice stays after a restart.

## Functional Requirements

- The chat input area shows a picker directly under the Send button (icon-only React-Bootstrap Dropdown, same size as the Send button; textarea stretches to fit), with 3 options: "Ask permission" (`default`), "Accept edits" (`acceptEdits`), "Auto" (`auto`).
- A new room starts in `default`.
- A change applies right away to a running session (the next tool calls). A session that is not running uses the new mode the next time it starts.
- The mode is saved per room in SQLite. It stays after a server restart and when the room is reopened or resumed.
- Permission cards that are already open stay open. The user still answers them.
- If the SDK rejects the mode (for example, `auto` is not available for the account), the server keeps the old mode, saves nothing, and shows an error in the chat.
- Every connected browser tab shows the new mode (through the room summary broadcast).

## Non-Functional Requirements

- The server checks the client event with zod. Only the 3 allowed values are accepted. `bypassPermissions` and `plan` can never be set from the UI.
- The server logs each mode change (room id + mode) with the existing logger.
- The picker has an `aria-label` and works with the keyboard (it is a native `<select>` through React-Bootstrap `Form.Select`).
- Follow the existing patterns: migration file, `RoomsRepo` method, `SessionManager` method, `ws-route` case. This is the same shape as `room_rename`.

## Files in Scope

- `packages/shared/src/session-events.ts`: add `PermissionModeSchema`, add `permissionMode` to `RoomSummarySchema`, add `RoomPermissionModeEventSchema` and its type
- `packages/shared/src/events.ts`: add the new event to the client event union
- `apps/server/src/db/migrations/0004_room_permission_mode.sql`: new file
- `apps/server/src/db/rooms-repo.ts`: add the `permissionMode` column, field, and `setPermissionMode()`
- `apps/server/src/sessions/session-manager.ts`: store the mode on `Session`, pass it in `ensureQuery`, add `setPermissionMode(roomId, mode)`, put the mode in the room summary
- `apps/server/src/ws/ws-route.ts`: handle `room_permission_mode`
- `apps/web/src/features/chat/ChatInput.tsx`: add the picker
- `apps/web/src/styles.css`: only if the picker needs small sizing styles

## Risks & Assumptions

- **Assumption:** If resuming an old session makes a new room row, that room starts in `default`. If the resume reuses the row, it keeps its mode.
- **Assumption:** Labels are "Ask permission / Accept edits / Auto".
- **Risk:** `auto` mode depends on the account and model. The SDK may reject it or fail. The plan handles this with an error message and keeps the old mode.
- **Risk:** In `auto` mode, a model approves most tool calls, Bash included. This is the user's choice, but it gives less control than `acceptEdits`.
- **Out of scope:** syncing the picker when Claude changes the mode by itself (for example, plan mode). `ExitPlanMode` is already blocked in Claude Office.
- **Testing:** `PROJECT_OVERVIEW.md` says `Testing Workflow: Skip-Testing`, so the plan has no tester task. The developer runs `pnpm typecheck` and lint.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Shared: add `PermissionModeSchema` (`default`/`acceptEdits`/`auto`), add `permissionMode` to `RoomSummarySchema`, add the `room_permission_mode` client event `{ roomId, mode }`, and add it to the client union in `events.ts` | developer | none | Types export. A bad mode value fails zod parsing. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | DB: add migration `0004_room_permission_mode.sql` (`permission_mode TEXT NOT NULL DEFAULT 'default'`). In `RoomsRepo`, add the column, the `permissionMode` field, and `setPermissionMode(id, mode)` | developer | task 1 | Old rooms read as `default`. `setPermissionMode` saves the value, and `get()` returns it. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | Server: in `SessionManager`, load the mode into `Session`, pass `permissionMode` in `ensureQuery`, add `setPermissionMode(roomId, mode)` (calls `query.setPermissionMode` if running, saves to DB on success, logs, broadcasts the summary, emits an error on failure), and add `permissionMode` to the room summary. Handle the event in `ws-route.ts` | developer | task 1, 2 | A change while running calls the SDK, then saves. On SDK failure, the old mode stays and the chat shows an error. A change while stopped saves only. A new query starts with the saved mode. Open permission cards are not touched. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 4   | DONE   | Web: add a small React-Bootstrap `Form.Select` picker in its own row directly under the Send button (icon-only React-Bootstrap Dropdown, same size as the Send button; textarea stretches to fit) in `ChatInput.tsx`, with an `aria-label`. Its value comes from the room summary `permissionMode`. On change it sends `room_permission_mode` | developer | task 1, 3 | The picker shows the saved mode. A change updates it in all open tabs, and it stays after a page reload and a server restart. `pnpm typecheck` and lint pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |

> Tasks 1–4 depend on each other through the shared types, so one developer sub-agent does them in order.
