# Title: Plan — Split shared events into one file per event

- Classification: feature
- Description: Move every event and shared sub-schema in `packages/shared` into small single-purpose files under `events/` and `models/`, with no change to the public API.

---

## Approach Summary / Goal

- Each event schema and its `z.infer` type move into their own file in a flat `packages/shared/src/events/` folder.
- Shared sub-schemas that are not events (enums, `RoomSummary`, entries, `roomLabel`, `ROOM_NAME_MAX`) each move into their own file in `packages/shared/src/models/`.
- The three unions (`ServerEventSchema`, `ClientEventSchema`, `RoomEventSchema`) and the parse helper get their own files. `index.ts` re-exports everything, so all 29 importing files in `apps/` keep working with no changes.
- Goal: small files that are easy to find and change, with the exact same exported names and the same runtime behaviour.

## Functional Requirements

- Every name exported today from `@claude-office/shared` is still exported, with the same name, schema, and type.
- `parseServerEvent` and `parseClientEvent` behave exactly as they do now (same `ParseResult` / `ParseFailure` shape).
- No per-event parse functions are added.
- `events.ts` and `session-events.ts` are deleted.

## Non-Functional Requirements

- Follow `CODING_CONVENTIONS.md`: `kebab-case.ts` files, single quotes, semicolons, 2-space indent, imports with the `.ts` extension (same as today), and code ordered as imports → schema → type → helpers.
- No barrel `index.ts` inside `events/` or `models/`. Only `src/index.ts` stays as the public entry.
- No circular imports. `models/` never imports from `events/`.
- `pnpm typecheck` passes for every workspace package. `pnpm lint` and `pnpm format:check` pass for `packages/shared`.

## Files in Scope

**Create `packages/shared/src/models/`** (14 files):
`session-state.ts`, `permission-mode.ts`, `permission-decision.ts`, `subagent-status.ts`, `subagent-ref.ts`, `room-summary.ts` (+ `ROOM_NAME_MAX`, `roomLabel`), `folder-entry.ts`, `archived-room.ts`, `session-notice-kind.ts`, `history-entry.ts`, `slash-command-entry.ts`, `file-entry.ts`, `mcp-server-status-value.ts`, `mcp-server-entry.ts`

**Create `packages/shared/src/events/`** — 46 event files:
- Client (19): `ping`, `folders-list`, `session-start`, `session-send`, `session-open`, `permission-answer`, `history-list`, `session-resume`, `session-stop`, `session-close`, `room-rename`, `room-permission-mode`, `room-archive`, `room-remove`, `room-restore`, `archived-list`, `commands-list`, `files-list`, `mcp-list`
- Server (27): `hello`, `pong`, `error`, `user-message`, `assistant-text`, `tool-call`, `tool-result`, `turn-done`, `session-error`, `auth-error`, `folders`, `sessions`, `session-started`, `session-history`, `session-state`, `permission-request`, `permission-resolved`, `session-notice`, `subagent-started`, `subagent-tool-call`, `subagent-tool-result`, `subagent-finished`, `history`, `archived`, `commands`, `files`, `mcp-status`

  Plus 4 more files: `room-event.ts` (`RoomEventSchema` + type), `server-event.ts` (`ServerEventSchema` + type + `parseServerEvent`), `client-event.ts` (`ClientEventSchema` + type + `parseClientEvent`), `parse.ts` (`ParseResult`, `ParseFailure`, `parseWith`, `safeJsonParse`, `readEventType`).

**Change:** `packages/shared/src/index.ts` (explicit `export *` line for every new file)
**Delete:** `packages/shared/src/events.ts`, `packages/shared/src/session-events.ts`

## Risks & Assumptions

- Assumption: `events/session-state.ts` (the `session_state` event) and `models/session-state.ts` (the enum) share a basename. That is fine because they live in different folders.
- Assumption: `ROOM_NAME_MAX` and `roomLabel` go in `models/room-summary.ts`.
- Assumption: `parseWith` is exported from `parse.ts` so the union files can use it, but `index.ts` re-exports only `ParseResult` and `ParseFailure` from it. That keeps the public API the same as today.
- Risk: `index.ts` has about 64 export lines. If a file is missed, the name disappears from the API. The typecheck across `apps/` will catch this.
- Testing: the project uses Skip-Testing, so there is no tester task. The check is typecheck plus lint.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Create the 14 `models/*.ts` files listed above. Copy each schema, its `z.infer` type, and (for `room-summary.ts`) `ROOM_NAME_MAX` + `roomLabel` word for word from `session-events.ts`. | developer | none | All 14 files exist. Schemas match the originals exactly. No imports from `events/`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Create the 46 event files in `events/`. Each file has one schema plus its type, and imports any sub-schemas from `../models/*.ts` or other event files. | developer | none (file names fixed in plan; runs in parallel with 1) | 46 files exist. Each holds exactly one event schema and its type. The content matches the originals exactly. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | Create `events/parse.ts`, `events/room-event.ts`, `events/server-event.ts`, `events/client-event.ts`. Rewrite `src/index.ts` to export every new file. Delete `events.ts` and `session-events.ts`. Run `pnpm typecheck`, `pnpm exec eslint packages/shared`, `pnpm exec prettier --check packages/shared`, then `graphify update .`. | developer | tasks 1, 2 | Union members and their order stay the same. Old files are gone. Typecheck, lint, and prettier pass with no app changes. The graph is updated. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
