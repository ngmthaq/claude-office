# Title: Plan — Refactor the server into a layered structure (v2)

- Classification: feature
- Description: Move `apps/server/src` from feature folders (`sessions/`, `ws/`, `db/`) into layer folders (`configs`, `routes`, `controllers`, `services`, `repositories`, `dtos`, `middlewares`, `utils`). Each layer uses one fixed code style. The app works the same as before.

---

## Approach Summary / Goal

- Each request flows down one way: **route → controller → service → repository**. Lower layers never import upper layers.
- Each layer has one code style (see the table below).
- `session-manager.ts` (882 lines) splits by job into 5 service classes. They share an in-memory session store and an event bus.
- Goal: small files with one job each, the same style in each layer, and the same WebSocket behaviour.

### Code style per layer

| Layer | Style | Example |
| --- | --- | --- |
| `configs/` | `export const` only. Functions are `const` arrow functions. | `export const PORT = …`, `export const openDatabase = (): Database.Database => { … }` |
| `routes/` | Plain functions | `export async function registerWsRoute(app, options) { … }` |
| `dtos/` | One file per DTO, like `packages/shared/src/models`: a Zod schema, a `z.infer` type, and a parser when needed | `RoomRowSchema`, `type RoomRow`, `parseRoomRow()` |
| `controllers/` | Class, services passed in the constructor | `class SessionController` |
| `middlewares/` | Class | `class OriginCheckMiddleware { handle(request, reply) }` |
| `services/` | Class | `class SessionService` |
| `repositories/` | Class | `class RoomRepository`, `class HistoryRepository` |
| `utils/` | Class with static methods | `ErrorUtil.errorName(error)` |

## Functional Requirements

- Every client event type (20) gets the same reply, the same error code, and the same broadcast as today.
- Start-up order stays the same: open DB → run migrations → register websocket → load closed rooms → register route → listen on `127.0.0.1:4317`.
- The origin check still blocks other origins with `403 { error: 'forbidden_origin' }`.
- Migrations still run from the new folder. The existing DB file still works. No schema change.
- `packages/shared` and `apps/web` do not change.

## Non-Functional Requirements

- Layer rules: `routes` → `controllers` → `services` → `repositories`. Any layer can import `dtos`, `configs`, and `utils`. No circular imports.
- File names: kebab-case with a dot suffix (`session.service.ts`, `room-row.dto.ts`, `error.util.ts`, `ws.route.ts`).
- All imports inside the server use the `@/` alias (it already exists in `tsconfig.json`). Keep the `.ts` extension.
- Follow `CODING_CONVENTIONS.md`: code order, no `any`, no barrel `index.ts`, log rules.
- Move code; do not rewrite logic. No new features.
- `pnpm typecheck`, `pnpm lint`, and `prettier --check apps/server` pass.

## Files in Scope

All paths are under `apps/server/src/`.

**Create**

| Folder | Files | Comes from |
| --- | --- | --- |
| `configs/` | `app.config.ts` (HOST, PORT, SERVER_VERSION, DATA_DIR, HOME_DIR, ALLOWED_ORIGINS) | `config.ts` |
| | `sdk.config.ts` (SETTING_SOURCES, SDK_EXTRA_ARGS, PERMISSION_DENY_MESSAGE, ASK_IN_CHAT_*) | `config.ts` |
| | `limits.config.ts` (ROOM_EVENT_BUFFER_MAX, STOP_TIMEOUT_MS, TOOL_RESULT_MAX_CHARS, SUBAGENT_TOOL_EVENTS_MAX, HISTORY_TEXT_MAX, ROOM_NAME_MAX, COMMANDS_TIMEOUT_MS, MCP_STATUS_TIMEOUT_MS) | `config.ts`, `session-manager.ts` |
| | `database.config.ts` (DB_PATH, MIGRATIONS_DIR, `openDatabase` and `runMigrations` as `const` arrow functions) | `config.ts`, `db/database.ts`, `db/migrate.ts` |
| `migrations/` | `0001`–`0004` `.sql` (moved as is) | `db/migrations/` |
| `dtos/` | `room-row.dto.ts` (schema for the raw SQLite row, changed to camelCase, `RoomRow` type, `parseRoomRow()`; it replaces `toRoomRow`) | `db/rooms-repo.ts` |
| | `start-result.dto.ts`, `resume-result.dto.ts` (+ `ResumeErrorCode`), `command-list.dto.ts`, `mcp-status-list.dto.ts` (schemas + types; they reuse schemas from `@claude-office/shared`) | `session-manager.ts` |
| | `folder-error-code.dto.ts` (enum schema + type) | `sessions/folder-browser.ts` |
| `repositories/` | `room.repository.ts` (`RoomRepository`, was `RoomsRepo`) | `db/rooms-repo.ts` |
| | `session-store.repository.ts` (`SessionStoreRepository`: in-memory `Map` with get, set, delete, values, findBySessionId; also holds the plain TS types `Session` and `PendingPermission`) | `session-manager.ts` |
| | `history.repository.ts`, `file.repository.ts`, `folder.repository.ts`, `command.repository.ts` (classes) | `sessions/history-reader.ts`, `file-index.ts`, `folder-browser.ts`, `command-catalog.ts` |
| `services/` | `event-bus.service.ts` (listeners and their types, `emit`, state event, `notifyChanged`, `notifyArchivedChanged`) | `session-manager.ts` |
| | `permission.service.ts`, `session.service.ts`, `room.service.ts`, `catalog.service.ts` | `session-manager.ts` |
| | `sdk-event-mapper.service.ts` (`SdkEventMapperService`; methods take `MapperState`, same as today) | `sessions/sdk-event-mapper.ts` |
| `utils/` | `error.util.ts` (`ErrorUtil.errorName`), `async.util.ts` (`AsyncUtil.withTimeout`), `text.util.ts` (`TextUtil.cutStrings`), `ws-send.util.ts` (`WsSendUtil.send/trySend/broadcast/errorEvent`), `session-mapper.util.ts` (`SessionMapperUtil.toSummary/closedSession/errorEvent`), `input-queue.util.ts` (class `InputQueue`, as is) | `session-manager.ts`, `ws/ws-route.ts` |
| `middlewares/` | `origin-check.middleware.ts` (`OriginCheckMiddleware`) | `ws/origin-check.ts` |
| `controllers/` | `session`, `room`, `permission`, `folder`, `file`, `command`, `mcp`, `history`, `system` (ping) `.controller.ts` | the `ws/ws-route.ts` switch |
| `routes/` | `ws.route.ts` (plain function: `/ws`, socket set, broadcast hooks, parse, dispatch to controllers) | `ws/ws-route.ts` |

**Change:** `main.ts` (wire the new classes), `apps/server/package.json` (add `zod: ^4.0.0`, the same version as `packages/shared`), `pnpm-lock.yaml`, `.claude/references/CODING_CONVENTIONS.md`.

**Delete:** `config.ts`, `sessions/`, `ws/`, `db/`.

## Risks & Assumptions

- **Assumption:** `utils/` is a new folder you did not list. It holds helpers used by many layers, as static-method classes. `InputQueue` and the session mappers (`toSummary`, `closedSession`) also go here.
- **Assumption:** each DTO gets its own file, the same as `packages/shared/src/models`.
- **Assumption:** the service dependency order is `event-bus` ← `permission` ← `session` ← `room`, `catalog`. This order has no cycles.
- **Assumption:** `ping` goes to `system.controller.ts`. `permission_answer` goes to `permission.controller.ts`. `room_permission_mode` goes to `room.controller.ts`.
- **Risk:** `parseRoomRow()` now checks every DB row with Zod. Today the code only maps the fields. If an old row has a bad value (for example an unknown `permission_mode`), the parser now throws. The current DB rows should all pass because migrations set the defaults. The smoke run checks this.
- **Risk:** splitting the 882-line class can change the order of side effects (for example close → cancel permissions → emit notice). The developer must keep the same call order in each method.
- **Risk:** `MIGRATIONS_DIR` moves. If the path is wrong, start-up fails. The smoke run catches this.
- **Risk:** port 4317 may already be in use by your dev server. If so, the smoke run uses `PORT=4399`.
- Testing: the project uses Skip-Testing, so there is no tester task. The checks are typecheck, lint, prettier, and a start-up smoke run.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | TODO | Add `zod` to `apps/server/package.json` and run `pnpm install`. Create the bottom layers: `configs/*`, `migrations/*.sql`, `dtos/*`, `utils/*`, `repositories/*`, `services/sdk-event-mapper.service.ts`. Use the per-layer style table. Use `@/` imports. Do not delete old files yet. | developer | none | All listed files exist and follow the style table. Logic matches the source code (only structure, names, and imports change). These folders import no `controllers/` or `routes/`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | TODO | Split `session-manager.ts` into the `EventBusService`, `PermissionService`, `SessionService`, `RoomService`, and `CatalogService` classes. Use the store, DTOs, and utils from task 1. Keep each method body and call order the same. | developer | task 1 | 5 service classes exist. Every public method of `SessionManager` exists on one service with the same parameters and return type. No circular imports. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | TODO | Create `OriginCheckMiddleware`, the 9 controller classes, and the `registerWsRoute` function in `routes/ws.route.ts`. Change `main.ts` to wire everything. Delete `config.ts`, `sessions/`, `ws/`, `db/`. Run `pnpm typecheck`, `pnpm lint`, `pnpm exec prettier --check apps/server`. Start the server (`PORT=4399` if 4317 is busy). Check the "migrations applied", "closed rooms loaded", and "listening" logs, then stop it. Run `graphify update .`. | developer | task 2 | Old folders are gone. Each of the 20 event types maps to one controller method with the same reply and error code. All checks pass. The server starts with no error. The graph is updated. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | TODO | Update the server part of the folder tree in `.claude/references/CODING_CONVENTIONS.md`. Add a short "Server layers" section with the layer order, what each folder holds, the per-layer style table, the dot-suffix naming, and the `@/` import rule. | developer | none (runs in parallel with task 1) | The doc shows the new tree and rules in plain English. Nothing else in the doc changes. | `.claude/references/AGENT_RULES.md` |
