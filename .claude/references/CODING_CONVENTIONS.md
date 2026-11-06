# Coding Conventions

> The user approved these rules during onboarding (2026-11-05). There was no code yet. Change this file if the real code needs other rules.

## Folder structure

pnpm workspace. The web app is split by feature. The server is split by layer.

```
apps/
  server/src/   # Fastify + Claude Agent SDK
    configs/      # constants and setup (app, sdk, limits, database)
    routes/       # WebSocket route: parse messages and call controllers
    controllers/  # one class per topic: handle an event, call services
    services/     # business logic and the Claude Agent SDK
    repositories/ # data access: SQLite, files, folders, in-memory store
    dtos/         # Zod schemas and types for data that moves between layers
    middlewares/  # request checks, such as the origin check
    utils/        # small shared helpers
    migrations/   # SQL migration files
  web/src/
    features/   # office/, chat/, sessions/ (each has components, hooks, store)
    game/       # PixiJS: scenes, sprites, characters, tile maps
    components/ # shared UI
packages/
  shared/       # shared TS types + event schemas (server <-> web)
assets/         # pixel art: sprites, tile sets
```

## Server layers

A request goes down one way: `routes` → `controllers` → `services` → `repositories`.

- A lower layer never imports an upper layer.
- Any layer can import `dtos`, `configs`, and `utils`.
- No circular imports.

What each folder holds:

| Folder          | Holds                                                         |
| --------------- | ------------------------------------------------------------- |
| `configs/`      | Constants and setup code (ports, limits, database open)       |
| `routes/`       | The WebSocket route: parse a message, send it to a controller |
| `controllers/`  | Handle the events of one area, call services, send the reply |
| `services/`     | Business logic, the event bus, and Claude Agent SDK calls     |
| `repositories/` | Data access: SQL, files, folders, the in-memory session store |
| `dtos/`         | One file per DTO: Zod schema, `z.infer` type, parser if needed |
| `middlewares/`  | Checks that run before a request is handled                   |
| `utils/`        | Small helpers used by many layers                             |
| `migrations/`   | SQL migration files                                           |

Code style for each layer:

| Layer           | Style                                                              |
| --------------- | ------------------------------------------------------------------ |
| `configs/`      | `export const` only. Functions are `const` arrow functions.        |
| `routes/`       | Plain functions                                                    |
| `dtos/`         | One file per DTO: Zod schema, `z.infer` type, parser when needed (like `packages/shared/src/models`) |
| `controllers/`  | Class. Services are passed in the constructor.                     |
| `middlewares/`  | Class                                                              |
| `services/`     | Class                                                              |
| `repositories/` | Class                                                              |
| `utils/`        | Class with static methods                                          |

Server file names use kebab-case with a dot suffix:

- `app.config.ts`
- `ws.route.ts`
- `session.controller.ts`
- `session.service.ts`
- `room.repository.ts`
- `room-row.dto.ts`
- `origin-check.middleware.ts`
- `error.util.ts`

Runtime state types that cannot be Zod schemas (for example `Session`) stay as plain TS
types in the repository that stores them.

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
| Instances of our own classes | class name in camelCase, no short forms | `sessionStoreRepository`, `eventBusService` |

Library instances keep their usual short names: `log`, `db`, `socket`, `app`.

## Imports

- Inside an app, use path aliases (`@/...`). The server uses it for every internal import.
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
- **Database:** use `better-sqlite3` with plain SQL in `repositories/`. Put migration files in `migrations/`. Add one small migration file for each schema change.
- **Claude sessions:** only the server talks to the Claude Agent SDK. The web app never calls it.
- **Security:** bind the server to `127.0.0.1` only.
- **Testing:** no automated tests (Skip-Testing).
