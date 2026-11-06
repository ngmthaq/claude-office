# S6 — Resume an old session

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 5
- **Depends On:** S3 ([doc](./2026-11-05-start-session-and-chat-story.md))

## User Story

As the developer, I want to resume an old session from history so that I can continue past work in the office.

## Goal

**Problem:** I have many past Claude sessions on this machine. I started them in terminals. Without history, the office only shows new sessions, and I lose my past work context.

**Solution:** The server reads Claude Code's session files in `~/.claude/projects/`. The app shows a History list. Resume opens the session as a room, shows the old messages, and continues with the old context.

**Impact:** All my sessions on this device can live in the office.

## Requirements

### Functional Requirements

- History lists all sessions in `~/.claude/projects/`, grouped by project folder, with the date and the first prompt.
- Resume adds a room, shows the old messages, and continues the session with the SDK resume option.
- If the session is already open, Resume focuses its room.
- Broken lines in a session file are skipped.

### Non-Functional Requirements

- **Reliability:** Claude's file format is internal and can change. Read only the needed fields.
- **Safety:** never write to or change Claude's session files.
- **Performance:** History opens in under 2 seconds with a few hundred sessions.

## Acceptance Criteria

- [ ] Given sessions in `~/.claude/projects/`, when I open History, then I see them grouped by project folder, with the date and the first prompt.
- [ ] Given an old session, when I click Resume, then a room shows on the map and the chat shows the old messages.
- [ ] Given a resumed session, when I send a message, then Claude continues with the old context.
- [ ] Given a session that is already open, when I click Resume, then the app zooms into its room and does not open it twice.
- [ ] Given a session file with broken lines, when the app reads it, then it skips them and shows the rest.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S6.1 | [BE] History reader: scan `~/.claude/projects/`, read only the needed fields, skip bad lines, and return a list | It returns all sessions with their folder, date, and first prompt | — |
| S6.2 | [BE] Load the old messages of one session as shared chat events | An old session shows the same as a live one in the chat | S6.1 |
| S6.3 | [BE] Resume a session with the SDK resume option and add it to `rooms` | A new message continues the old context | S6.1 |
| S6.4 | [FE] History dialog grouped by project, with a Resume button | Resume opens or focuses the room | S6.2, S6.3 |
| S6.5 | [QA] Check the S6 criteria by hand | Every criterion above passes | S6.4 |

## Estimate

- **Points:** 5
- **Reason:** Medium effort, complexity, and uncertainty. The app reads Claude's internal file format, which can change, and turns old messages into chat events.

## Out of Scope

- Live sessions that run in other terminals right now (deferred).
- Search or filters in History.
- Showing old sub-agents as characters.
- Deleting session files.
