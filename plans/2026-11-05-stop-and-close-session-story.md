# S7 — Stop and close

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 5
- **Depends On:** S3 ([doc](./2026-11-05-start-session-and-chat-story.md)), S4 ([doc](./2026-11-05-office-map-rooms-root-agents-story.md))

## User Story

As the developer, I want to stop Claude or close a session so that I can control runaway or finished work.

## Goal

**Problem:** Sometimes Claude goes the wrong way, or a session is done. Without Stop and Close, the process keeps running and uses tokens and machine power.

**Solution:** Stop interrupts Claude's current turn. Close ends the session process, but the room stays on the map with its lights off. A new message wakes it up again.

**Impact:** I keep control of cost and of my machine. The map shows which sessions are active.

## Requirements

### Functional Requirements

- A Stop button interrupts Claude. The session goes back to idle.
- A Close button ends the session process. The room shows with its lights off.
- Close asks me to confirm when Claude is working.
- A new message to a closed room starts the session again.
- Stop and Close clear pending permissions and sub-agents.
- After a server restart, all rooms show as closed.

### Non-Functional Requirements

- **Speed:** Stop takes effect within a few seconds.
- **Clean up:** no Claude process is left running after Close.

## Acceptance Criteria

- [ ] Given Claude is working, when I click Stop, then it stops within a few seconds, the state becomes idle, and I can send a new message.
- [ ] Given an open session, when I click Close, then Claude's process ends and the room stays on the map with its lights off.
- [ ] Given a closed room, when I click it and send a message, then the session starts again.
- [ ] Given Claude is working, when I click Close, then the app asks me to confirm first.
- [ ] Given a session with pending permissions or sub-agents, when I stop or close it, then they are cleared.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S7.1 | [BE] Stop (SDK interrupt) and Close actions. Clear pending permissions and sub-agents | Both actions work, and no process is left running | — |
| S7.2 | [BE] On server start, mark the rooms in the DB as closed | After a restart, the rooms show as closed, not as broken | — |
| S7.3 | [FE] Stop button in the chat, and a Close button with a confirm step | The buttons call the actions and the UI updates | S7.1 |
| S7.4 | [FE] "Lights off" look for closed rooms, and wake on the next message | Closed rooms look different and wake up | S7.1, S7.2 |
| S7.5 | [QA] Check the S7 criteria by hand | Every criterion above passes | S7.3, S7.4 |

## Estimate

- **Points:** 5
- **Reason:** Medium effort and complexity, low uncertainty. It needs cleanup across permissions, sub-agents, and server restarts, plus a new room look. I was between 3 and 5, so I picked 5.

## Out of Scope

- Removing a room from the map (that is Archive, S8).
- Deleting session files.
- Auto-closing idle sessions.
