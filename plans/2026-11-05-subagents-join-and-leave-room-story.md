# S9 — Sub-agents join and leave the room

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 8
- **Depends On:** S1 ([doc](./2026-11-05-spike-check-agent-sdk-story.md)), S4 ([doc](./2026-11-05-office-map-rooms-root-agents-story.md))

## User Story

As the developer, I want sub-agents to walk into the room when they start and leave when they finish so that I can see the delegated work live.

## Goal

**Problem:** When Claude gives work to sub-agents, it is hard to see how many work at once and when each one ends. In a terminal this is a wall of text.

**Solution:** The server tracks sub-agent start and end events from the SDK stream (using the S1 findings). In the room, each sub-agent is a character that walks in through the door, sits at a desk, and walks out when it is done.

**Impact:** I see the delegated work live. This is the main "office" feeling of the app.

## Requirements

### Functional Requirements

- A new character walks in for each sub-agent that starts. Its label shows its type or task.
- The character walks out when its sub-agent finishes. On an error, it shows a red mark first.
- Sub-agents that run at the same time each get their own character and seat.
- Stop or Close makes all sub-agents leave.
- The map shows how many sub-agents work in each room.
- Active sub-agents show again after a page reload.

### Non-Functional Requirements

- **Speed:** a character shows within 1 second of the start event.
- **Performance:** smooth with about 5 sub-agents in each room and 10 rooms.

## Acceptance Criteria

- [ ] Given the root agent starts a sub-agent, when the start event comes, then a new character walks in through the door within 1 second, with a label for its type or task.
- [ ] Given a sub-agent finishes (success or error), when the end event comes, then its character walks out and is removed. On an error, it shows a red mark first.
- [ ] Given 2 or more sub-agents run at the same time, then each one has its own character, and each one leaves at its own end.
- [ ] Given I stop or close the session, then all sub-agent characters leave.
- [ ] Given the map view, when a room has sub-agents, then the room shows how many are working.
- [ ] Given I reload the page, when the app reconnects, then the sub-agents that are still working show in the room again.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S9.1 | [BE] Track sub-agents from the SDK stream (start, end, parent), using the S1 findings. Send `subagent_started` and `subagent_finished` events | Two sub-agents at the same time give correct, separate events | — |
| S9.2 | [BE] Keep the list of active sub-agents per session, and send it again on reconnect | A reload shows the right sub-agents | S9.1 |
| S9.3 | [FE] Sub-agent state per room in the store | The store matches the server events | S9.1 |
| S9.4 | [FE] Room seats: give each new sub-agent a free desk, or a standing spot when all desks are taken | No two characters share one spot | S9.3 |
| S9.5 | [FE] Sub-agent character: walk in from the door to its seat, walk out, a red mark on error, and a look per type | The walk in and walk out animations play correctly | S9.4 |
| S9.6 | [FE] Sub-agent count badge on rooms in the map view | The badge count matches the active sub-agents | S9.3 |
| S9.7 | [QA] Check the S9 criteria by hand | Every criterion above passes | S9.2, S9.5, S9.6 |

## Estimate

- **Points:** 8
- **Reason:** High effort and high complexity. Sub-agents can run at the same time. It needs walk animations, seat choice, and a reload restore. Uncertainty is medium, and it depends on the S1 findings.

## Out of Scope

- Sub-agent details (S10).
- Chatting with sub-agents.
- Path finding around furniture. A simple straight walk is enough.
- Sub-agents of sub-agents shown as separate characters.
