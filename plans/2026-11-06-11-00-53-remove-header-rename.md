# Title: Plan — Remove Rename from the chat header menu

- Classification: feature (it replaces the bug fix)
- Description: The header ⋯ menu has no Rename item. Rename stays in the sidebar ⋯ menu and on the office map.

## Approach Summary / Goal

- In `RoomActionsMenu`, show the Rename item only when `place === 'sidebar'`.
- In `ChatPanel`, remove the header rename input. The title is always plain text.
- Remove `'header'` from `RenamePlace` in the store, since nothing uses it any more. The rename places become `sidebar` and `office`.
- The focus bug cannot happen any more: the sidebar menu is unmounted when the rename input shows.

## Functional Requirements

- Header ⋯ menu: MCP servers, Archive, Close, Remove.
- Sidebar ⋯ menu: Rename, Archive, Close, Remove (unchanged).
- Sidebar and office map rename work as before.

## Files in Scope

- `apps/web/src/features/sessions/RoomActionsMenu.tsx`
- `apps/web/src/features/chat/ChatPanel.tsx`
- `apps/web/src/features/sessions/use-sessions-store.ts`

## Risks & Assumptions

- None. This removes code and adds no new behaviour. No tests (`Skip-Testing`).

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Show Rename only for `place === 'sidebar'` in `RoomActionsMenu`. Remove the header rename input and its `renaming` selector from `ChatPanel`. Remove `'header'` from `RenamePlace` and fix the types | developer | none | The header menu has no Rename, and the header title is plain text. Sidebar and office rename still work. `pnpm typecheck` and `pnpm lint` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
