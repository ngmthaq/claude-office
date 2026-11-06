# Title: Plan — Production build and start scripts

- Classification: feature
- Description: Compile the server to one JS bundle with esbuild, have it serve the built web app and `/ws` on `127.0.0.1:4317`, and add root `build` / `start` / `prod` scripts.

---

## Approach Summary / Goal

- `pnpm build` builds the web app (`apps/web/dist`) and bundles the server into `apps/server/dist/main.js` with esbuild. esbuild handles the `@/` aliases and the `.ts` files in `@claude-office/shared`, so the shared package is bundled in. Third-party packages stay external. This matters most for `better-sqlite3`, which is a native module, and for the Agent SDK, which finds its own CLI files.
- With `NODE_ENV=production`, the server also serves `apps/web/dist` through `@fastify/static`. One process, one URL: `http://127.0.0.1:4317`. In dev nothing changes, because Vite still serves the web app.
- `DATA_DIR` and `MIGRATIONS_DIR` are built from `import.meta.url` with relative paths (`../../data`, `../migrations`). Those paths break once the code is bundled into `dist/main.js`. A new `SERVER_ROOT` constant fixes this: it walks up from the current file until it finds `apps/server/package.json`. Then every path is built from that root, and it works in both dev and prod.
- Goal: `pnpm prod` takes a clean checkout (after `pnpm install`), builds everything, and starts the app in production mode.

## Functional Requirements

- `pnpm build` (root) builds web + server with no errors. Output: `apps/web/dist/index.html` and `apps/server/dist/main.js`.
- `pnpm start` (root) runs `node apps/server/dist/main.js` with `NODE_ENV=production`. It does not use tsx.
- `pnpm prod` (root) runs `build` and then `start`.
- In production, `GET http://127.0.0.1:4317/` returns the web app's `index.html`, and the built assets load.
- In production, the browser connects to `ws://127.0.0.1:4317/ws`, and the app works (session list loads).
- The SQLite DB is still at `apps/server/data/claude-office.db`, and migrations are still read from `apps/server/src/migrations` in both modes.
- `http://localhost:4317` is added to `ALLOWED_ORIGINS`.
- `pnpm dev` works the same as before.

## Non-Functional Requirements

- The server still listens on `127.0.0.1` only.
- Static file serving is on only when `NODE_ENV=production`.
- `pnpm typecheck` and `pnpm lint` still pass.
- Follow the code style in `.claude/references/CODING_CONVENTIONS.md`: configs go in `src/configs/`, and no magic strings.

## Files in Scope

- `package.json` (root): add `build`, `start`, `prod`
- `apps/server/package.json`: add `build` (esbuild), change `start` to `NODE_ENV=production node dist/main.js`, and add the `@fastify/static` and `esbuild` dependencies
- `apps/server/scripts/build.mjs` (new): the esbuild bundle script, with dependencies from package.json marked external except `workspace:*` ones
- `apps/server/src/configs/app.config.ts`: add `SERVER_ROOT`, `IS_PRODUCTION`, `WEB_DIST_DIR`, and `http://localhost:4317`. Rebuild `DATA_DIR` from `SERVER_ROOT`.
- `apps/server/src/configs/database.config.ts`: rebuild `MIGRATIONS_DIR` from `SERVER_ROOT`
- `apps/server/src/main.ts`: register `@fastify/static` for `WEB_DIST_DIR` when `IS_PRODUCTION`
- `pnpm-lock.yaml`: updated by `pnpm install`

## Risks & Assumptions

- Assumption: the app always runs from inside this repo, not as a copied `dist` folder. So reading migrations from `src/migrations` is fine.
- Assumption: macOS/Linux only. The inline `NODE_ENV=production` in the script will not work in Windows cmd.
- Risk: if `apps/web/dist` is missing in production, the server should log a clear error and not crash with a stack trace.
- Testing workflow is `Skip-Testing`, so there is no tester task. The developer checks the work by hand: build, start, `curl /`, and a WebSocket handshake.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Path config: add `SERVER_ROOT` (walk up to `apps/server/package.json`), `IS_PRODUCTION`, and `WEB_DIST_DIR` in `app.config.ts`. Rebuild `DATA_DIR` and `MIGRATIONS_DIR` from `SERVER_ROOT`. Add `http://localhost:4317` to `ALLOWED_ORIGINS`. | developer | none | `pnpm dev` still works, and the DB stays at `apps/server/data/`. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | Static serving: add `@fastify/static`. In `main.ts`, register it for `WEB_DIST_DIR` only when `IS_PRODUCTION`. Log a clear error if the folder is missing. | developer | task 1 | In prod, `GET /` returns index.html, and `/ws` still upgrades. In dev, no static route is registered. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
| 3   | TODO   | Server build: add `apps/server/scripts/build.mjs` (esbuild, ESM, platform node, target node24, tsconfig aliases, bundle `@claude-office/shared`, keep the other dependencies external). Add the server `build` script, and change `start` to `NODE_ENV=production node dist/main.js`. | developer | task 1 | `pnpm --filter @claude-office/server build` creates `dist/main.js`, and `node dist/main.js` starts without tsx. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | TODO   | Root scripts: `build` = `pnpm -r build`, `start` = `pnpm --filter @claude-office/server start`, `prod` = `pnpm build && pnpm start`. Run the full check: `pnpm prod`, `curl` the page, WS handshake with Origin `http://localhost:4317`, plus `pnpm typecheck` and `pnpm lint`. | developer | tasks 2, 3 | Everything in Functional Requirements is checked and reported. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
