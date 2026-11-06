# Title: Plan — 3-dots action menu for rooms (sidebar and chat header)

- Classification: feature
- Description: Add one shared ⋯ menu component to the sidebar rows and the chat header, and add a new "Remove room" action on the server.

---

## Approach Summary / Goal

- A new shared component, `RoomActionsMenu`, shows a ⋯ icon button with a React-Bootstrap `Dropdown` menu. It also holds the confirm-dialog logic that `ChatPanel` has now.
- The sidebar row uses it in place of the pencil button. The chat header uses it in place of the MCP, Close, and Archive buttons, with MCP as an extra menu item.
- "Remove" is a new server action. It closes the session and deletes the room row from SQLite. The Claude session file stays, so History can still resume it.
- The rename state gets a `place` field (`sidebar` / `header` / `office`). This way only one rename input shows at a time.

## Functional Requirements

- **Sidebar row:** a ⋯ button replaces the pencil button. Its menu has Rename, Archive, Close, Remove.
- **Chat header:** a ⋯ button replaces the MCP, Close, and Archive buttons. Its menu has Rename, MCP servers, Archive, Close, Remove. Back stays as a button.
- **Rename:**
  - In the sidebar, it shows the existing inline `RoomRenameInput` in that row (same as now).
  - In the header, it turns the header title into a `RoomRenameInput`.
  - Office map rename keeps working.
  - Only one rename input shows at a time.
- **Close:** sends `session_close`. The item is hidden when the room is already closed. It asks first only while Claude is working (`working` / `waiting`).
- **Archive:** sends `room_archive`. It asks first only while Claude is working.
- **Remove:**
  - It always asks first ("Remove this room from Claude Office? The Claude session stays in History.").
  - Then it sends a new `room_remove` event. The server closes the session if it is open, deletes the room row, and broadcasts the new room list.
  - The room leaves the sidebar and the office map. If it was open, the chat panel closes.
  - Remove does not touch `~/.claude/projects`, and the room does not show in Archived.
- **Destructive items:** Remove is shown in red, with a divider above it.

## Non-Functional Requirements

- The server checks `room_remove` with zod (`roomId: z.string().min(1)`). An unknown room id is logged and ignored, the same as `archive()`.
- The server logs each remove with `{ roomId }`.
- Keyboard: the React-Bootstrap `Dropdown` handles the arrow keys, Enter, and Esc. The ⋯ toggle has an `aria-label` ("Actions for <room name>") and a tooltip.
- Esc in a menu or confirm dialog must not also close the chat panel. Use the existing `setConfirmingClose` flag through `CloseConfirmDialog`. Check how `App.tsx` handles Esc.
- Clicking the ⋯ button in a sidebar row must not also select the room. The button sits next to the row button, not inside it, as the pencil button does now.
- Follow the existing patterns: zod event in `session-events.ts`, a case in `ws-route`, a `SessionManager` method, and a `RoomsRepo` method.

## Files in Scope

- `packages/shared/src/session-events.ts`, `packages/shared/src/events.ts`: add `RoomRemoveEventSchema` and add it to the client union
- `apps/server/src/db/rooms-repo.ts`: add `delete(id)`
- `apps/server/src/sessions/session-manager.ts`: add `remove(roomId)`
- `apps/server/src/ws/ws-route.ts`: handle `room_remove`
- `apps/web/src/features/sessions/RoomActionsMenu.tsx`: new shared ⋯ menu with confirm dialogs
- `apps/web/src/features/sessions/SessionList.tsx`: use the menu in place of the pencil button
- `apps/web/src/features/chat/ChatPanel.tsx`: use the menu in the header, rename in the header, and move the confirm logic into the menu
- `apps/web/src/features/sessions/use-sessions-store.ts`: add `place` to the rename target
- `apps/web/src/game/office-scene.ts`, `apps/web/src/game/GameCanvas.tsx`: pass and read `place: 'office'`
- `apps/web/src/styles.css`: only if needed

## Risks & Assumptions

- **Assumption:** a removed room can come back only by resuming it from History. That makes a new room.
- **Assumption:** the sidebar menu has no MCP item. The user listed 4 options for it.
- **Assumption:** the Close item is hidden (not just disabled) when the room is already closed. This is the same as the header now.
- **Risk:** deleting the room row while a permission card is open. `remove()` closes the session first, and that cancels open permissions, as `archive()` does.
- **Risk:** the same Claude session may have older archived rows. Remove deletes only this room's row, so an older archived copy can still show in Archived.
- **Testing:** `Skip-Testing`, so there are no tester tasks. The developer runs `pnpm typecheck` and `pnpm lint`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Shared: add `RoomRemoveEventSchema` (`{ type: 'room_remove', roomId }`) and its type, and add it to the client union | developer | none | It parses a valid event and rejects an empty `roomId`. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Server: add `RoomsRepo.delete(id)`. Add `SessionManager.remove(roomId)`: close if open, clear the stop timer, delete from the map and the DB, log, `notifyChanged()`. An unknown id is logged and ignored. Handle `room_remove` in `ws-route.ts` | developer | task 1 | The removed room is gone from the room list for all tabs. The session file stays, and History can resume it. Open permissions are cancelled. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3   | DONE   | Store and game: change the rename target to `{ roomId, place: 'sidebar' \| 'header' \| 'office', rect }`, and update `startRename` and its callers (`office-scene.ts`, `GameCanvas.tsx`, `SessionList.tsx`) | developer | none | Office map rename works as before. Each place shows its input only when `place` matches. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | DONE   | Web: create `RoomActionsMenu.tsx` (⋯ toggle with tooltip and aria-label; items Rename, [MCP servers], Archive, Close (hidden when closed), divider, Remove in red; confirm dialogs: Remove always, Close and Archive only while working, through `CloseConfirmDialog`). Props: `room`, `place`, `showMcp` | developer | task 1, 3 | Each item sends the right event or opens rename/MCP. The confirm rules match the requirements. Keyboard works. Esc does not close the chat panel. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | DONE   | Web: in `SessionList.tsx`, swap the pencil button for `RoomActionsMenu` (`place: 'sidebar'`). In `ChatPanel.tsx`, swap the MCP, Close, and Archive buttons for `RoomActionsMenu` (`place: 'header'`, `showMcp`), show `RoomRenameInput` in place of the title when renaming in the header, and remove the old confirm state | developer | task 4 | The sidebar and header show the ⋯ menus with the right items. Header rename edits the title. Back still works. `pnpm typecheck` and `pnpm lint` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |

> One developer does tasks 1–5 in order. They share types and components.
