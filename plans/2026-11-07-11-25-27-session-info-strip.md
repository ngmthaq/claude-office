# Title: Plan — Session info strip in chat panel

- Classification: feature
- Description: Add a thin info strip under the chat panel header. It shows working dir, git branch, PR link, model, effort, and context usage for the open room.

---

## Approach Summary / Goal

- **Shared:** add a new `SessionInfo` model and an `info` field on `RoomSummary`. The rooms list already goes to the browser on each `notifyChanged`, so no new event is needed.
- **Server:**
  - The **model** comes from the SDK `init` message.
  - The **effort** comes from a new SDK `Stop` hook that reads `input.effort.level`.
  - **Context** comes from `query.getContextUsage({ detail: 'summary' })`.
  - **Branch and PR** come from `git` and `gh`, run with `execFile` in the session folder.
  - All values refresh at session start (open, resume, or create) and at the end of each turn.
- **Web:** a new pure `SessionInfoBar` molecule shows the values as small items. `ChatPanel` renders it under the header.
- **Goal:** the user can see the main facts about a session at a glance, without leaving the chat.

## Functional Requirements

- The strip shows under the header in the main chat view, in this order: working dir · branch · PR · model · effort · context.
- **Working dir:** shows `room.folder`. A long path is cut with an ellipsis. Hover shows the full path.
- **Branch:** the output of `git branch --show-current`. The item is hidden when the folder is not a git repo. For a detached HEAD it shows `detached`.
- **PR:** `gh pr view --json number,url` for the current branch. It shows `PR #12` as a link that opens in a new tab. The item is hidden when `gh` is missing, not logged in, there is no PR, or the call fails.
- **Model:** the `model` value from the `init` message, for example `claude-opus-5-5`.
- **Effort:** the `effort.level` value from the Stop hook. It shows `—` until the first turn ends. It also shows `—` when the model does not support effort.
- **Context:** for example `34% · 68k / 200k`. It shows `—` before the first query runs.
- **Refresh:** branch and PR refresh when a room opens, resumes, or is created, and at each turn end. Model refreshes on `init`. Context and effort refresh at each turn end.
- **Closed or resumed rooms:** they keep their last known values. A resumed room shows working dir, branch, and PR at once. It shows model, effort, and context after the first turn.
- Items with no value are hidden, except effort and context, which show `—` once a query runs.

## Non-Functional Requirements

- **Security:**
  - Use `execFile` with no shell, and set `cwd` to the session folder.
  - Use fixed arguments only.
  - Set a timeout (git: 2 s, gh: 5 s).
  - Use the PR URL only when it starts with `https://`.
  - Never log command output.
- **Speed:** only one info refresh runs at a time for each session. A new request while one runs is skipped.
- **Errors:** any failure (git, gh, or `getContextUsage`) leaves that field `null`. The failure never breaks the session or the turn. Log only the error name.
- **Conventions:**
  - The new repository is a class.
  - The new service is a class with its dependencies passed in the constructor.
  - Constants (timeouts) go in `configs/`.
  - Labels and format strings go in the web `ui.config.ts`.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.

## Files in Scope

- Create `packages/shared/src/models/session-info.ts`: `SessionInfoSchema` = `{ model, effort, branch, prNumber, prUrl, contextUsed, contextMax, contextPercent }`. Each field is nullable.
- Change `packages/shared/src/models/room-summary.ts` (add `info`) and `packages/shared/src/models/index.ts` (export).
- Create `apps/server/src/repositories/git.repository.ts`: `currentBranch(folder)` and `findPr(folder)`.
- Change `apps/server/src/configs/limits.config.ts`: git and gh timeouts.
- Create `apps/server/src/services/session-info.service.ts`: `refreshWorkspace(session)` (branch + PR), `refreshContext(session)`, `setModel`, and `setEffort`.
- Change `apps/server/src/repositories/session-store.repository.ts`: add `info: SessionInfo` to `Session`, set an empty info in `closedSession`, and pass `info` through in `toSummary`.
- Change `apps/server/src/services/session.service.ts`:
  - Set an empty info where a `Session` is built.
  - Save the model on `init`.
  - Add the `Stop` hook in `ensureQuery`.
  - Refresh at turn end and at create/resume/open.
- Change the server wiring file (where services are built) to create `GitRepository` and `SessionInfoService`.
- Create `apps/web/src/components/molecules/SessionInfoBar.tsx`.
- Create `apps/web/src/utils/token-format.util.ts`: `TokenFormatUtil.short(68000)` returns `68k`.
- Change `apps/web/src/configs/ui.config.ts`: labels and the empty placeholder `—`.
- Change `apps/web/src/components/organisms/ChatPanel.tsx`: render `SessionInfoBar` under the header.
- Change `apps/web/src/styles/chat.css`: strip styles (`.chat-panel__info`).

## Risks & Assumptions

- **Assumption:** the `Stop` hook input has `effort.level`. The SDK types say so for Stop hooks on models that support effort. If the field is missing, effort stays `—`.
- **Assumption:** the PR is the one `gh` finds for the current branch, in any state (open, merged, or closed). We show only its number and link, not its state.
- **Assumption:** the working dir shows the full absolute path. It does not shorten the path with `~`.
- **Risk:** `gh` makes a network call at each turn end. The 5 s timeout and the "one refresh at a time" rule keep this cheap. The call never blocks the chat.
- **Risk:** our SDK `Stop` hook runs next to the user's own Stop hooks. It only reads the input and returns `{}`, so it changes nothing.
- **Testing:** the workflow is `Skip-Testing`, so there is no tester task. The developer checks the work by hand in the running app.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Shared: add `session-info.ts` (schema above), add `info` to `RoomSummarySchema`, and export it from `models/index.ts`. | developer | none | Typecheck passes. `RoomSummarySchema` parses a room with `info`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Server: add `GitRepository` (execFile, no shell, timeouts from config, `https://` check on the PR URL, `null` on any error) and `SessionInfoService` (one refresh at a time per session, then `notifyChanged`). Add `info` to `Session` and `toSummary`. Wire both into `session.service.ts`: save the model on `init`, add the `Stop` hook for effort, refresh context + workspace on `turn_done`, and refresh workspace on create/resume/open. | developer | task 1 | The rooms list sent to the web has correct `info` after a turn in a git folder with a PR. A non-git folder gives `branch: null`. When `gh` fails, `prUrl` is `null`. The turn flow is the same as before. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
| 3   | DONE   | Web: add `TokenFormatUtil`, the `ui.config.ts` labels, the pure `SessionInfoBar` molecule (PR as a link with `target=_blank rel=noopener noreferrer`), and its CSS. Render it in `ChatPanel` under the header. | developer | task 1 | Meets the Functional Requirements. The strip stays on one line and cuts long values. `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
