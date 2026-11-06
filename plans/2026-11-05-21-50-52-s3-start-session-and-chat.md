# Title: Plan — S3 Start a session and chat

- Classification: feature
- Description: Add a session manager on the Agent SDK, typed chat events over the existing `/ws`, a `rooms` table, a folder picker limited to the home folder, an `Origin` check, and the session list and chat panel in React.

---

## Approach Summary / Goal

- **One way in:** everything goes over the existing `/ws`, including folder listing. The `Origin` check then protects every call, and we add no REST route.
- **Server:**
  - Each session is one SDK `query()` in streaming-input mode, held in memory and keyed by our own `roomId`.
  - SDK messages are turned into small shared events.
  - Partial messages are turned on (`includePartialMessages`), so text streams in token by token.
- **Shared events first:** one developer adds the shared events, so the server and web agree on one contract. Then the backend and frontend developers work at the same time.
- **Goal:** I pick a folder, start a session, and chat with Claude in the browser. Tool cards, errors and the "not logged in" case all show in the chat.

## Functional Requirements

- **Shared events (`packages/shared`):**
  - Client events: `folders_list {path?}`, `session_start {folder}`, `session_send {roomId, text}`, `session_open {roomId}`.
  - Server events:
    - `folders {path, parent, entries}`
    - `sessions {rooms}`, sent on connect and after any change
    - `session_history {roomId, events}`
    - `user_message`, `assistant_text {roomId, messageId, delta}`
    - `tool_call {roomId, toolUseId, name, input}`, `tool_result {roomId, toolUseId, content, isError}`
    - `turn_done`, `session_error {roomId?, code, message}`, `auth_error {roomId, message}`
- **DB:** `0002_rooms.sql` creates `rooms(id TEXT PK, session_id TEXT NULL, folder TEXT NOT NULL, created_at INTEGER NOT NULL)`. `session_id` is filled from the SDK `system/init` message.
- **Session manager:**
  - **Start:** checks that the folder exists and is inside your home folder, saves a `rooms` row, and opens the SDK query in that folder with `settingSources: ['user', 'project', 'local']`.
  - **Permissions:** `canUseTool` always returns `deny` with this message: "Permission prompts are not ready yet in Claude Office." Auto-allowed tools still run.
  - **Busy rule:** while a turn is running, a new `session_send` gets a `session_error` (`busy`). The input box is disabled until `turn_done`.
  - **Replay:** each session keeps a buffer of its events in memory (max 2,000). `session_open` sends `session_history`, so a reload or reconnect shows the chat again.
  - **Open sessions:** the session list shows only the sessions open in memory. After a server restart, the list is empty, but the rows stay in the DB. Resuming them is S6.
- **Errors:** an SDK or stream error becomes `session_error` for that room only. The server never crashes. Login errors (`authentication_failed`, `oauth_org_not_allowed`, `billing_error`, `account_on_hold`) become `auth_error`.
- **Folder picker:**
  - Lists only subfolders. Hidden (dot) folders are left out, and the list is sorted.
  - The start is your home folder. Paths are resolved with `realpath`. Any path outside your home folder is rejected, including through symlinks.
- **Origin check:** `ALLOWED_ORIGINS` in `config.ts` is `http://127.0.0.1:5173`, `http://localhost:5173` and `http://127.0.0.1:4317`. A missing or wrong `Origin` is refused before any event is sent, and the rejected origin is logged.
- **Web app:**
  - **Session list:** the list plus a "New session" dialog with the folder picker.
  - **Chat panel:**
    - Text streams in, and Markdown shows through `react-markdown` + `remark-gfm`. Raw HTML is not allowed.
    - Tool cards can open and close. Each card shows the tool name and input, and then the result.
    - Errors show in the chat.
    - A "Not logged in" notice shows the login steps: install the `claude` CLI and run `claude` to log in, or set `ANTHROPIC_API_KEY`. Then you send the message again.
  - **Error boundaries:** there is one for each feature.

## Non-Functional Requirements

- **Security:**
  - Only the server imports the SDK.
  - The app never reads, asks for, or stores an API key.
  - Only the folder check and the `Origin` check can reject a request.
- **Privacy:** logs hold only ids, event types and error codes. They never hold prompt text, reply text, tool input or tool output.
- **Size:** tool result content sent to the browser is cut to 4,000 characters.
- **Code:** strict TypeScript and no `any`. The SDK message shapes are narrowed from `unknown` or the SDK types. Code follows the conventions file (kebab-case files, stores named `use-*-store.ts`).

## Files in Scope

- **`packages/shared/src/`:** `events.ts` (change), plus maybe `session-events.ts`, which `index.ts` would then export.
- **`apps/server`:**
  - `package.json`: add `@anthropic-ai/claude-agent-sdk` 0.3.318.
  - `src/config.ts`: add `ALLOWED_ORIGINS`, `HOME_DIR` and the buffer and size limits.
  - `src/db/migrations/0002_rooms.sql` and `src/db/rooms-repo.ts`.
  - `src/sessions/session-manager.ts`, `src/sessions/sdk-event-mapper.ts` and `src/sessions/folder-browser.ts`.
  - `src/ws/ws-route.ts` (change), plus maybe `src/ws/origin-check.ts`.
  - `src/main.ts` (wiring).
- **`apps/web`:**
  - `package.json`: add `react-markdown` and `remark-gfm`.
  - `src/features/connection/ws-client.ts`: add `sendClientEvent` and route events to the stores.
  - `src/features/sessions/`: `use-sessions-store.ts`, `SessionList.tsx`, `NewSessionDialog.tsx`, `FolderPicker.tsx`.
  - `src/features/chat/`: `use-chat-store.ts`, `ChatPanel.tsx`, `MessageList.tsx`, `ToolCard.tsx`, `ChatInput.tsx`, `AuthErrorNotice.tsx`.
  - `src/App.tsx` (layout) and `src/styles.css`.

## Risks & Assumptions

- **Assumption: login-free run (S3.7).** The developer runs one SDK call with `CLAUDE_CONFIG_DIR` set to an empty temp folder, and `ANTHROPIC_API_KEY` removed from the child env (by key name only, never by value).
  - This does not touch your real login.
  - If the SDK still logs in, or the run hangs, the developer reports it and I ask you before going on.
- **Risk: SDK API shape.** These are expected from SDK 0.3.318 but not tested in S1: streaming input, `includePartialMessages` and `settingSources`. The developer checks them in `sdk.d.ts`, and reports any gap as an open question.
- **Risk: your global setup is loaded.** Your hooks, skills and allow rules all run in these sessions. Your allow rules may let some tools run without asking, even in deny mode. This is the same as using Claude Code in a terminal.
- **Assumption: no extra setting for `localhost`.** Vite listens on `127.0.0.1`, so `http://localhost:5173` is only listed in case the browser uses that name.
- **Assumption: Chrome check.** At review, I test in Chrome with this repo as the project folder. I only ask harmless read-only questions, which uses a few real Claude turns.
- **Skip-Testing:** there are no tester tasks. S3.10 (QA) is my Chrome check plus server checks at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared events: add the client and server event schemas listed above, plus the `parse*` support, to `packages/shared` | developer | none | Both apps typecheck against the new unions. A bad input returns `{success:false}` and never throws | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | `0002_rooms.sql` + `rooms-repo.ts` (insert, set `session_id`, get) (S3.1) | developer | 1 | The migration applies once. Rows survive a restart | same |
| 3 | DONE | `folder-browser.ts`: list subfolders under home with `realpath` and an inside-home check, and check that a folder exists (S3.4) | developer | 1 | It returns sorted subfolders with no dot folders. `/etc`, `~/../..` and a symlink that leads out of home are all rejected | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 4 | DONE | `session-manager.ts` + `sdk-event-mapper.ts`: start, send, busy rule, replay buffer, deny-all `canUseTool`, `settingSources`, partial text. Map SDK messages to shared events (S3.2, S3.3) | developer | 2, 3 | A script or WS client runs 2 sessions at the same time, and the events never mix rooms. One turn gives `assistant_text`, then `tool_call`/`tool_result`, then `turn_done`. Logs hold no prompt or reply text | same |
| 5 | DONE | Login errors: do the login-free run, write down the message order, and map it to `auth_error` (S3.7) | developer | 4 | A run with no login gives `auth_error`, not `session_error`. The server stays up | same |
| 6 | DONE | `/ws`: the `Origin` check against `ALLOWED_ORIGINS` (S3.9), and routing of the new client events to the session manager and folder browser. Broadcast `sessions` on change | developer | 4 | A WS with `Origin: http://evil.example` or with no `Origin` is refused, and the refusal is logged. The page at `127.0.0.1:5173` connects. The new events work end to end | same + security guide |
| 7 | DONE | Web: `sendClientEvent`, the sessions store, `SessionList`, `NewSessionDialog`, `FolderPicker` (S3.5) | developer | 1 | A session starts from the dialog and shows in the list. Selecting a session sends `session_open` | same |
| 8 | DONE | Web: chat store, `ChatPanel`, streaming Markdown (no raw HTML), `ToolCard` that opens and closes, `ChatInput` (disabled while busy), errors shown in the chat, `AuthErrorNotice` (S3.6, S3.8). Add an error boundary for each feature | developer | 1, 7 | A full turn with tool calls shows correctly. Each room shows only its own messages. An `auth_error` shows the login steps | same |
| 9 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` on everything | developer | 2–8 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** developer A (backend) does tasks 2–6, and at the same time developer B (frontend) does tasks 7–8. They touch different files.
- **Round 3:** task 9 goes to developer A.
- **Then:** my review, the Chrome check (S3.10), and `graphify update .`.
