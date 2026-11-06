# Title: Plan — S4 Office map, rooms, and root agents

- Classification: feature
- Description: Add a PixiJS office map where each open session is a room with a root agent. The agent shows idle, working or waiting. The server sends a new `session_state` event. Clicking a room zooms in and slides the chat in from the right.

---

## Approach Summary / Goal

- **Server:** each room gets a `state` field (`idle`, `working` or `waiting`). The server sends `session_state` whenever the state changes. In S4 only `idle` and `working` are sent. `waiting` is in the schema now, and S5 will start sending it.
- **Game layer:** new code in `apps/web/src/game/`. It reads the Zustand store with `subscribe`, and React does not drive the game loop. React only mounts the canvas.
- **Art:** floor tiles, desks and layered characters come from the Kenney sheets. Walls are pixel rectangles drawn in code. Scaling is nearest-neighbour with rounded pixels.
- **Goal:** you see every session's state at a glance. One click opens a room's chat, and Back or Esc closes it.

## Functional Requirements

- **Shared:**
  - Add `SessionStateSchema = 'idle' | 'working' | 'waiting'`.
  - Add `state` to `RoomSummary`. Keep `busy`.
  - Add the server event `session_state {roomId, state}`.
- **Server:**
  - A new room starts as `idle`.
  - Sending a message sets it to `working`.
  - `turn_done`, `session_error` or `auth_error` set it back to `idle`.
  - Each change broadcasts `session_state`, and the `sessions` broadcast includes `state`.
- **Map:**
  - Each open session has one room in a grid, with about √n columns.
  - Each room has a tiled floor, walls drawn in code, a desk, and a label with the folder's base name.
  - A new session adds its room right away.
  - When no room is open, the map shows all rooms and they fit on screen.
- **Root agent:** a person built from layers (body, clothes, hair). Each room gets a different look, picked in a fixed way from its room id. The 3 states look different:
  - `idle`: the agent stands still.
  - `working`: the agent bobs 1px and shows an animated "…" bubble.
  - `waiting`: a yellow "!" bubble blinks.
- **Camera and layout:**
  - When you click a room, the camera zooms smoothly onto it and the chat panel slides in on the right.
  - A Back button in the chat, or Esc, closes the chat and zooms back out to the map.
  - Clicking a name in the session list does the same as clicking its room.
- **Dev-only fake rooms:**
  - In dev mode only, `?fakeRooms=N` adds N fake rooms to the store. Their states cycle every few seconds. They are never sent to the server.
  - An FPS readout shows in a corner while fake rooms are on.

## Non-Functional Requirements

- **Speed:** about 60 FPS with 10 rooms. The ticker does no work when nothing changes. Textures are sliced once and reused.
- **Look:**
  - The art stays sharp at any window size. Scaling is `nearest`, pixels are rounded, the map zoom is a whole number when the screen is big enough, and resize is handled.
  - Labels are easy to read at both zoom levels.
- **Code:**
  - No `any` and strict TS.
  - PixiJS classes end with their role: `OfficeScene`, `RoomView`, `AgentSprite`, `CameraController`.
  - Files are kebab-case.
  - The Pixi app is destroyed when its component unmounts, so StrictMode does not leave two canvases.
- **Errors:** the map has its own error boundary. If the canvas fails, the session list and the chat still work.
- **Privacy:** logs hold no prompt or reply text, the same as S3.

## Files in Scope

- **`packages/shared/src/`:** `session-events.ts` and `events.ts`.
- **`apps/server/src/sessions/session-manager.ts`:** set the state and emit the event. Also `ws/ws-route.ts`, only if it is needed to broadcast the new event.
- **`apps/web`:**
  - `package.json`: add `pixi.js` ^8.22.
  - `vite.config.ts` and `tsconfig.json`: add the `@assets` alias to the root `assets/` folder.
- **`apps/web/src/game/` (new):**
  - `pixi-app.ts`
  - `GameCanvas.tsx`
  - `asset-loader.ts` (slices tiles with a 17px step)
  - `office-scene.ts`
  - `room-view.ts`
  - `agent-sprite.ts`
  - `camera-controller.ts`
  - `fake-rooms.ts` (dev only)
  - `fps-meter.ts` (dev only)
- **`apps/web/src` changes:**
  - `features/sessions/use-sessions-store.ts`: handle `session_state`.
  - `features/connection/ws-client.ts`: route `session_state`, and skip `session_open` for fake rooms.
  - `features/chat/ChatPanel.tsx`: add the Back button.
  - `App.tsx`: the new layout.
  - `styles.css`: the slide-in panel.

## Risks & Assumptions

- **Label:** in S4 the room name is the folder's base name. Two rooms on the same folder get the same name. Custom names come in S8.
- **Art fit:** the Kenney art is a home or medieval style with no computers, so a desk or table stands in for a workstation. If it looks wrong, we can add an office pack later.
- **Assets path:** `assets/` is outside `apps/web`. Vite lets dev mode read the workspace root. If the build cannot read it, the developer reports this, and I ask you before going on.
- **Waiting look check:** the server cannot send `waiting` yet. I check that look with fake rooms, whose states cycle through all 3, and by setting the store by hand in Chrome.
- **Selection on start:** if S3 already selects a new session when it starts, the camera zooms into the new room at once. I keep that behavior.
- **Skip-Testing:** there are no tester tasks. S4.6 (QA) is my Chrome check at Step 6, with 2 or 3 real sessions and `?fakeRooms=10` for FPS.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared + server: `SessionStateSchema`, `state` on `RoomSummary`, `session_state` event. The session manager sets idle or working and broadcasts on change (S4.4) | developer | none | A send gives `session_state working`, and `turn_done` gives `idle`. A new room starts `idle`. Both apps typecheck. Logs hold no text | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Web: add `pixi.js`, the `@assets` alias, `pixi-app.ts` (nearest scaling, `roundPixels`, resize), `asset-loader.ts`, and `GameCanvas.tsx` mounted in `App.tsx` inside its own error boundary (S4.1) | developer | none | The canvas shows a tile from the sheet, sharp at any window size. There is one canvas in StrictMode, and it is destroyed on unmount | same |
| 3 | DONE | `OfficeScene` + `RoomView`: tiled floor, walls drawn in code, a desk, a label, a grid layout, and a store subscription that adds and removes rooms. Clicking a room calls `select(roomId)` (S4.2) | developer | 1, 2 | Rooms match the store. A new session adds a room right away. Labels show the folder base name | same |
| 4 | DONE | `AgentSprite`: a layered character, picked in a fixed way from the room id, with idle, working and waiting looks driven by `state` (S4.3) | developer | 3 | Each state looks clearly different. A state change in the store updates the look within one frame | same |
| 5 | DONE | `CameraController` + layout: fit all rooms when nothing is selected, and zoom smoothly to the selected room. The chat slides in on the right with a Back button. Esc unselects. The list click does the same as a room click (S4.5) | developer | 3 | Clicking any room opens its own chat. Back and Esc both return to the full map. Window resize keeps the right framing | same |
| 6 | DONE | Dev only: `fake-rooms.ts` (`?fakeRooms=N`, states cycle, never sent to the server) and `fps-meter.ts` overlay. Both are guarded by `import.meta.env.DEV` | developer | 4, 5 | `?fakeRooms=10` shows 10 rooms and an FPS number. The server log has no `room_not_found` for fake ids. Neither file is in the production build | same |
| 7 | DONE | Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` on everything | developer | 1–6 | All three pass | same |

**Delegation order:**

- **Round 1:** developer A (backend) does task 1. At the same time, developer B (frontend) does task 2. They touch different files.
- **Round 2:** developer B does tasks 3 to 7 in order, so it keeps the game context.
- **Then:** I do my review, then the Chrome check (S4.6, with real sessions and `?fakeRooms=10`), then run `graphify update .`.
