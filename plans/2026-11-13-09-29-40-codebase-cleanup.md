# Title: Plan — Codebase cleanup

- Classification: feature (refactor)
- Description: Remove unused code and exports, fix convention breaks, add one shared helper, and tidy the lint config and local leftovers.

---

## Approach Summary / Goal

- Make small changes that don't change behavior, based on the three research reports and the code I read myself.
- Group the work into 3 developer sub-agents that don't share files, so they can run in parallel.
- Goal: less dead code and fewer convention breaks. The app should work exactly as before.

## Functional Requirements

- The app works exactly as before. No runtime change.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` all pass.

## Non-Functional Requirements

- Follow `.claude/references/CODING_CONVENTIONS.md`. Static constants are `camelCase` `private static readonly`. Utils are classes with static methods. Server imports use `@/` and the `.ts` extension.
- Don't add explanatory comments.

## Files in Scope

- **Server:** `dtos/resume-result.dto.ts`, `services/usage-limit.service.ts`, new `utils/type-guard.util.ts`, `repositories/history.repository.ts`, `repositories/transcript-system-rows.repository.ts`, `services/permission.service.ts`, `services/sdk-event-mapper.service.ts`, `utils/input-queue.util.ts` (moved to `repositories/input-queue.repository.ts`), `repositories/session-store.repository.ts`, `services/session.service.ts`, `configs/database.config.ts`, `utils/task-notification.util.ts`, `utils/peer-message.util.ts`, `repositories/folder.repository.ts`, `repositories/file.repository.ts`, `repositories/git.repository.ts`, `routes/ws.route.ts`, `services/event-bus.service.ts`, `services/attachment.service.ts` (all under `apps/server/src/`)
- **Web:** `hooks/store/useChatStore.ts`, `services/ws-client.service.ts`, `utils/history.util.ts`, `utils/attachment.util.ts`, `utils/event-content.util.ts`, `game/subagent-sprite.ts`, and the files that define `FileTreeProps`, `CodeEditorViewProps`, `IconButtonProps`, `ChatByRoom`, `RoomDraft`, `ChatDraftState`, `CodeViewerMode`, and `ModeOption` (all under `apps/web/src/`)
- **Other:** `packages/shared/src/events/index.ts`, `eslint.config.js`, and the `spikes/` folder, which will be deleted

## Risks & Assumptions

- Some exported types are return types of public class methods. If removing `export` makes typecheck fail, the developer keeps that `export` and reports it.
- `transcript-system-rows.repository.ts` also checks `!Array.isArray(value)`. That check stays, next to the new helper.
- Deleting `spikes/` can't be undone. It holds only an empty `logs/` and a `node_modules/`, and git ignores it.
- **Dropped:** the "unused CLI path alias" item. `apps/cli/src` does use `@/` imports.
- **Not touched:** DTO schemas used only for types, DTO helper exports in `apps/web/src/dtos`, the reports in `plans/`, and the `apps/cli` dependencies.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
|---|---|---|---|---|---|---|
| 1 | DONE | **Server (Developer A).** In `resume-result.dto.ts`, remove the unused `ResumeErrorCode` type. | developer | none | The type is gone and typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | **Server (A).** In `usage-limit.service.ts`, move `SECONDS_LIMIT` and `MS_PER_SECOND` into the class as `private static readonly secondsLimit` and `msPerSecond`, and update their uses. | developer | none | No top-level constants are left. Values are the same. Typecheck passes. | same |
| 3 | DONE | **Server (A).** Add `utils/type-guard.util.ts` with `TypeGuardUtil.isRecord(value: unknown): value is Record<string, unknown>`. Use it in place of the private `isRecord` in `history.repository.ts` and the inline checks in `transcript-system-rows.repository.ts:76` (keep `!Array.isArray`), `permission.service.ts:134`, and `sdk-event-mapper.service.ts:289`. | developer | none | grep finds no `typeof x === 'object' && x !== null` outside the new util. Behavior is the same. Typecheck passes. | same |
| 4 | DONE | **Server (A).** Move `utils/input-queue.util.ts` to `repositories/input-queue.repository.ts` (class stays `InputQueue`). Update the imports in `session-store.repository.ts` and `session.service.ts`. | developer | none | The old file is gone and no import points to it. Typecheck passes. | same |
| 5 | DONE | **Server (A).** Remove `export` from `MIGRATIONS_DIR` and from these types, which only their own file uses: `TaskNotificationStatus`, `TaskNotification`, `PeerEnvelope`, `SubagentState`, `PendingPermission`, `OpenRoomLookup`, `TranscriptSystemRows`, `FolderListing`, `FolderResult`, `FileListing`, `TextResult`, `PrInfo`, `HeadContent`, `WsRouteOptions`, `RoomEventListener`, `SessionStateListener`, `PrepareResult`. | developer | tasks 3, 4 | Each one is no longer exported unless typecheck needs it. Any it had to keep are listed in the report. | same |
| 6 | DONE | **Web (Developer B).** Remove `export` from `applyRoomEvent`, `WsClientService`, `FolderGroup`, `ResizedImage`, `EventContentFormat`, `EventContentView`, `SubagentEnd`, `FileTreeProps`, `CodeEditorViewProps`, `IconButtonProps`, `ChatByRoom`, `RoomDraft`, `ChatDraftState`, `CodeViewerMode`, `ModeOption`. | developer | none | Same as task 5. The `wsClientService` instance stays exported. | same |
| 7 | DONE | **Other (Developer C).** Remove `export type { ParseFailure, ParseResult } from './parse.ts';` from `packages/shared/src/events/index.ts`. | developer | none | Typecheck passes for all packages. | same |
| 8 | DONE | **Other (C).** In `eslint.config.js`, add `apps/cli/**/*.ts` and `apps/*/scripts/**/*.mjs` to the `globals.node` block. | developer | none | `pnpm lint` has no new errors. | same |
| 9 | DONE | **Other (C).** Delete the `spikes/` folder. | developer | none | The `spikes/` folder no longer exists. | — |
| 10 | DONE | **Each developer** runs `pnpm typecheck` and `pnpm lint`. **Root Agent:** after all three finish, run `pnpm build` and `graphify update .`. | developer | tasks 1–9 | All of them pass. | — |
