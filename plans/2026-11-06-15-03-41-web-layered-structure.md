# Title: Plan — Refactor the web app into a layered structure

- Classification: feature
- Description: Move `apps/web/src` from feature folders (`features/`, `components/`) into layer folders (`components/{atoms,molecules,organisms,templates,pages}`, `configs`, `dtos`, `styles`, `hooks/{feature,store}`, `services`, `utils`). Atoms and molecules become pure. The app looks and works the same as before.

---

## Approach Summary / Goal

- The import direction is **pages → templates → organisms → molecules → atoms**. Only organisms and pages touch stores, feature hooks, or services. Atoms, molecules, and templates take data through props and send events up through callbacks.
- Business logic in `useEffect` moves into `useDoSomething` hooks in `hooks/feature/`. Zustand stores move to `hooks/store/` and hold only state and setters.
- `ws-client.ts` becomes the `WsClientService` class and `autocomplete.ts` becomes the `AutocompleteUtil` class, the same style as the server. This also removes today's store → ws-client → store import cycle.
- Goal: each folder has one job and one style, and the user sees no change.

### Code style per layer

| Layer | Style | Example |
| --- | --- | --- |
| `components/*` | Keep the current style: `PascalCase.tsx`, `export function Name()`, `type XxxProps` above it, named exports | `atoms/IconButton.tsx` |
| `hooks/feature/` | `export function useDoSomething()`, file name = hook name | `useEscapeClose.ts` |
| `hooks/store/` | `export const useEntityStore = create<EntityState>(…)`, file name = hook name | `useChatStore.ts` |
| `configs/` | `export const` only | `ws.config.ts` |
| `dtos/` | One file per DTO, the same as `packages/shared/src/models`: Zod schema + `z.infer` type (+ parser only if needed) | `chat-item.dto.ts` |
| `services/` | Class, one instance exported, full-name instance (`wsClientService`) | `ws-client.service.ts` |
| `utils/` | Class with static methods (`// eslint-disable-next-line @typescript-eslint/no-extraneous-class`) | `autocomplete.util.ts` |
| `styles/` | Plain CSS files, rules moved unchanged | `chat.css` |

### Component levels

| Level | Components | Rule |
| --- | --- | --- |
| `atoms/` | IconButton, ErrorBoundary, ConnectionBadge (gets `status`), AuthErrorNotice, ToolCard, SubagentCard (gets `onOpen`), ExternalLink (split out of MessageList), ChatResizeHandle (gets handlers from `useChatResize`) | Pure. Only React's own hooks for local UI state. |
| `molecules/` | AutocompletePopup, PermissionCard (gets `onAnswer`), RoomRenameInput, FolderPicker, CloseConfirmDialog, RoomActionsMenu | Pure. Can use atoms. |
| `organisms/` | MessageList, ChatInput, McpStatusPanel, SubagentDetails, SessionList, HeaderActions, ArchivedDialog, HistoryDialog, NewSessionDialog, ChatPanel, GameCanvas | Connect stores, feature hooks, and services, and pass props down. |
| `templates/` | AppLayout (sidebar \| header \| canvas \| resize handle \| chat slots) | Pure layout. |
| `pages/` | OfficePage (was `App.tsx`) | Wires the layout and organisms. Uses `useEscapeClose`. |

## Functional Requirements

- The app looks the same and behaves the same: sessions list, rename (in the list and on the map), room menu, close confirm, new session + folder picker, history, archived, chat send, autocomplete (`/` and `@`), permission answer, MCP panel, sub-agent details, chat resize (drag, keyboard, saved width), Esc closes the top item, and WS reconnect with backoff.
- Every WS event the web sends today is still sent at the same moment with the same payload.
- `game/` keeps its files, names, and constants. Only its imports into stores change to the new paths.
- `packages/shared` and `apps/server` do not change.

## Non-Functional Requirements

- No upward imports between layers, and no circular imports. `game/` may import only `hooks/store`, `dtos`, `configs`, and `utils`.
- Imports use `@/` (no `.ts` extension, the same as the web today). No barrel `index.ts`.
- Instances of our own classes use the full class name in camelCase (`wsClientService`).
- Move code; don't rewrite logic. Store `XxxState` types stay in their store file, and `XxxProps` types stay in their component.
- Code order in each file: imports, types, constants, main export, helpers.
- `pnpm typecheck`, `pnpm lint`, `pnpm exec prettier --check apps/web`, and `pnpm --filter @claude-office/web build` all pass.

## Files in Scope

All paths are under `apps/web/src/`.

**Create**

| Folder | Files | Comes from |
| --- | --- | --- |
| `configs/` | `ws.config.ts` (INITIAL_BACKOFF_MS, MAX_BACKOFF_MS, WS URL builder), `layout.config.ts` (CHAT_WIDTH_STORAGE_KEY, MIN_REM, MAX_REM, MIN_CANVAS_REM, DRAGGING_CLASS), `autocomplete.config.ts` (STALE_MS, MAX_ROWS, POPUP_ID), `ui.config.ts` (all STATUS_BG / STATUS_LABEL(S) / STATUS_ORDER maps with clear names, SUBAGENT_STATUS_BG, MODE_OPTIONS, MODE_BY_VALUE) | ws-client, use-chat-width-store, use-autocomplete-store, autocomplete, ChatInput, ChatResizeHandle, the card components, ConnectionBadge, McpStatusPanel |
| `dtos/` | `chat-item.dto.ts` (ChatItem union), `tool-result.dto.ts`, `permission-item.dto.ts` (+PermissionStatus), `subagent-item.dto.ts` (+SubagentTool), `mcp-room-status.dto.ts`, `rename-target.dto.ts` (+ScreenRect, RenamePlace), `connection-status.dto.ts`, `autocomplete-token.dto.ts` (+Trigger, AutocompleteRows, ListKind), `width-bounds.dto.ts` | use-chat-store, use-mcp-store, use-sessions-store, use-connection-store, autocomplete, use-autocomplete-store, use-chat-width-store |
| `utils/` | `autocomplete.util.ts` (`AutocompleteUtil`: findToken, tokenKey, rankCommands, rankFiles, rowInsertText, applyPick, optionId), `chat-width.util.ts` (`ChatWidthUtil`: clampWidth, getBounds), `history.util.ts` (`HistoryUtil`: groupByFolder, toTime, lastSegment) | autocomplete.ts, AutocompletePopup, use-chat-width-store, HistoryDialog |
| `services/` | `ws-client.service.ts` (`WsClientService` with `start()` and `send()`, socket kept as a private field, exported `wsClientService`) | features/connection/ws-client.ts |
| `hooks/store/` | `useConnectionStore.ts`, `useSessionsStore.ts`, `useChatStore.ts` (+selectRoomItems, applyRoomEvent), `useChatWidthStore.ts`, `useAutocompleteStore.ts`, `useMcpStore.ts`, `useHistoryStore.ts`, `useArchivedStore.ts`, `useSubagentDetailsStore.ts` | features/*/use-*-store.ts |
| `hooks/feature/` | `useEscapeClose.ts` (App), `useChatResize.ts` (ChatResizeHandle), `useAutoScroll.ts` (MessageList), `useRequestOnOpen.ts` (FolderPicker, NewSessionDialog, HistoryDialog, ArchivedDialog), `useChatAutocomplete.ts` (ChatInput), `useAutocompleteLists.ts` and `useMcpStatus.ts` (the WS-sending actions taken out of the autocomplete and MCP stores) | those files |
| `styles/` | `base.css`, `sessions.css`, `chat.css`, `subagent.css`, `mcp.css`, `autocomplete.css`, `game.css` (rules moved unchanged, loaded in today's order) | styles.css |
| `components/` | the atoms, molecules, organisms, templates, and pages in the table above | components/, features/*, App.tsx, game/GameCanvas.tsx |

**Change:** `main.tsx` (CSS imports, `wsClientService.start()`, render `OfficePage`), `game/office-scene.ts`, `game/room-view.ts`, `game/subagent-sprite.ts` (store import paths only), `apps/web/package.json` (`zod: ^4.0.0`), `pnpm-lock.yaml`, `.claude/references/CODING_CONVENTIONS.md`.

**Delete:** `App.tsx`, `styles.css`, `features/`, the old `components/*.tsx`, `game/GameCanvas.tsx`.

## Risks & Assumptions

- **Assumption:** file name = hook name (`useChatStore.ts`, `useEscapeClose.ts`), based on your answer "useDoSomething, useEntityStore".
- **Assumption:** `services/` and `utils/` are also used in the web (you said "the rest follow backend convention").
- **Assumption:** the layer order for logic is organisms/pages → `hooks/feature` → `services` → `hooks/store`. The WS service writes into stores, so stores must never import the service. That is why the sending actions in the autocomplete and MCP stores move into `useAutocompleteLists` and `useMcpStatus`.
- **Risk:** strict atoms and molecules change the props of about 10 components (data and callbacks now come from the parent). Each moved call must happen at the same moment as today. For example, PermissionCard's answer still sends `permission_answer` and updates the chat store in the same order.
- **Risk:** some code may call the autocomplete or MCP sending actions through `getState()` outside React. If so, the developer keeps a plain call path to the service, not a hook, and says so in the report.
- **Risk:** splitting CSS can change the rule order. Files load in the same order as the sections in `styles.css` today, so the look stays the same. Duplicate selectors stay as they are (no cleanup).
- **Risk:** a camelCase file name like `useChatStore.ts` is new for the repo. If lint has a file-name rule that blocks it, the developer reports it and doesn't change the lint config.
- Testing: the project uses Skip-Testing, so there is no tester task. The checks are typecheck, lint, prettier, and a production build. After that, I can run a manual browser check with `/web-test` if you want.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | TODO | Add `zod` to `apps/web/package.json` and run `pnpm install`. Create `configs/*`, `dtos/*`, `utils/*`, and `styles/*`. Use the style table. Don't delete old files yet. | developer | none | All listed files exist and follow the style table. Values and logic match the source. CSS rules are copied unchanged and in the same order. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | TODO | Create `hooks/store/*` (stores use dtos and configs and never import services), `services/ws-client.service.ts`, and `hooks/feature/*`. Point the `game/` imports at the new stores. | developer | task 1 | 9 stores, 1 service, and 7 feature hooks exist. No store imports a service. The service has the same reconnect, backoff, and dispatch logic. Each feature hook has the same effect logic as its source. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | TODO | Create the components in the level table (pure atoms and molecules with props and callbacks; organisms do the wiring), `templates/AppLayout.tsx`, and `pages/OfficePage.tsx`. Update `main.tsx`. Delete the old files. Run `pnpm typecheck`, `pnpm lint`, `pnpm exec prettier --check apps/web`, and `pnpm --filter @claude-office/web build`. Run `graphify update .`. | developer | task 2 | Old folders are gone. Atoms, molecules, and templates import no stores, feature hooks, or services. Every WS send happens in the same user action as before. All checks pass. The graph is updated. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | TODO | Update the web part of the folder tree in `.claude/references/CODING_CONVENTIONS.md`. Add a short "Web layers" section: the component levels and the purity rule, the logic layer order, the style table, and the hook file-name rule. | developer | none (runs in parallel with task 1) | The doc shows the new tree and rules in plain English. Nothing else in the doc changes. | `.claude/references/AGENT_RULES.md` |
