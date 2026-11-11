# Title: Plan — Sort rooms by creation date by default

- Classification: feature
- Description: Sort the server's room list by `createdAt`, newest first, so every client gets the same order.

---

## Approach Summary / Goal

- Today `SessionService.list()` returns rooms in the order they were added to the in-memory map. Rooms loaded at startup come newest first, but new, restored, and resumed rooms are added at the end, so they show at the bottom.
- We will sort the list in `list()` by `createdAt`, newest first. All room-list updates go through this method, so the sidebar, reloads, and reconnects all get the same order.
- Goal: the sidebar always shows rooms newest first, and only the creation date decides the order.

## Functional Requirements

- The room list sent to clients is sorted by `createdAt`, newest first.
- A new room appears at the top of the sidebar right away.
- Renaming a room, a title change, or a busy/idle/closed state change does not change the order.
- A room restored from the archive is placed by its saved `createdAt`.
- A session resumed from history is placed by its new room creation time (the time it was opened in the app), so it goes to the top.
- The order is the same after a page reload and after a reconnect.

## Non-Functional Requirements

- Make the change in one place on the server. Don't add sorting to the web store.
- Sort a copy of the list. Don't change the order of the in-memory map.
- If two rooms have the same `createdAt`, sort them by `id` so the order is always the same.

## Files in Scope

- `apps/server/src/services/session.service.ts` — the `list()` method

## Risks & Assumptions

- Assumption: the office floor (`apps/web/src/game/office-scene.ts`) keeps its own oldest-first layout. It is out of scope (your choice).
- Assumption: resumed sessions keep `createdAt = Date.now()` (your choice). There is no database change.
- Assumption: the web store and `SessionList.tsx` show the list in the order it arrives, so they need no change. I checked this in `useSessionsStore.setRooms`.
- Risk: very low. Only the order of the list changes, not what is in it.
- The project uses Skip-Testing, so there is no tester task. I will check the change with typecheck and lint.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `SessionService.list()` (`apps/server/src/services/session.service.ts`), sort the sessions by `createdAt` from newest to oldest (ties broken by `id`) before mapping them with `toSummary` | developer | none | `list()` returns rooms newest first. New, restored, and resumed rooms land in the right place. The in-memory map order is not changed. Typecheck and lint pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
