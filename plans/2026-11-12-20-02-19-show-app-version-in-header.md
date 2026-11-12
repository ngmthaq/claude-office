# Title: Plan — Show the app version in the web UI

- Classification: feature
- Description: Vite reads the version from `apps/web/package.json` at build time, and the header shows it as small muted text next to the "Claude Office" title.

---

## Approach Summary / Goal

- In `apps/web/vite.config.ts`, read `version` from `apps/web/package.json` and expose it as a global build constant `__APP_VERSION__` through Vite's `define`.
- `scripts/version.js` already syncs every `package.json` on each bump, and the release builds the web bundle from `apps/web`. So the label always matches the running release and needs no manual change.
- `AppLayout.tsx` shows `v{version}` right after the `<h1>`, with Bootstrap's theme-aware muted text color.
- Goal: users can see the running version at a glance, without crowding the header.

## Functional Requirements

- The header shows the version as `v` plus the semver from `apps/web/package.json` (today: `v1.0.7`), right after the "Claude Office" title.
- After `pnpm version:bump` and a rebuild, the label shows the new version with no other code change.
- The version works in both `vite dev` and `vite build`.

## Non-Functional Requirements

- The label is small and muted (`small` + `text-body-secondary`). It does not wrap (`text-nowrap`) and does not push the header buttons onto a new line on narrow screens.
- The color comes from Bootstrap theme variables, so it adapts to light and dark themes. No hard-coded colors.
- TypeScript knows the global constant (a `declare const __APP_VERSION__: string;` declaration), and `tsc` passes.
- No new comments in the code (user rule).

## Files in Scope

- `apps/web/vite.config.ts`: add `define: { __APP_VERSION__: JSON.stringify(version) }`, with the version read from `./package.json`.
- `apps/web/src/vite-env.d.ts` (new): `/// <reference types="vite/client" />` plus `declare const __APP_VERSION__: string;`.
- `apps/web/src/configs/app.config.ts` (new): `export const APP_VERSION = __APP_VERSION__;`, so components import a normal config value.
- `apps/web/src/components/templates/AppLayout.tsx`: show the label next to the `<h1>`.

## Risks & Assumptions

- Assumption: the web bundle and server always ship together in one release (true for the `@ngmthaq20/claude-office` CLI package), so the build-time version equals the running version.
- Risk: a browser that keeps an old cached `index.html` would show the old version until reload. This is accepted with the build-time choice.
- The app is dark-only today. "Looks right in light theme" is covered by using theme-aware Bootstrap classes, not by adding a light theme.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | In `apps/web/vite.config.ts`, read `version` from `./package.json` and add `define: { __APP_VERSION__: JSON.stringify(version) }`. Add `apps/web/src/vite-env.d.ts` with the `vite/client` reference and `declare const __APP_VERSION__: string;`. | developer | none | `pnpm --filter @claude-office/web build` passes. The built JS contains the string `1.0.7`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/CLEAN_CODE/KISS.md` |
| 2   | TODO   | Add `apps/web/src/configs/app.config.ts` with `export const APP_VERSION = __APP_VERSION__;`. In `AppLayout.tsx`, render `<span className="small text-body-secondary text-nowrap">v{APP_VERSION}</span>` right after the `<h1>`. | developer | task 1 | The header reads "Claude Office v1.0.7". The label is smaller and dimmer than the title. Typecheck and lint pass. | `.claude/guides/CLEAN_CODE/ATOMIC_DESIGN.md`, `.claude/guides/CLEAN_CODE/KISS.md` |
| 3   | TODO   | Browser check (Root Agent, through `/web-test` or Claude in Chrome): open the app, then look at the label on a wide window and on a narrow window (about 400px). | Root Agent (review) | task 2 | The label shows `v1.0.7` next to the title. The header does not wrap or overlap at either width. | `.claude/skills/web-test/SKILL.md` |

There is no tester task because the project's testing workflow is Skip-Testing.
