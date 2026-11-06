# Title: Web Test Plan — Web app after the layered refactor

- Classification: feature
- Description: Check that the app looks and works the same after moving `apps/web/src` into the layer folders.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current Chrome window)

---

## Goal

- Prove that every main flow still works after the refactor: layout, connection, sessions list, map, dialogs, menus, chat, autocomplete, MCP panel, resize, and Esc.
- These areas changed the most: components that became pure (their handlers moved up), the new feature hooks, and `WsClientService`.

## Scope

- In scope: the single page (`OfficePage`), every dialog, the room menu, the chat drawer, autocomplete, the MCP panel, rename, start session, send message, close, archive, restore, and remove.
- Out of scope: mobile sizes, sub-agent details (needs a run that starts a sub-agent), permission cards (needs a tool permission prompt), and WS reconnect timing.

## Preconditions

- I start `pnpm dev` from the repo root in the background (web on 127.0.0.1:5173, server on 127.0.0.1:4317). I stop it after the tests.
- The local DB already has at least one room.

## Risks & Assumptions

- **Assumption:** the new test session uses this repo's folder (`claude-code-office`). The test message is "Reply with the word OK only.", so token use stays small.
- Rename is undone by renaming back. Archive is undone by restoring. **Remove** is used only on the room this test creates.
- If no room has MCP servers, TC-12 only checks that the panel opens and shows its state.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked — needs user input on: —

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Page loads with no errors | high | app running | 1. Open http://localhost:5173 2. Read the console | none | Header, sidebar, and map canvas show. No red errors in the console. |
| TC-02 | PASS | Connection badge | high | TC-01 | 1. Look at the header badge | none | Badge shows the connected state (green). |
| TC-03 | PASS | Sessions list and select | high | ≥1 room | 1. Click a room in the sidebar | existing room | The room is highlighted and the chat drawer opens with that room's messages. |
| TC-04 | PASS | Chat resize (drag + keyboard + saved width) | medium | chat open | 1. Drag the resize handle left 2. Focus the handle and press ← 3. Reload | none | The width changes and stays inside its limits. After reload, the width is kept. |
| TC-05 | PASS | Esc closes the chat | medium | chat open | 1. Press Esc | none | The chat drawer closes and no room is selected. |
| TC-06 | PASS | New session dialog + folder picker | high | TC-01 | 1. Click the **+** button 2. Look at the folder list 3. Click a folder | none | Dialog opens. The folder list loads (one `folders_list` request), and clicking a folder shows its subfolders. |
| TC-07 | PASS | History dialog | medium | TC-01 | 1. Click the History button 2. Press Esc | none | The dialog opens, entries load grouped by folder, and Esc closes it. |
| TC-08 | PASS | Archived dialog | medium | TC-01 | 1. Click the Archived button | none | The dialog opens and lists archived rooms, or shows an empty state. |
| TC-09 | BLOCKED | Room menu + close confirm keeps Esc safe | high | ≥1 room | 1. Open a room's ⋯ menu 2. Click **Close** 3. Press Esc | none | The confirm dialog shows. Esc closes only the dialog (the chat stays open). The room is not closed. |
| TC-10 | PASS | Rename from sidebar | high | ≥1 room | 1. ⋯ → **Rename** 2. Type `web-test-rename` + Enter 3. Rename back to the old name | old name | The new name shows in the sidebar and on the map, then the old name comes back. |
| TC-11 | PASS | Autocomplete `/` and `@` | high | chat open | 1. Type `/` in the chat input 2. Press ↓ and Esc 3. Type `@` | none | The popup lists commands, then files. Arrow keys move the highlight, and Esc closes the popup. Nothing is sent. |
| TC-12 | PASS | MCP panel | medium | chat open | 1. Click the MCP button in the chat header 2. Click refresh 3. Close | none | The panel opens and shows loading, then the server list or an empty state. It closes. |
| TC-13 | PASS | Start a new session | high | TC-06 | 1. **+** → choose the `claude-code-office` folder → Start ⚠️ | this repo folder | The dialog closes, the new room shows in the sidebar and on the map, and its chat opens. |
| TC-14 | PASS | Send one message | high | TC-13 | 1. Type `Reply with the word OK only.` 2. Press Enter ⚠️ | text left | The user message shows, the room shows busy, then the assistant reply shows and the list auto-scrolls. |
| TC-15 | PASS | Close the test room | high | TC-13 | 1. ⋯ → **Close** → Confirm ⚠️ | test room | The room shows the **closed** badge. |
| TC-16 | PASS | Archive and restore | medium | TC-15 | 1. ⋯ → **Archive** → Confirm ⚠️ 2. Archived dialog → restore it | test room | The room leaves the sidebar, shows in Archived, then comes back after restore. |
| TC-17 | PASS | Remove the test room | medium | TC-16 | 1. ⋯ → **Remove** → Confirm ⚠️ | test room only | The room is gone from the sidebar and the map. |
