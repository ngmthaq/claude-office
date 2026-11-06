# Title: Plan — S8 Rename and archive rooms

- Classification: feature
- Description: You can give a room your own name, archive a room so it leaves the map, and restore it from an Archived list. Names and archive state stay after a restart.

---

## Approach Summary / Goal

- **DB:** a new migration adds `name TEXT` (null means "use the folder name") and `archived_at INTEGER` (null means "not archived") to `rooms`.
- **One name rule:** `RoomSummary` gets `name: string | null`. A shared helper `roomLabel(room)` returns the custom name or the folder's last part. The map, the list and the chat header all use it.
- **Archive:** the server closes the room if it is running (S7 `close()`), saves `archived_at`, and removes the room from memory. The room leaves the map. Claude's files are never touched.
- **Restore:** the server clears `archived_at` and loads the room back as a closed room with lazy history, the same as after a restart (S7).
- **Goal:** the map only shows the work you care about now.

## Functional Requirements

- **Shared:**
  - `RoomSummary` adds `name: string | null`.
  - New client events:
    - `room_rename {roomId, name}`. The name is trimmed, and at most 60 characters. An empty name resets the room to its folder name.
    - `room_archive {roomId}`
    - `room_restore {roomId}`
    - `archived_list {}`
  - New server event: `archived {rooms}`. Each entry is `{id, name, folder, sessionId, archivedAt}`.
  - `roomLabel(room)` helper.
- **Server, rename:**
  - The new name is saved to the DB, then the `sessions` list is sent to all tabs.
  - A rename for an unknown room is logged and ignored.
- **Server, archive:**
  - Archive works in any state.
  - If the room is not closed, the server closes it first with `close()`. That cancels permissions and ends the Claude process.
  - It then sets `archived_at`, removes the room from memory, and sends `sessions` and `archived` to all tabs.
  - **A room with no session id** (Claude never replied) has no chat to restore. It is still archived in the DB, but it is not shown in the Archived list.
- **Server, Archived list:** `archived_list` returns the archived rows that have a session id, newest first, one per session id.
- **Server, restore:**
  - Restore clears `archived_at` and adds the room back as `closed`, with its history not loaded yet.
  - It sends `sessions` and `archived` to all tabs.
  - If a room for the same session is already on the map, Restore only clears the flag and does not make a second room.
- **Server, restart:** `loadClosedRooms` still picks the newest row for each session id. If that row is archived, the session stays hidden, and an older row for it is not shown instead. Names load from the DB.
- **Server, Resume from History:** if the session's newest row is archived, Resume restores that room, with its name, and returns it. It does not make a new room. History's `openRoomId` stays as it is.
- **Web, rename:**
  - **Map:** double-click a room label. A small HTML text box opens over the label. Enter saves, and Esc or a click outside cancels. Esc here must not also close the chat (the same guard as S7).
  - **List:** each row gets a small Rename button that turns the name into a text box, with the same keys.
  - The new name shows on the map, in the list and in the chat header.
- **Web, archive:**
  - The chat header gets an **Archive** button.
  - While the room is `working` or `waiting`, Archive first opens a confirm dialog: "Claude is working. Close and archive this session?" In other states it archives with no confirm.
  - If the archived room was selected, the chat closes and the camera zooms back out to the map.
- **Web, Archived list:**
  - An "Archived" button under History opens a dialog. On open it sends `archived_list` and shows "Loading…".
  - Each row shows the name (or the folder name), the folder, the archived date and time, and a Restore button.
  - Restore puts the room back on the map, dark and closed. It does not zoom in. The row leaves the list.
  - The dialog closes with Esc and has proper labels. Its look matches History.
  - With no archived rooms, it shows "No archived rooms."

## Non-Functional Requirements

- **Safety:** Archive and Restore only change our own DB. They never read, write or delete Claude's session files.
- **Privacy:** logs hold only ids and counts. They never hold room names or message text.
- **Input:** the name is checked by the Zod schema (60 characters at most) and shown as plain text. It is never put into HTML.
- **Reliability:** archiving or restoring twice does no harm. Unknown room ids are logged and ignored.
- **Code:** strict TS, no `any`, and the conventions file.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` (`name`, the `archived` event, `ArchivedRoom`, `roomLabel`), `events.ts`, and `index.ts` if it needs an export.
- **`apps/server/src/`:**
  - `db/migrations/0003_room_name_archive.sql` (new).
  - `db/rooms-repo.ts`: `setName`, `setArchived`, `listArchived`, `getNewestBySessionId`, plus `name` and `archivedAt` on `RoomRow`.
  - `sessions/session-manager.ts`: `name` on the session, `rename()`, `archive()`, `restore()`, `listArchived()`, the archived check in `loadClosedRooms`, the archived path in `resume()`, and `toSummary`.
  - `ws/ws-route.ts`: the 4 new client events.
  - `config.ts`: `ROOM_NAME_MAX = 60`.
- **`apps/web/src/`:**
  - `game/room-view.ts` and `game/office-scene.ts`: show the label, and report a double-click on it.
  - `features/sessions/RoomRenameInput.tsx` (new): the HTML text box placed over the map label.
  - `features/sessions/SessionList.tsx`: the label, the Rename button and the Archived button.
  - `features/archived/use-archived-store.ts` and `features/archived/ArchivedDialog.tsx` (new).
  - `features/chat/ChatPanel.tsx`: the label, and the Archive button with its confirm (reuse or extend `CloseConfirmDialog`).
  - `features/connection/ws-client.ts`: route `archived`.
  - `features/sessions/use-sessions-store.ts`: if the selected room leaves the list, unselect it.
  - `App.tsx`: the Esc guard while renaming or confirming.
  - `game/fake-rooms.ts`: add `name: null`.
  - `styles.css`.

## Risks & Assumptions

- **Placing the box over the map label:** the canvas has a camera with zoom. The box is placed with the label's screen position, from Pixi's `toGlobal`. If that proves hard, the developer reports it, and I ask you before changing the approach.
- **Double-click on the label vs. click on the room:** a click on the room still selects it. A double-click on the label opens rename. The first click of a double-click may also select the room, and that is fine.
- **Old DB rows:** S6 made more than one row for some session ids. The newest row is the room, as in S7. Rename and archive change only that row.
- **Chrome check:**
  1. Rename a room from the map and from the list. Check the map, the list and the chat header. Restart the server, and the name is still there.
  2. Archive an idle room. It leaves the map, and the Archived list shows it.
  3. Archive a working room. The confirm shows, the Claude process count goes to 0, and the room leaves the map.
  4. Restart the server. Archived rooms stay off the map.
  5. Restore one. It comes back dark, with its name. Its old chat loads on open, and a message wakes it.
  6. Archive it again, then Resume it from History. The same room comes back, with its name.
  7. Clean up the test DB afterwards.
- **Skip-Testing:** there are no tester tasks. S8.4 (QA) is my Chrome check at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: `name` on `RoomSummary`, the 4 client events, the `archived` event, `ArchivedRoom` and `roomLabel`. Export the types | developer | none | Both apps typecheck. A `room_rename` with a 61-character name fails to parse and does not throw | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: migration 0003, the repo methods, `rename`, `archive`, `restore`, `listArchived`, the archived rules in `loadClosedRooms` and `resume`, the ws-route cases and the config constant (S8.1, S8.2) | developer | 1 | The migration runs on the existing DB. Rename saves and broadcasts. Archive closes a running room, leaves no `claude` process, and hides the room after a restart. Restore brings it back closed. Resume of an archived session restores the same room. Logs hold no names | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3 | DONE | Web: `roomLabel` everywhere, map double-click rename with the HTML box, list rename, the Archive button with confirm, the Archived dialog and store, ws-client routing, unselect on removal, the Esc guard and styles (S8.3) | developer | 1 | All three actions work from the UI. Names show in all 3 places. Esc while renaming or confirming does not close the chat | same |
| 4 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` | developer | 2, 3 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** developer A (backend) does task 2. At the same time, developer B (frontend) does task 3.
- **Round 3:** developer A does task 4.
- **Then:** my review, the Chrome check (S8.4), and `graphify update .`.
