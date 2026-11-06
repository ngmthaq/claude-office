# Title: Plan — S5 Permission prompts in the UI

- Classification: feature
- Description: The server holds each `canUseTool` request until the browser answers it. The chat shows an Allow / Deny card, and the root agent shows the waiting bubble.

---

## Approach Summary / Goal

- **Server:**
  - `canUseTool` stops denying everything. It saves each request by `toolUseID`, sends a `permission_request` event, and waits for the browser's answer.
  - The request and its result are normal room events. They go into the replay buffer, so a reload rebuilds the card with no extra code.
  - The state is `waiting` while any request is open, and goes back to `working` after the answer. The S4 map bubble then works with no new art.
- **Web:** a new `PermissionCard` in the chat with Allow and Deny. A click sends `permission_answer` and locks the card.
- **Goal:** Claude can edit files and run commands safely from the browser. You see a waiting room on the map at a glance.

## Functional Requirements

- **Shared:**
  - New room event `permission_request {roomId, requestId, toolName, title?, description?, input, fromSubagent, time}`.
  - New room event `permission_resolved {roomId, requestId, decision: 'allow' | 'deny' | 'cancelled'}`.
  - New client event `permission_answer {roomId, requestId, decision: 'allow' | 'deny'}`.
- **Server, when a request comes in:**
  - `requestId` is the SDK `toolUseID`. `fromSubagent` is true when the SDK gives an `agentID`. These requests go to the root chat with a tag.
  - The event's `input` cuts long strings to 4,000 characters. The server keeps the full input for Allow.
  - **AskUserQuestion and ExitPlanMode** are denied at once, and no card is shown. The deny message tells Claude to ask its question as plain chat text.
- **Server, when the answer comes back:**
  - **Allow** returns `{behavior: 'allow', updatedInput: <original input>}`.
  - **Deny** returns `{behavior: 'deny', message: 'The user denied this tool in Claude Office.'}`.
  - The server then sends `permission_resolved`.
  - **Several tabs:** the first answer wins. An answer for an unknown or already-answered request is ignored. It is logged with ids only.
- **Cancel:**
  - If the SDK `signal` aborts, the request becomes `cancelled`.
  - If the query ends or fails, every open request becomes `cancelled`. The session never stays in `waiting`.
- **State:**
  - `waiting` while any request is open and the session is busy.
  - `working` when all requests are answered.
  - `idle` after `turn_done`.
  - Each change sends `session_state`, and the `sessions` list shows the right state.
- **Web:**
  - **Card content:** the SDK title (or "Claude wants to use {tool}"), the tool name, the description, a "from sub-agent" tag when it applies, and the input as formatted JSON.
  - **Before an answer:** the card shows Allow and Deny. A click sends `permission_answer` and turns both buttons off right away.
  - **After an answer:** the card shows "Allowed", "Denied" or "Cancelled".
  - **Reload:** the waiting card shows again, with working buttons.
- **Map:** the root agent shows the yellow "!" bubble while its room is `waiting`, both on the full map and in the zoomed room view.

## Non-Functional Requirements

- **Security:**
  - Only a click can answer a request. There is no auto-allow and no "always allow".
  - The `permission_answer` schema allows only `allow` or `deny`.
  - Allow always sends back the input the server saved, never input from the browser.
- **Reliability:** an open request is never lost while the server runs. The server keeps it in memory, and it also sits in the replay buffer.
- **Privacy:** logs hold only ids, the tool name and the decision. They never hold tool input.
- **Code:** strict TS, no `any`, and the conventions file.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` (new schemas, added to `RoomEventSchema`) and `events.ts` (`permission_answer` in `ClientEventSchema`).
- **`apps/server/src/`:**
  - `config.ts`: new deny and ask-in-chat messages. The old `PERMISSION_DENY_MESSAGE` text changes.
  - `sessions/session-manager.ts`: the pending map, `answerPermission`, the state rule, and cancel on abort and on query end.
  - `ws/ws-route.ts`: route `permission_answer`.
- **`apps/web/src/`:**
  - `features/chat/use-chat-store.ts`: the `permission` chat item and the reducer cases.
  - `features/chat/PermissionCard.tsx` (new).
  - `features/chat/MessageList.tsx`.
  - `styles.css`.
- **Maybe:** `features/connection/ws-client.ts`, only if the new room events need their own route.

## Risks & Assumptions

- **Your allow rules still apply.** Your user, project and local settings are loaded. Tools that your rules already allow, and read-only commands, never ask. So cards show only for tools that really need your OK.
- **Replay buffer:**
  - It holds up to 2,000 events. While a request is open, the turn is paused and no new events come in, so the request will not be dropped.
  - After a server restart, open requests are gone, as are the sessions themselves. That is S6.
- **AskUserQuestion and ExitPlanMode:** Claude may say it could not ask. It should then ask in plain text. A real answer UI can come later.
- **Chrome check:**
  - I start one session on this repo. I ask Claude to create `apps/server/data/permission-probe.txt`. That folder is git-ignored.
  - Then I check Allow, Deny, the reload and the map bubble.
  - Then I delete the probe file and the test DB.
- **Skip-Testing:** there are no tester tasks. S5.5 (QA) is my Chrome check at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: add the `permission_request` and `permission_resolved` schemas to `RoomEventSchema`. Add `permission_answer` to `ClientEventSchema`. Export the types | developer | none | Both apps typecheck. A `permission_answer` with any decision other than `allow` or `deny` fails to parse and does not throw | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: the permission handling in `session-manager.ts` (pending map, `answerPermission`, state rule, cut input, deny AskUserQuestion and ExitPlanMode, cancel on abort and on query end). The new messages in `config.ts`. Route `permission_answer` in `ws-route.ts` (S5.1, S5.2) | developer | 1 | Allow lets the tool run. Deny sends the deny message. State goes `working`, then `waiting`, then `working`, then `idle`. A second answer is ignored. Query end cancels open requests. Logs hold no input | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3 | DONE | Web: the `permission` item in `use-chat-store.ts`, `PermissionCard.tsx`, its case in `MessageList.tsx`, and styles (S5.3, S5.4) | developer | 1 | The card shows the title, tool, input and sub-agent tag. A click sends the answer and turns the buttons off. Each final status shows. History replay rebuilds a waiting card with working buttons | same |
| 4 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` on everything | developer | 2, 3 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** developer A (backend) does task 2. At the same time, developer B (frontend) does task 3. They touch different files.
- **Round 3:** developer A does task 4.
- **Then:** my review, then the Chrome check (S5.5), then `graphify update .`.
