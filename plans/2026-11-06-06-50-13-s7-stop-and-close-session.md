# Title: Plan — S7 Stop and close

- Classification: feature
- Description: Stop interrupts Claude's turn. Close ends the Claude process and turns the room's lights off. A new message wakes a closed room. After a server restart, rooms with a session come back as closed.

---

## Approach Summary / Goal

- **New state:** `closed` is added to `SessionState`. A closed room has no running SDK query.
- **Stop:**
  - The server calls the SDK `query.interrupt()`, so the session stays alive and goes back to idle.
  - If the turn has not ended after 5 seconds, the server closes the query instead.
- **Close:** the server cancels open permission cards, closes the input queue and calls `query.close()`. The room stays on the map in the `closed` state.
- **Wake:** a closed room has a session id. The first new message starts a new query with `resume`, the same as S6. No new code is needed for this.
- **Restart:** at start, the server loads the DB rooms that have a session id as `closed` rooms. It loads their old messages only when you first open one.
- **Goal:** you can stop runaway work and free your machine. The map shows which sessions are live.

## Functional Requirements

- **Shared:**
  - `SessionStateSchema` adds `closed`.
  - New client events: `session_stop {roomId}` and `session_close {roomId}`.
  - New room event: `session_notice {roomId, kind: 'stopped' | 'closed', time}`. It goes into the replay buffer like the other events.
- **Server, Stop:**
  - Stop works only while the room is busy. Otherwise it does nothing.
  - It cancels open permission requests and calls `interrupt()`.
  - It sends `session_notice stopped`. The state goes to `idle`, and you can send again.
  - No "The Claude session stopped" error shows for a Stop or a Close you asked for.
  - If 5 seconds pass with no `turn_done`, the server closes the query. The room then goes to `idle`, not to `closed`. The next message starts it again with `resume`.
- **Server, Close:**
  - Close works in any state except `closed`.
  - It cancels permissions, closes the input, calls `query.close()`, and sets `busy = false` and the state to `closed`.
  - It sends `session_notice closed`, `session_state` and `sessions`.
- **Server, Wake:** `session_send` to a closed room works as normal: the state goes `closed`, then `working`, then `idle`.
- **Server, Restart:**
  - On start, the server loads every DB row with a `session_id`, one room per session id (the newest row wins).
  - Each room starts `closed`, with an empty event buffer and "not loaded yet" set.
  - Rows with no session id are not shown. They stay in the DB.
  - **On `session_open`:** if a room's old messages are not loaded yet, the server loads them with `loadRoomEvents`, puts them in front of its buffer, and then sends `session_history`. If the load fails, the chat shows an error event and the room still works.
  - **S6 Resume:** resuming a session that already has a closed room focuses that room. The existing `findBySessionId` already does this, and no new room is made.
- **Server, shutdown:** when the server stops, it closes every open query, so no Claude process is left running.
- **Web, chat:**
  - While the room is busy, the Send button becomes a red **Stop** button.
  - The chat header gets a **Close** button.
    - If the room is `working` or `waiting`, Close first opens an in-app confirm dialog: "Claude is working. Close this session?" with Close and Cancel.
    - If the room is idle, Close works with no confirm.
    - Close is hidden when the room is already closed.
  - `session_notice` shows as a small grey line in the chat ("Stopped" or "Session closed").
  - A closed room's input stays on, with the hint "Session closed. Send a message to wake it."
- **Web, map:**
  - A closed room gets a dark layer, and its root agent is hidden. The lamp shows a closed color.
  - When the state leaves `closed`, the dark layer goes and the agent comes back.
- **Web, session list:** closed rooms show a "closed" tag.

## Non-Functional Requirements

- **Speed:** Stop takes effect within 5 seconds, with the close fallback as a backup.
- **Clean up:**
  - No Claude process is left after Close or after the server shuts down.
  - The Chrome check counts `claude` child processes before and after.
- **Privacy:** logs hold only ids, states and counts. They never hold message text.
- **Reliability:**
  - A Stop or Close for an unknown room is logged and ignored.
  - A Stop or Close that runs twice does no harm.
- **Code:** strict TS, no `any`, and the conventions file.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` and `events.ts`.
- **`apps/server/src/`:**
  - `sessions/session-manager.ts`:
    - Store the `Query` on the session.
    - Add `stop()`, `close()` and `closeAll()`.
    - Add the `closed` state, an `intentionalEnd` flag (to hide the error), `loadClosedRooms()`, lazy history (`history()` becomes async), and the 5-second timer.
  - `db/rooms-repo.ts`: `listWithSession()`.
  - `ws/ws-route.ts`: route `session_stop` and `session_close`, and `await` the history.
  - `main.ts`: call `loadClosedRooms()` at start, and `closeAll()` in `onClose`.
  - `config.ts`: `STOP_TIMEOUT_MS = 5000`.
- **`apps/web/src/`:**
  - `features/chat/ChatInput.tsx`: the Stop button and the closed hint.
  - `features/chat/ChatPanel.tsx`: the Close button and the confirm dialog.
  - `features/chat/MessageList.tsx` and `use-chat-store.ts`: the notice line.
  - `features/sessions/SessionList.tsx`: the closed tag.
  - `game/room-view.ts`, plus `agent-sprite.ts` if needed: the dark layer, the hidden agent and the lamp color.
  - `App.tsx`: Esc returns early while the confirm dialog is open.
  - `styles.css`.

## Risks & Assumptions

- **How `interrupt()` behaves:**
  - I expect the SDK to end the turn with a `result` message, which the mapper turns into `turn_done`.
  - The developer checks this in a real run. If the result does not map to `turn_done`, the developer adds that mapping and reports it.
  - The 5-second fallback covers a hang.
- **Sub-agents:** they come in S9, so there is nothing to clear yet. S9 will plug into the same stop and close cleanup.
- **Old DB rows:** S6 made one row for each resume, so some session ids have more than one row. The newest row wins. Nothing is deleted.
- **Folders that are gone:** a restored room whose folder now fails `resolveFolder` still shows as closed. Waking it gives a folder error in the chat.
- **The empty DB file:** my check today made an empty `apps/server/data/claude-office.db` (0 bytes). The server sets up a new database in it at start. The auto-mode check did not let me delete it.
- **Chrome check:**
  1. Start a session and ask for a long task. Click Stop: the state goes idle within 5 seconds, and you can send again.
  2. Ask for a file write so a permission card opens. Click Close. The confirm shows, the card becomes "Cancelled", and the room goes dark. The `claude` process count drops.
  3. Send to the closed room. It wakes and still has the old context.
  4. Restart the server. The rooms show dark, and opening one loads its old chat. Send wakes it.
  5. S6 Resume of that session focuses the same room.
  6. Clean up the test DB afterwards.
- **Skip-Testing:** there are no tester tasks. S7.5 (QA) is my Chrome check at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: `closed` state, the `session_stop` and `session_close` client events, and the `session_notice` room event. Export the types | developer | none | Both apps typecheck. A `session_stop` with no `roomId` fails to parse and does not throw | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: Stop (with interrupt and the 5-second fallback), Close, `closeAll` on shutdown, no error on an intentional end, `loadClosedRooms` with one room per session id, lazy history on open, `listWithSession`, the ws-route cases and the config constant (S7.1, S7.2) | developer | 1 | Stop gives idle within 5 seconds, and you can send again. Close leaves no `claude` process. Wake resumes with the old context. After a restart, rooms show `closed` and their history loads on open. Logs hold no text | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3 | DONE | Web: the Stop button, the Close button with the confirm dialog, the notice line, the closed hint, the closed tag, the dark room with the agent hidden, the Esc guard and styles (S7.3, S7.4) | developer | 1 | Stop shows only while busy. Close confirms only while working or waiting. A closed room is dark with no agent, and it lights up again on wake | same |
| 4 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` | developer | 2, 3 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** developer A (backend) does task 2. At the same time, developer B (frontend) does task 3.
- **Round 3:** developer A does task 4.
- **Then:** my review, the Chrome check (S7.5), and `graphify update .`.
