# Title: Plan — S6 Resume an old session

- Classification: feature
- Description: A History dialog lists your past Claude sessions, grouped by project folder. Resume opens one as a room, shows its old messages, and continues it with the old context.

---

## Approach Summary / Goal

- **Server, reading history:** it uses the SDK's own `listSessions` and `getSessionMessages`.
  - These read Claude's session files for us and never write to them, which keeps us safe if Claude's file format changes.
  - On this Mac, `listSessions` returned 40 sessions in 36 ms.
- **Server, resuming:** this is a new room that already has its `sessionId` set. The existing `ensureQuery` already passes `resume` to the SDK, so the first new message continues the old context.
- **Old messages:** the server turns them into the same room events as a live chat. A resumed chat looks the same as a live one, and reload and replay work with no new web code.
- **Goal:** every session on this device can live in the office. You also get your rooms back after a server restart.

## Functional Requirements

- **Shared:**
  - New client event `history_list {}`.
  - New client event `session_resume {sessionId}`.
  - New server event `history {entries}`. Each entry is `{sessionId, folder, title, firstPrompt?, lastModified, openRoomId: string | null, canResume: boolean}`.
- **History list:**
  - It includes all sessions, including programmatic ones (`includeProgrammatic: true`).
  - `title` is the SDK `summary` (your custom title, the auto summary, or the first prompt). `title` and `firstPrompt` are cut to 200 characters.
  - `canResume` is false when the folder fails the existing `resolveFolder` check (it is outside your home folder or missing). The web then shows "Folder not available" and no Resume button.
  - `openRoomId` is set when an open room already has this session.
- **Resume:**
  - **Already open:** if an open room matches this `sessionId`, the server sends `session_started` with that room. The web then zooms into it, and no second room is made.
  - **New room:** the room is matched by both its current session id and the id it was resumed from, in case the SDK gives a new id on resume. The server then:
    - checks the folder,
    - inserts a `rooms` row with `session_id` set,
    - loads the old messages into the room's replay buffer (the last 2,000 events at most),
    - sends `session_started` and the `sessions` list.
- **Old messages to events:**
  - **Kept:**
    - Your text becomes `user_message`.
    - Claude's text becomes `assistant_text`, with the whole text in one delta.
    - `tool_use` becomes `tool_call`.
    - `tool_result` becomes `tool_result`, cut to 4,000 characters as today.
  - **Skipped:**
    - Sub-agent messages (`parent_tool_use_id` is not null).
    - System messages.
    - User text that is only a wrapper line: `<command-…>`, `<local-command-…>` or `<system-reminder>`.
  - Each message is checked with type guards. A message with an odd shape is skipped, never thrown.
- **Web:**
  - A "History" button under "New session" opens a dialog. On open it sends `history_list` and shows "Loading…".
  - The dialog groups sessions by folder, with the newest group first and the newest session first in each group.
  - Each row shows the title, the date and time, the first prompt (if it differs from the title), and Resume. An open room shows "Open" instead of Resume.
  - On `session_started`, the dialog closes and the room is selected. That is the existing behavior.
  - The dialog can close with Esc and has proper labels.

## Non-Functional Requirements

- **Safety:** the code only reads Claude's files, through the SDK. It never writes, renames or deletes them. The resume folder must pass the same inside-home check as S3.
- **Privacy:** logs hold only ids, counts and error codes. They never hold titles, prompts or message text.
- **Performance:** History opens in under 2 seconds. `listSessions` reads metadata only, and old messages load only on Resume.
- **Reliability:** `listSessions` and `getSessionMessages` errors become an `error` event. The server never crashes.
- **Code:** strict TS, no `any`, and the conventions file.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` and `events.ts`.
- **`apps/server/src/`:**
  - `sessions/history-reader.ts` (new): `listHistory()` and `loadRoomEvents(roomId, sessionId, folder)`.
  - `sessions/session-manager.ts`: `resume(sessionId)`, a find-by-session-id helper, and `resumedFrom` on `Session`.
  - `db/rooms-repo.ts`: insert with a `session_id`. No new migration is needed.
  - `ws/ws-route.ts`: route `history_list` and `session_resume`.
  - `config.ts`: `HISTORY_TEXT_MAX = 200`.
- **`apps/web/src/`:**
  - `features/history/use-history-store.ts` (new).
  - `features/history/HistoryDialog.tsx` (new).
  - `features/sessions/SessionList.tsx`: add the History button.
  - `features/connection/ws-client.ts`: route `history`, and close the History dialog on `session_started`.
  - `styles.css`.

## Risks & Assumptions

- **Broken lines:** `getSessionMessages` should skip bad JSON lines.
  - **Check:** the developer runs a scratch script with `CLAUDE_CONFIG_DIR` set to a temp folder. The folder holds a made-up session file with a broken line. The script checks that the other messages still load.
  - **If the SDK throws:** the developer reports it, and I ask you before adding our own reader.
- **A session open in a terminal:** if you resume a session that is still running in a terminal, both write to the same file. That is out of scope, as the story says. I only note it.
- **The resumed session id may change:** handled by matching on both ids.
- **Not shown:** old sub-agents (out of scope), and the time of each old message (the SDK does not give it).
- **Chrome check (code word test):**
  1. Start a session on this repo and tell Claude a code word.
  2. Restart the server. The room is gone.
  3. Open History, check the grouping, and Resume. The old messages show.
  4. Ask for the code word. Claude answers it.
  5. Resume again. It focuses the same room and makes no new one.
  6. Clean up the test DB afterwards.
- **Skip-Testing:** there are no tester tasks. S6.5 (QA) is my Chrome check at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: `history_list` and `session_resume` client events, the `history` server event and the `HistoryEntry` schema. Export the types | developer | none | Both apps typecheck. A `session_resume` with an empty `sessionId` fails to parse and does not throw | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: `history-reader.ts` (list and map old messages), `resume()` in the session manager, rooms insert with a session id, the ws-route cases, and the config constant. Run the broken-line scratch check (S6.1–S6.3) | developer | 1 | History lists all sessions with folder, title and date. Resume loads old events and a new message resumes. A second resume returns the same room. A broken line is skipped. Logs hold no text | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3 | DONE | Web: history store, `HistoryDialog`, the History button, ws-client routing, and styles (S6.4) | developer | 1 | The dialog shows grouped sessions, newest first. Resume opens or focuses the room. Open rooms show "Open". The dialog has a Loading state and an error state | same |
| 4 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` | developer | 2, 3 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** developer A (backend) does task 2. At the same time, developer B (frontend) does task 3.
- **Round 3:** developer A does task 4.
- **Then:** my review, the Chrome check (S6.5), and `graphify update .`.
