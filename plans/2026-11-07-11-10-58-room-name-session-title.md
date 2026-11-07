# Title: Plan — Use the Claude session title as the default room name

- Classification: feature
- Description: Rooms show the Claude session title by default. A name you set in Claude Office always wins.

---

## Approach Summary / Goal

- The server reads the session title with the SDK's `getSessionInfo(sessionId, { dir: folder })`. It uses the `summary` field: `/rename` title → AI title → first prompt.
- The server saves the title in a new `rooms.title` column. Archived rooms and restarts then still have it. It sends the title to the web app as a new `title` field.
- `roomLabel()` uses this order: your name → session title → folder name.
- Goal: each room in the same folder shows its own title. Your own name is never replaced.

## Functional Requirements

- FR1: A room with no name shows the Claude session title.
- FR2: Before the first message there is no title yet, so the room shows the folder name.
- FR3: The server reads the title again after each turn ends (the SDK `result` message). This picks up the AI title, which Claude makes after the first message.
- FR4: When you resume a session from history, the room shows its title right away. The title comes from the `getSessionInfo` result the code already has.
- FR5: At server start, saved rooms show their saved title. The server then reads each title again in the background, to catch renames done in Claude Code.
- FR6: A name you set always wins over the title. Title updates never change `rooms.name`.
- FR7: Saving an empty name clears your name, and the room shows the session title again. This already works in `RoomService.rename()`.
- FR8: The Archived dialog uses the same label order.
- FR9: The title is cut to `ROOM_NAME_MAX` (60) characters.
- FR10: Renaming a room in Claude Office does **not** rename the Claude session.

## Non-Functional Requirements

- If `getSessionInfo` fails, the server logs the error name and keeps the old title. The room does not crash.
- The server sends `notifyChanged()` only when the title really changed.
- Follow the server layer order: services → repositories. Follow the existing Zod DTO style.

## Files in Scope

- `apps/server/src/migrations/0005_room_title.sql` (new): `ALTER TABLE rooms ADD COLUMN title TEXT;`
- `apps/server/src/dtos/room-row.dto.ts`: add `title`
- `apps/server/src/repositories/room.repository.ts`: add `title` to `COLUMNS`, add `setTitle()`
- `apps/server/src/repositories/session-store.repository.ts`: add `title` to `Session`, `closedSession()`, `toSummary()`
- `apps/server/src/services/session.service.ts`: add `refreshTitle(session)`. Call it after a `result` message in `pump()` and for each room in `loadClosedRooms()`. Set `title` in `doResume()` and in the new-room session object.
- `apps/server/src/services/room.service.ts`: add `title` in `listArchived()`
- `packages/shared/src/models/room-summary.ts`: add `title: z.string().nullable()`. Change `roomLabel()` to `{ name, title, folder }`.
- `packages/shared/src/models/archived-room.ts`: add `title`
- `apps/web/src/components/organisms/ArchivedDialog.tsx`: check that it still type-checks. It passes the archived room to `roomLabel()`.

## Risks & Assumptions

- Assumption: `summary` falls back to the first prompt. You said this is OK.
- Risk: at startup, the server makes one `getSessionInfo` call per saved room. Each call reads only one session file, so this should be fast. It runs in the background and does not block start.
- Risk: the AI title may arrive a little after the first `result` message. If so, the room shows the first prompt until the next turn ends. This is fine.
- The rename box starts with the shown label. If you press Enter without changing the text, nothing is saved. This already works.
- Testing workflow is `Skip-Testing`, so there are no tester tasks. The check is `pnpm typecheck`/lint plus a manual check.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Shared: add `title` to `RoomSummarySchema` and `ArchivedRoomSchema`. Change `roomLabel()` to the order name → title → folder basename. | developer | none | `roomLabel({name:null,title:'T',folder:'/a/b'})` returns `'T'`. A name wins over the title. With both null it returns `'b'`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Server data layer: add migration `0005_room_title.sql`. Add `title` to `RoomRowSchema`, `COLUMNS`, and a new `RoomRepository.setTitle(id, title)`. | developer | task 1 | The migration runs on an existing DB. `get()` and `listArchived()` return `title`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | Server services: add `title` to `Session`, `closedSession()`, and `toSummary()`. Add `SessionService.refreshTitle(session)`. Call it after `result`, and for each room in `loadClosedRooms()`. Set the title in `doResume()` from `info.summary`. Add `title` in `RoomService.listArchived()`. | developer | task 2 | FR1–FR10 work. A `getSessionInfo` error is logged and does not throw. `notifyChanged()` runs only on a real change. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/SECURITY_SCANNER` |
| 4   | DONE   | Web: fix any type errors from the new `roomLabel()` input, for example in `ArchivedDialog.tsx`. | developer | task 1 | `pnpm -r typecheck` and lint pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
