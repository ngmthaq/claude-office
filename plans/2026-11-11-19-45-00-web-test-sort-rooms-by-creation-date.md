# Title: Web Test Plan — Sort rooms by creation date by default

- Classification: feature
- Description: This run checks that the sidebar lists rooms by creation date, newest first, and keeps that order (issue #8).
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only, at the current browser window size

---

## Goal

- Prove that the sidebar lists rooms newest first, and that a new room shows up at the top.
- Prove that renaming a room and a busy/idle change don't change the order.
- Prove that a room restored from the archive goes back to its creation-date place, not to the top.
- Prove that the order stays the same after a page reload and after a server restart (reconnect).

## Scope

- In scope: the sidebar room list (`apps/web/src/components/organisms/SessionList.tsx`), for the change in `plans/2026-11-11-19-20-01-sort-rooms-by-creation-date.md`.
- Out of scope: the office floor layout (it stays oldest first on purpose), resuming a session from history, mobile sizes, and other browsers.

## Preconditions

- I start `pnpm dev` and stop it at the end.
- I read the expected order from the `rooms` table (`created_at`) in the app's data folder (`~/.@ngmthaq20-claude-office`). This is a read-only check.

## Risks & Assumptions

- The app uses your normal data folder, so the 3 test rooms (Room A, B, C) are real rooms in this repo folder. They are archived at the end. Your other rooms are not touched.
- One short message to Room B uses a few tokens.
- Archiving is done from the room's actions menu and can be undone from the Archived dialog.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: —

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Existing rooms are newest first | high | app open | 1. Open the page. 2. Read the sidebar room names from top to bottom. 3. Compare them with the open rooms in the `rooms` table, sorted by `created_at`, newest first. | none | The sidebar order matches the table order, newest first. |
| TC-02 | PASS | A new room shows up at the top | high | TC-01 | 1. Click the **+** button in the header. 2. Pick this repo folder and start the room. 3. Rename it "Room A". 4. Do steps 1–3 again for "Room B", then "Room C". | repo folder | After each new room is made, it is the first item in the sidebar. The end order at the top is Room C, Room B, Room A. |
| TC-03 | PASS | Renaming doesn't change the order | high | TC-02 | 1. Open the actions menu for Room A. 2. Click **Rename**. 3. Type "Room A renamed" and press Enter. | "Room A renamed" | The name changes, and the room stays third (C, B, A renamed). |
| TC-04 | PASS | Busy and idle don't change the order | high | TC-02 | 1. Select Room B. 2. Send "Reply with just OK". 3. Watch the sidebar while it is busy and after it goes idle. | "Reply with just OK" | Room B shows the busy spinner, then stops. The order stays C, B, A renamed the whole time. |
| TC-05 | PASS | A restored room goes back to its date place | high | TC-03 | 1. Open the actions menu for Room A renamed. 2. Click **Archive** and confirm. 3. Open the Archived dialog. 4. Click **Restore** for Room A renamed. | none | After restore, Room A renamed is third again (below Room B), not at the top. |
| TC-06 | PASS | Order stays the same after a reload | high | TC-05 | 1. Note the full sidebar order. 2. Reload the page. | none | The sidebar order is the same as before the reload. |
| TC-07 | PASS | Order stays the same after a reconnect | high | TC-06 | 1. Note the full sidebar order. 2. Stop the dev server, then start it again. 3. Wait until the page reconnects by itself (don't reload). | none | The page reconnects, and the sidebar order is the same as before the restart. |
| TC-08 | PASS | Clean up | low | TC-07 | 1. Archive Room A renamed, Room B, and Room C from their actions menus. | none | The 3 test rooms are gone from the sidebar and are in the Archived dialog. |
