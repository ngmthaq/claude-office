# S4 — Office map, rooms, and root agents

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 8
- **Depends On:** S3 ([doc](./2026-11-05-start-session-and-chat-story.md))

## User Story

As the developer, I want an office map with one room and one root agent for each session so that I can see all sessions and their state at a glance.

## Goal

**Problem:** A plain list does not show which sessions are busy, idle, or waiting for me. I must click each one to find out.

**Solution:** A pixel 2D office map drawn with PixiJS. Each session is a room with a root agent character. The character's look shows the session state. Click a room to zoom in and open its chat.

**Impact:** I see the state of every session at a glance. This is the core look of the app.

## Requirements

### Functional Requirements

- The map shows one room for each open session, with a name label.
- New sessions add a new room right away.
- The root agent shows 3 states: idle, working, and waiting for me.
- Click a room to zoom in and open its chat. Back or Esc returns to the map.
- The server sends `session_state` events.

### Non-Functional Requirements

- **Performance:** about 60 FPS with 10 rooms.
- **Look:** pixel-perfect scaling, so the art stays sharp at any window size.
- **Code:** React does not drive the game loop. The PixiJS layer reads the Zustand store.

## Acceptance Criteria

- [ ] Given 3 sessions, when I open the app, then the map shows 3 rooms, each with a name label and a root agent.
- [ ] Given I start a new session, when it is created, then a new room shows on the map.
- [ ] Given a session's state changes, when it becomes idle, working, or waiting for me, then the root agent's animation or icon changes to match.
- [ ] Given the map, when I click a room, then the view zooms into that room and its chat opens. When I press Back or Esc, then the view returns to the map.
- [ ] Given 10 rooms, when all of them are on screen, then the map stays smooth (about 60 FPS).

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S4.1 | [FE] Set up the PixiJS canvas in `apps/web/src/game` with pixel-perfect scaling, mounted inside React | The canvas shows a test sprite, sharp at any window size | — |
| S4.2 | [FE] Office map scene: draw a floor from tiles and place one room for each session in a grid, with labels | Rooms show and update when the session list changes | S4.1 |
| S4.3 | [FE] Root agent character with idle, working, and waiting looks, driven by the store | Each state shows a clear different look | S4.2 |
| S4.4 | [BE] Send `session_state` events (idle, working, waiting) | The state in the browser matches the real session | — |
| S4.5 | [FE] Camera: zoom into a room on click and back to the map on Back or Esc, and open the right chat | Clicking any room opens its own chat | S4.2 |
| S4.6 | [QA] Check the S4 criteria by hand, plus FPS with 10 rooms | Every criterion above passes | S4.3–S4.5 |

## Estimate

- **Points:** 8
- **Reason:** High effort and medium complexity. It uses a new library (PixiJS) and new art. It needs the map, the camera, and character states. Uncertainty is medium.

## Out of Scope

- Sub-agent characters (S9).
- The permission bubble (S5).
- The closed-room look (S7).
- Moving rooms by hand, or custom office layouts.
- Custom character looks.
