# S2 — App foundation

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 5
- **Depends On:** —

## User Story

As the developer, I want a working app skeleton (server, web, shared types, DB, art) so that every feature has a base to build on.

## Goal

**Problem:** The repo has no code yet. Every feature needs the same base: a server, a web app, a safe link between them, shared message types, a database, and pixel art. If each story builds its own part of this, the code will not match.

**Solution:** Set up the pnpm monorepo, the Fastify server with WebSocket, the shared Zod event schemas, SQLite with migrations, the React app shell, and the art assets, all once and in one way.

**Impact:** Later stories only add features. They follow one pattern from `CODING_CONVENTIONS.md`.

## Requirements

### Functional Requirements

- `pnpm dev` starts the server and the web app together.
- The server has a WebSocket route. The web app connects to it and shows the connection state.
- The web app reconnects by itself when the server restarts.
- Both sides check every WebSocket message with the shared Zod schemas.
- The server creates the SQLite file and runs the migrations at startup.
- `assets/` holds the chosen pixel office packs, and `assets/CREDITS.md` lists their licenses.

### Non-Functional Requirements

- **Security:** the server listens on `127.0.0.1` only.
- **Logging:** use the pino logger. Never log secrets.
- **Code style:** TypeScript strict mode, with ESLint and Prettier set up as in `CODING_CONVENTIONS.md`.
- **Licenses:** every asset must allow this use (CC0 or similar).

## Acceptance Criteria

- [ ] Given a fresh clone, when I run `pnpm install` and `pnpm dev`, then the server and the web app both start.
- [ ] Given the server runs, when another device on the network tries to connect, then the connection fails. The server listens on `127.0.0.1` only.
- [ ] Given the web app is open, when the server restarts, then the app shows "disconnected" and reconnects by itself.
- [ ] Given a WebSocket message with a bad shape, when either side gets it, then that side rejects it and logs it without crashing.
- [ ] Given a fresh machine, when the server starts, then it creates the SQLite file and runs the migrations.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S2.1 | [DevOps] Set up a pnpm workspace with `apps/server`, `apps/web`, and `packages/shared`, plus strict TS, ESLint, Prettier, and path aliases | `pnpm dev` starts both apps. `pnpm lint` passes | — |
| S2.2 | [BE] Fastify server on `127.0.0.1` with a WebSocket route and the pino logger in `apps/server/src/ws` | The browser connects and gets a `hello` event | S2.1 |
| S2.3 | [BE] Shared event schemas with Zod in `packages/shared`, checked on both sides | A bad message is rejected and logged on each side | S2.1 |
| S2.4 | [DB] SQLite setup with `better-sqlite3` and a simple migration runner in `apps/server/src/db` | The migrations run on a fresh DB file at startup | S2.1 |
| S2.5 | [FE] React + Vite app shell with a Zustand store and a WebSocket client that reconnects | The app shows the connection state and reconnects after a server restart | S2.2, S2.3 |
| S2.6 | [Design] Pick free pixel office packs (tiles + characters), check the licenses, and add them to `assets/` with `assets/CREDITS.md` | The assets and licenses are in the repo | — |
| S2.7 | [QA] Check the S2 criteria by hand | Every criterion above passes | S2.1–S2.6 |

## Estimate

- **Points:** 5
- **Reason:** Medium effort with many small setup tasks across all parts. Low complexity and low uncertainty, because the patterns are well known.

## Out of Scope

- Any Claude session logic (that starts in S3).
- Any app tables other than the migration runner's own table.
- The PixiJS canvas (that is S4).
- CI pipelines and automated tests.
