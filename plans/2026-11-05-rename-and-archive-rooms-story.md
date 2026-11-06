# S8 — Rename and archive rooms

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 3
- **Depends On:** S4 ([doc](./2026-11-05-office-map-rooms-root-agents-story.md))

## User Story

As the developer, I want to rename and archive rooms so that my office stays clear and easy to read.

## Goal

**Problem:** Rooms get default names (like the folder name), and they are hard to tell apart. Closed rooms stay on the map forever, so the office gets full.

**Solution:** I can give each room a custom name. Archive removes a room from the map. The session stays in History. An Archived list lets me restore it.

**Impact:** The map only shows the work I care about now.

## Requirements

### Functional Requirements

- Rename a room from its label on the map or from the session list.
- Archive removes a room from the map. If the session is running, the app closes it first, after I confirm.
- The Archived list shows archived rooms, with a Restore button.
- Names and archive state stay after a restart.

### Non-Functional Requirements

- **Safety:** Archive never deletes Claude's session files.

## Acceptance Criteria

- [ ] Given a room, when I rename it, then the new name shows on the map and in the list, and it stays after a restart.
- [ ] Given a room, when I archive it, then it leaves the map. If it is running, the app closes it first, after I confirm.
- [ ] Given archived rooms, when I open the Archived list and click Restore, then the room comes back to the map.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S8.1 | [DB] Migration: add a custom name and an archived date to `rooms` | The migration runs on an existing DB | — |
| S8.2 | [BE] Rename, archive, and restore actions | The actions save to the DB and send update events | S8.1 |
| S8.3 | [FE] Rename on the room label and in the list. Archive button. Archived list with Restore | All three actions work from the UI | S8.2 |
| S8.4 | [QA] Check the S8 criteria by hand | Every criterion above passes | S8.3 |

## Estimate

- **Points:** 3
- **Reason:** Low effort, complexity, and uncertainty. A simple DB change, three actions, and small UI parts.

## Out of Scope

- Deleting sessions or session files.
- Grouping rooms into floors or teams.
- Changing the session title inside Claude Code's own files.
