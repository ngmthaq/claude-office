# Title: Plan — Sync package versions, add husky and a bump script

- Classification: feature
- Description: Make the root `package.json` the single source of the version, add one Node script that can sync, check and bump all `package.json` files, and add a husky pre-commit hook that blocks commits when versions don't match.

---

## Approach Summary / Goal

- Add `"version": "0.1.0"` to the root `package.json` and set every workspace package (`apps/*`, `packages/*`) to `0.1.0`.
- Add one script, `scripts/version.js` (plain Node ESM, no new libraries), with 3 commands: `sync`, `check`, `bump <patch|minor|major|x.y.z>`.
- `bump` sets the new version in root and in every workspace package, then makes one commit with only those files: `chore: bump version to X.Y.Z`. It does not make a tag.
- Install husky v9. A `pre-commit` hook runs `check`, so a commit with mismatched versions fails.

## Functional Requirements

- All 5 `package.json` files (root, `apps/cli`, `apps/server`, `apps/web`, `packages/shared`) show `0.1.0` after the sync.
- `pnpm version:sync` copies the root version to every workspace package.
- `pnpm version:check` exits with 0 when all versions match. When they don't, it prints each package that differs and exits with 1.
- `pnpm version:bump patch|minor|major` raises the root version (for example 0.1.0 → 0.1.1 / 0.2.0 / 1.0.0) and writes it to all files. `pnpm version:bump 1.2.3` sets that exact version.
- `bump` refuses a bad argument or a bad version string, and exits with 1 without changing any file.
- `bump` commits only the changed `package.json` files with the message `chore: bump version to X.Y.Z`. Other staged changes are not part of that commit. No tag.
- Workspace packages are found from the `pnpm-workspace.yaml` globs (`apps/*`, `packages/*`), not from a hardcoded list.
- Running `pnpm install` sets up the husky hooks (`"prepare": "husky"`).
- `.husky/pre-commit` runs `pnpm version:check` and blocks a commit when versions don't match.

## Non-Functional Requirements

- No new runtime dependencies. `husky` is the only new dev dependency, on the root.
- The script keeps the JSON format the same: 2-space indent and a newline at the end. Key order does not change.
- The script passes `pnpm lint` and `pnpm format:check`.

## Files in Scope

- `package.json` (root): add `version`, `prepare`, `version:sync`, `version:check`, `version:bump` scripts, and the `husky` dev dependency
- `apps/server/package.json`, `apps/web/package.json`, `packages/shared/package.json`: version → `0.1.0`
- `apps/cli/package.json`: stays at `0.1.0` (only checked)
- `scripts/version.js` (new)
- `.husky/pre-commit` (new)
- `eslint.config.js`: add Node globals for `scripts/**/*.js`
- `pnpm-lock.yaml`: updated by the install

## Risks & Assumptions

- Assumption: the CLI is not on npm yet (I checked: `npm view` returns 404), so starting at `0.1.0` is safe.
- Assumption: the `pnpm-workspace.yaml` globs are simple `dir/*` patterns. The script supports only this form. That is enough for this repo today.
- Risk: the pre-commit hook makes every commit run a short Node script (well under 1 second).
- Risk: `bump` uses `git commit -- <files>`, so it commits the current content of those files. If you have unsaved edits in a `package.json` (for example a new dependency), they go into the bump commit.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks. I will check the work by running the commands myself at review time.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Create `scripts/version.js` with the `sync`, `check` and `bump` commands. Add the root `version: "0.1.0"` and the `version:sync`, `version:check` and `version:bump` scripts to the root `package.json`. Add Node globals for `scripts/**/*.js` in `eslint.config.js`. | developer | none | The Functional Requirements for sync, check and bump are met. `pnpm lint` and `pnpm format:check` pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/SECURITY_SCANNER/` |
| 2   | DONE   | Run `pnpm version:sync` so all workspace packages move to `0.1.0`. | developer | task 1 | All 5 `package.json` files show `0.1.0`. `pnpm version:check` exits with 0. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | Install husky v9 as a root dev dependency. Add `"prepare": "husky"`. Create `.husky/pre-commit` that runs `pnpm version:check`. | developer | task 1 | `.husky/pre-commit` exists and is executable. `git config core.hooksPath` shows `.husky/_`. When one version is changed by hand, `pnpm version:check` exits with 1. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |

> The developer will **not** run `version:bump` for real and will **not** commit anything. The Root Agent will test `bump` in a temporary copy of the repo during review, so the git history stays clean.
