# Coding Conventions

> The user approved these rules during onboarding (2026-11-05). There was no code yet. Change this file if the real code needs other rules.

## Folder structure

pnpm workspace. Code is split by feature.

```
apps/
  server/src/   # Fastify + Claude Agent SDK
    sessions/   # start, resume, list, and stream sessions
    ws/         # WebSocket routes and events
    db/         # SQLite access and migrations
  web/src/
    features/   # office/, chat/, sessions/ (each has components, hooks, store)
    game/       # PixiJS: scenes, sprites, characters, tile maps
    components/ # shared UI
packages/
  shared/       # shared TS types + event schemas (server <-> web)
assets/         # pixel art: sprites, tile sets
```

## Style (Prettier + ESLint)

- Semicolons: yes.
- Quotes: single.
- Indent: 2 spaces.
- Max line length: 100.
- Trailing commas: all.
- TypeScript `strict` mode. No `any`. Use `unknown` and narrow it.

## Naming

| Thing                   | Rule                 | Example               |
| ----------------------- | -------------------- | --------------------- |
| Files                   | `kebab-case.ts`      | `session-manager.ts`  |
| React components        | `PascalCase.tsx`     | `ChatPanel.tsx`       |
| Variables and functions | `camelCase`          | `startSession`        |
| Types and classes       | `PascalCase`         | `SessionEvent`        |
| Constants               | `UPPER_SNAKE_CASE`   | `MAX_AGENTS_PER_ROOM` |
| React hooks             | start with `use`     | `useActiveRoom`       |
| Zustand stores          | `use-<name>-store.ts`| `use-office-store.ts` |
| PixiJS classes          | end with their role  | `RoomScene`, `AgentSprite` |

## Imports

- Inside an app, use path aliases (`@/...`).
- Across apps, import from `@claude-office/shared`.
- No barrel files (`index.ts`). Only `packages/shared` has one public entry file.

## Code order in a file

1. Imports
2. Types
3. Constants
4. Main export
5. Helpers

## Other rules

- **Events:** every WebSocket message has a typed schema in `packages/shared`. Both sides check it with Zod.
- **State:** use Zustand for UI state. The PixiJS layer reads the store. React does not drive the game loop.
- **Errors (backend):** catch errors at each route and each session stream. Log them and send an `error` event. Never crash the whole server.
- **Errors (frontend):** use one React error boundary for each feature.
- **Logging:** use Fastify's built-in pino logger. Never log API keys or prompts that may hold secrets.
- **Database:** use `better-sqlite3` with plain SQL in `db/`. Add one small migration file for each schema change.
- **Claude sessions:** only the server talks to the Claude Agent SDK. The web app never calls it.
- **Security:** bind the server to `127.0.0.1` only.
- **Testing:** no automated tests (Skip-Testing).
