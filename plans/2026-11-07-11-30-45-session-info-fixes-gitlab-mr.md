# Title: Plan — Session info strip: small fixes + GitLab MR support

- Classification: feature
- Description: Fix the three review issues. Find the PR / MR with a host map (GitHub → `gh`, GitLab → `glab`). Skip all other hosts.

---

## Approach Summary / Goal

- **Fixes:**
  - Remove the unused `effortPrefix` / `contextPrefix` config keys.
  - Remove the CSS rule that does nothing.
  - Move the startup workspace refresh out of `loadClosedRooms`. Run it in `history(roomId)` instead, which runs when the user opens a room.
- **Host map:** `GitRepository` reads `git remote get-url origin` and gets the host from it. A config map turns the host into a provider: host has `github` → `github`, host has `gitlab` → `gitlab`. Any other host (Bitbucket included) gets no provider, and the app skips the PR lookup.
- **Provider commands:**
  - `github` → `gh pr view --json number,url`
  - `gitlab` → `glab mr view --output json`, reading `iid` and `web_url`
- **Shared:** add `prProvider: 'github' | 'gitlab' | null` to `SessionInfo`. The web uses it for the label: `PR #12` for GitHub, `MR !12` for GitLab.
- **Goal:** the strip shows the PR/MR link for GitHub and GitLab repos, and startup no longer runs `gh` for every closed room.

## Functional Requirements

- A GitHub remote (SSH `git@github.com:o/r.git` or HTTPS) shows `PR #N`. This is the same as today.
- A GitLab remote (`gitlab.com` or a host with `gitlab` in its name) shows `MR !N` and links to `web_url`.
- Any other host, no `origin` remote, a missing CLI, or a failed call means no PR item and no CLI call.
- At app start, closed rooms run no `git` or `gh` commands. Branch and PR fill in when the user opens the room, and again at each turn end. This is the same as today.
- The `https://` check, timeouts, and no-shell rules apply to `glab` too.

## Non-Functional Requirements

- The host → provider map is a constant in `apps/server/src/configs/` (for example `GIT_HOST_PROVIDERS`). A later round can add Bitbucket with a new row.
- Each provider has its own small Zod schema for its JSON output.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.

## Files in Scope

- Modify `packages/shared/src/models/session-info.ts`: add `prProvider` and a `GitProviderSchema`.
- Modify `apps/server/src/configs/limits.config.ts`, or create `apps/server/src/configs/git.config.ts`: the host map and `GLAB_TIMEOUT_MS`.
- Modify `apps/server/src/repositories/git.repository.ts`: add `remoteProvider(folder)`, and make `findPr(folder, provider)` pick the command.
- Modify `apps/server/src/services/session-info.service.ts`: get the provider, then the PR, and save `prProvider`.
- Modify `apps/server/src/services/session.service.ts`: remove the refresh from `loadClosedRooms` and add it to `history()`.
- Modify `apps/web/src/configs/ui.config.ts`: remove the unused keys, and add PR/MR labels for each provider.
- Modify `apps/web/src/components/molecules/SessionInfoBar.tsx`: pick the label from `prProvider`.
- Modify `apps/web/src/styles/chat.css`: remove the `:first-child` rule.

## Risks & Assumptions

- **Assumption:** `glab mr view` with no argument finds the MR for the current branch. The `glab` docs say so.
- **Risk:** `glab` is not installed on this machine, so nobody can check the GitLab path live here. Only typecheck and parsing on sample JSON will check it.
- **Risk:** a self-hosted GitLab whose host name does not contain `gitlab` is skipped.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Fix the three review issues: remove the unused config keys, remove the no-op CSS rule, and move the startup refresh from `loadClosedRooms` to `history()`. | developer | none | Grep finds no unused keys. Startup runs no git/gh commands. Opening a room fills in branch and PR. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Host map plus GitLab support (shared `prProvider`, config map, `GitRepository.remoteProvider`, provider-based `findPr`, service and web label). | developer | none | A GitHub remote gives `github` and `PR #`. A GitLab remote gives `gitlab` and `MR !`. A Bitbucket or other host gives `null` and runs no CLI. The parser accepts sample `glab` JSON and rejects a non-https URL. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
