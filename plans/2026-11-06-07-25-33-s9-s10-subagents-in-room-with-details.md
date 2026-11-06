# Title: Plan — S9 + S10 Sub-agents in the room, with details

- Classification: feature
- Description: Each sub-agent walks into its room through a new door, sits at a small desk, and walks out when it ends. Click a sub-agent, or its card in the main chat, to see its type, task, live tool calls and result.

---

## Approach Summary / Goal

- **Start:** the server sees the root's `Agent` tool call (or `Task`, for older SDKs). It sends `subagent_started` instead of a `tool_call`.
- **End:** the server sees the matching top-level `tool_result`. It sends `subagent_finished` instead of a `tool_result`.
- **Child messages:** messages with a `parent_tool_use_id` that matches an active sub-agent become `subagent_tool_call` and `subagent_tool_result`. They never go into the main chat.
- **One source for the map:** `RoomSummary` gets `subagents: {id, agentType}[]`, the active ones. The map, the seats, the count badge and the reload all use it. A reload works for every room, with no new code.
- **The details** come from the room's event buffer. The chat store builds one `subagent` item for each sub-agent, and the main chat card and the details panel both read it.
- **Goal:** you see delegated work live, and you can check it without noise in the main chat.

## Functional Requirements

### Shared

New room events. All of them go into the replay buffer:

| Event | Fields |
| --- | --- |
| `subagent_started` | `roomId`, `subagentId` (the `Agent` tool_use id), `agentType`, `description`, `prompt`, `time` |
| `subagent_tool_call` | `roomId`, `subagentId`, `toolUseId`, `name`, `input` |
| `subagent_tool_result` | `roomId`, `subagentId`, `toolUseId`, `content`, `isError` |
| `subagent_finished` | `roomId`, `subagentId`, `status` (`done`, `error` or `stopped`), `result`, `time` |

- The prompt and the result are cut to 4,000 characters, as for tool results.
- `RoomSummary` adds `subagents: {id, agentType}[]`.

### Server

- **Start:**
  - The server keeps a map of active sub-agents for each room.
  - If the `Agent` input has no type, `agentType` is `"general-purpose"`.
- **End:**
  - When the matching top-level `tool_result` comes, the status is `error` if `is_error` is set, and `done` otherwise.
  - The sub-agent leaves the map, and the server sends `sessions`.
- **Background sub-agents:** if `task_started` says `is_backgrounded`, the end is the `task_notification` for that task, not the early `tool_result`. The developer checks this in a real run.
- **Stop, Close and query end:** every active sub-agent gets `subagent_finished` with the status `stopped`.
- **Nested sub-agents** (sub-agents of sub-agents):
  - They get no character. Their own tool calls are dropped.
  - The nested `Agent` call shows as one tool call in its parent sub-agent's details.
- **Buffer limit:** at most 200 tool events are kept for each sub-agent. Later ones are not sent, and the finish event carries `hiddenToolCalls: number`. This stops one busy sub-agent from pushing the main chat out of the 2,000-event buffer.
- **Permission cards from sub-agents** stay in the main chat with the "from sub-agent" tag, as in S5.
- **Old (resumed) history:** this does not change. The old `Agent` calls still show as tool cards there. Details for old sessions are out of scope (S10).

### Web, room

- **Layout:**
  - A door in the middle of the bottom wall.
  - 4 small desks in the lower half of the room. Each desk has a seat behind it.
  - Up to 4 extra standing spots near the side walls.
  - A 9th or later sub-agent takes the door spot, moved a little each time.
  - The root desk and the root agent do not move.
- **Seats:**
  - Each new sub-agent gets the first free seat.
  - Its seat is kept until it has fully walked out.
  - Two characters never share a spot.
- **Character:**
  - It reuses the `AgentSprite` look. The colors are picked from `agentType`, so each type has its own look.
  - It walks in a straight line from the door to its seat in about 0.6 seconds. Then it shows the "working" dots.
  - At the end, it walks back to the door and is removed.
  - On `error`, a red "x" shows for about 1.5 seconds before it walks out.
  - On `stopped`, it walks out with no mark.
- **Label:** the type (for example "Explore") over its head, shown only when that room is open.
- **Click:** a click on a sub-agent opens the room (if it is not open) and opens the details panel for that sub-agent.
- **Map badge:** a small number in a corner of the room shows how many sub-agents are working. It shows at every zoom level and hides at 0.
- **Closed room:** a closed room has no sub-agents, since Close made them leave.

### Web, chat

- **The sub-agent card** replaces the `Agent` tool card. It shows:
  - the type,
  - the short task (`description`),
  - a status of working, done, error or stopped.
- A click on the card opens the details panel. It still works after the character has left.
- **The details panel** opens over the chat panel. It shows:
  - a "Back to chat" button. Esc also goes back, and does not close the chat.
  - the type, the task and the full prompt,
  - the tool calls, which appear live and reuse `ToolCard`,
  - the result as Markdown when the sub-agent finishes, or "Stopped", or the error,
  - "N more tool calls not shown" when some were dropped.
- The panel is read-only. It has no input box.
- **When the panel closes:** if the room is unselected or leaves the list, the panel closes with the chat.

## Non-Functional Requirements

- **Speed:** a character shows within 1 second of the start event.
- **Performance:**
  - The map stays smooth with about 5 sub-agents in each room and 10 rooms.
  - Only moving or working characters tick.
- **Privacy:** logs hold only ids, the type, the status and counts. They never hold prompts, results or tool input.
- **Reliability:**
  - An odd message shape is skipped, never thrown.
  - A finish for an unknown sub-agent is ignored.
- **Code:** strict TS, no `any`, and the conventions file.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` (the 4 events, `subagents` on `RoomSummary`) and `events.ts` if it needs a change.
- **`apps/server/src/`:**
  - `sessions/sdk-event-mapper.ts`: the `Agent` start and end, child routing, and the backgrounded case. The mapper state holds the active sub-agents and their tool counts.
  - `sessions/session-manager.ts`:
    - `subagents` in `toSummary`.
    - `notifyChanged` on start and end.
    - Finish as `stopped` on Stop, Close and query end.
  - `config.ts`: `SUBAGENT_TOOL_EVENTS_MAX = 200`.
- **`apps/web/src/`:**
  - `game/room-view.ts`: the door, the 4 desks, the seat spots, the badge, and managing the sub-agent sprites.
  - `game/subagent-sprite.ts` (new): the walk in and out, the red mark, the label and the click.
  - `game/agent-sprite.ts`: build the look from any seed string, and the error mark if it fits here.
  - `game/office-scene.ts`: tick the moving sprites, show labels only for the open room, and handle the click.
  - `game/fake-rooms.ts`: add `subagents: []`.
  - `features/chat/use-chat-store.ts`: the `subagent` item and the reducer cases for the 4 events.
  - `features/chat/SubagentCard.tsx` (new) and `features/chat/MessageList.tsx`.
  - `features/subagents/SubagentDetails.tsx` (new), plus the open details id (a small store, or a field in the sessions store).
  - `features/chat/ChatPanel.tsx`: show the details panel in place of the chat.
  - `App.tsx`: the Esc guard while the details panel is open.
  - `styles.css`.

## Risks & Assumptions

- **Event names in the SDK:**
  - The S1 spike saw `Agent` with `subagent_type`, `description` and `prompt`, and a top-level `tool_result` at the end.
  - The developer checks this in a real run, with 2 sub-agents running at the same time.
  - If the shape differs, the developer reports it before working around it.
- **Background sub-agents:** I have not seen one in a real run yet. If `task_notification` does not come, the sub-agent ends at the latest when the turn ends, with the status `done`.
- **The room is small:** 4 desks fit in the lower half of a 9 × 6 tile room. If the pixel art looks too crowded, the developer reports it with a screenshot note, and I ask you before resizing rooms.
- **Chrome check:**
  1. In a room on this repo, ask Claude for 2 sub-agents running at the same time (read-only tasks).
  2. Check:
     - 2 characters walk in and sit at their own desks.
     - The badge shows 2 on the map.
     - The labels show only when the room is open.
  3. While they work, reload the page. Both show again.
  4. Click a character. The panel shows the type, the task and live tool calls. The main chat shows no sub-agent tool calls.
  5. When they end, they walk out, and the panel shows the result. The card in the chat opens the same panel.
  6. Start one more sub-agent, and click Stop. It walks out, and the card says "Stopped".
  7. For the error mark, ask Claude for a sub-agent of an unknown type. If that does not make an error, I check it with a fake event in the dev console only.
  8. Clean up afterwards: stop the servers and check that no `claude` process is left.
- **Skip-Testing:** there are no tester tasks. S9.7 and S10.4 (QA) are my Chrome check at Step 6.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: the 4 sub-agent events in `RoomEventSchema`, `subagents` on `RoomSummary`, and the exported types | developer | none | Both apps typecheck. A `subagent_finished` with an unknown status fails to parse and does not throw | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: `Agent` start and end, child routing, the backgrounded case, the 200 limit, `subagents` in the summary, `stopped` on Stop, Close and query end, and the config constant. Real-run check with 2 sub-agents at the same time (S9.1, S9.2, S10.1) | developer | 1 | Two sub-agents at the same time give separate, correct events. The main chat gets no child tool calls. A reload shows the active ones. Stop ends them all as `stopped`. Logs hold no text | same + `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 3 | DONE | Web game: the door, desks, seats, `subagent-sprite.ts` (walk in and out, red mark, type label when zoomed, click), the badge, and ticking (S9.3–S9.6) | developer | 1 | Characters walk in and out at their own seats. No two share a spot. The badge matches. The labels show only in the open room | same |
| 4 | DONE | Web chat: the `subagent` item in the store, `SubagentCard`, `SubagentDetails` over the chat, the open state, and the Esc guard and styles (S10.2, S10.3) | developer | 1 | A card or character click opens the right details. The tool calls are live. The result shows. The panel is read-only. Back and Esc return to the chat | same |
| 5 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` | developer | 2, 3, 4 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A does task 1.
- **Round 2:** these run at the same time, on different files:
  - developer A (backend) does task 2.
  - developer B (game) does task 3.
  - developer C (chat) does task 4.
  - Task 3 and task 4 meet in only one place: a character click sets the open details id. I give both of them the same store name and shape.
- **Round 3:** developer A does task 5.
- **Then:** my review, the Chrome check, and `graphify update .`.
