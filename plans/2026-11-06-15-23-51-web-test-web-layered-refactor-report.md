# Title: Web Test Report — Web app after the layered refactor

- Classification: feature
- Description: The refactored web app works the same as before. 16 cases pass, none fail, and 1 case is blocked because the plan expected a confirm dialog the app shows only while Claude is working.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-15-23-51-web-test-web-layered-refactor.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 17    | 16   | 0    | 1       | 0       |

## Test Results

| ID | Title | Result | Notes |
| --- | --- | --- | --- |
| TC-01 | Page loads with no errors | PASS | Header, sidebar, and map show. Only a PixiJS deprecation warning, no errors. The browser loaded the new files (`components/pages/OfficePage.tsx`, `services/ws-client.service.ts`, `hooks/*`). |
| TC-02 | Connection badge | PASS | Shows "connected" (green). |
| TC-03 | Sessions list and select | PASS | The room is highlighted and the chat drawer opens with its messages. |
| TC-04 | Chat resize | PASS | Drag: 480 → 697 px. ← key: 697 → 713. After reload the width stays 713. The saved width was set back to 480 after the run. |
| TC-05 | Esc closes the chat | PASS | The drawer loses `chat-drawer--open` and no room is selected. |
| TC-06 | New session dialog + folder picker | PASS | Opening sends 1 `folders_list`. Clicking Documents sends 1 more and shows its subfolders. |
| TC-07 | History dialog | PASS | Sends `history_list`. Entries are grouped by folder. Esc closes it. |
| TC-08 | Archived dialog | PASS | Sends `archived_list`. Shows "No archived rooms." |
| TC-09 | Room menu + close confirm keeps Esc safe | BLOCKED | Plan error. Close asks for confirmation only while Claude is working or waiting, the same in the old and new code. On an idle room, Close sends `session_close` at once. The Esc-in-confirm behaviour was checked on the Remove confirm instead (TC-17): Esc closed only the dialog, the chat stayed open, and nothing was sent. |
| TC-10 | Rename from sidebar | PASS | Sends `room_rename`. The new name shows in the sidebar and on the map, then the old name comes back. |
| TC-11 | Autocomplete `/` and `@` | PASS | `/` sends `commands_list` and lists commands. ↓ moves the highlight (`aria-activedescendant` = opt-1). Esc closes the popup. `@` sends `files_list` and lists files (50 rows max). No message is sent. See the note under Console and Network Problems. |
| TC-12 | MCP panel | PASS | Opening sends `mcp_list` and shows "Claude is not running in this room…". Refresh sends `mcp_list` again. Back closes the panel. |
| TC-13 | Start a new session | PASS | Sends `session_start`. The dialog closes, and the `claude-code-office` room shows in the sidebar and on the map with its chat open. |
| TC-14 | Send one message | PASS | The user message shows, the room shows busy (spinner, "Claude is working…"), then the reply "OK" shows. |
| TC-15 | Close the test room | PASS | Done during TC-09: sends `session_close`, and the room shows the **closed** badge and "Session closed". |
| TC-16 | Archive and restore | PASS | Archive sends `room_archive` and the room leaves the sidebar. Archived lists it. Restore sends `room_restore` and it comes back. Idle room, so no confirm dialog (same as old code). |
| TC-17 | Remove the test room | PASS | The confirm dialog shows. Remove sends `room_remove`, and the room is gone from the sidebar and the map. |

## Failures

None.

## Blocked / Skipped

- TC-09: the plan expected a confirm dialog for Close on an idle room. The app shows it only while Claude is working or waiting (same as the code before the refactor). The Esc part was checked on the Remove confirm in TC-17 and passed.

## Console and Network Problems

- No console errors during the run. One PixiJS deprecation warning on load (`addChild: Only Containers will be allowed to add children`). It is not related to this refactor.
- Existing behaviour, not a regression: Esc in the autocomplete popup closes the popup **and** the chat drawer. The old `App.tsx` and `ChatInput.tsx` have the same Esc logic, so it worked this way before the refactor.

## Next Steps

- None for the refactor. If you want Esc in the autocomplete popup to keep the chat open, run `/party-mode` and give it this report file: `plans/2026-11-06-15-23-51-web-test-web-layered-refactor-report.md`.
