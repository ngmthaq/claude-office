# Title: Plan — Clean up files not needed by the app

- Classification: feature
- Description: Delete the old spike, old graphify cache and snapshot files, the stale web build, and the fake-rooms dev tool. Then remove every reference to them.

---

## Approach Summary / Goal

- Delete the four items you picked. Then fix every config line and code path that points to them, so lint, typecheck, and the dev server still work.
- The fake-rooms dev tool is not only two files. `use-sessions-store.ts`, `ws-client.ts`, and `use-mcp-store.ts` also have "fake room" logic, and it all goes.
- Goal: a smaller repo with no dead code or dead config, and the app works the same.

## Functional Requirements

- `spikes/` no longer exists, and `.gitignore`, `.prettierignore`, and `eslint.config.js` no longer list `spikes`.
- `graphify-out/cache/` and `graphify-out/2026-11-06/` are deleted. `graph.json`, `GRAPH_REPORT.md`, `graph.html`, `manifest.json`, and the label files stay.
- `apps/web/dist/` is deleted from disk.
- `fake-rooms.ts` and `fps-meter.ts` are deleted. `startDevTools()` and its `import.meta.env.DEV` block in `GameCanvas.tsx` are removed. `FAKE_ROOM_PREFIX`, `isFakeRoomId`, `isFakeRoom`, and `setFakeRooms` are removed from the sessions store, and their checks are removed from `ws-client.ts` and `use-mcp-store.ts`.
- `pnpm typecheck`, `pnpm lint`, and `pnpm --filter @claude-office/web build` all pass.

## Non-Functional Requirements

- `apps/server/data/` (your SQLite data), `plans/`, `assets/`, and `.claude/` are not touched.
- No change to how the app behaves for real sessions.

## Files in Scope

- Delete: `spikes/agent-sdk/` (whole folder), `graphify-out/cache/`, `graphify-out/2026-11-06/`, `apps/web/dist/`, `apps/web/src/game/fake-rooms.ts`, `apps/web/src/game/fps-meter.ts`
- Change: `.gitignore`, `.prettierignore`, `eslint.config.js`, `apps/web/src/game/GameCanvas.tsx`, `apps/web/src/features/sessions/use-sessions-store.ts`, `apps/web/src/features/connection/ws-client.ts`, `apps/web/src/features/mcp/use-mcp-store.ts`

## Risks & Assumptions

- `plans/spike-agent-sdk.md` and older plans still mention `spikes/`. We keep them as history, as you asked.
- graphify may make `graphify-out/cache/` again on the next `graphify update .`. If you want it to stay out of git, I can add it to `.gitignore`. I left this out because you did not ask for it.
- After this, there is no built-in way to load-test the office with 50 rooms.
- Testing workflow is `Skip-Testing`, so there is no tester task. Typecheck, lint, and build are the checks.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Delete `spikes/agent-sdk/`, `graphify-out/cache/`, `graphify-out/2026-11-06/`, `apps/web/dist/`. Remove the `spikes` lines from `.gitignore`, `.prettierignore`, `eslint.config.js`. | developer | none | The paths are gone; no `spikes` in the 3 config files; `pnpm lint` passes | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Remove the fake-rooms dev tool: delete `fake-rooms.ts` and `fps-meter.ts`; remove `startDevTools()` and the DEV block in `GameCanvas.tsx`; remove `FAKE_ROOM_PREFIX`, `isFakeRoomId`, `isFakeRoom`, `setFakeRooms` and their uses in `use-sessions-store.ts`, `ws-client.ts`, `use-mcp-store.ts` | developer | none | `grep -ri "fake" apps/web/src` finds nothing; `pnpm typecheck`, `pnpm lint`, and the web build pass | `guides/CLEAN_CODE/ENTRY_POINT.md` |

Tasks 1 and 2 touch different files, so two developer sub-agents can run them at the same time.
