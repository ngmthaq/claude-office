# Title: Plan — Session info overlay panel (replace the strip)

- Classification: feature
- Description: Remove the one-line strip. Add an (i) button in the chat header that opens a panel over the top of the chat, showing every value in full.

---

## Approach Summary / Goal

- **Header:** an `info-circle` `IconButton` sits before the MCP button. Clicking it opens or closes the panel.
- **Panel:** a new pure molecule `SessionInfoPanel` floats over the top of the chat. The message list stays behind it.
  - It shows one row per value, and long values wrap instead of being cut.
  - It has a copy button for the working dir.
  - Context shows a progress bar.
- **State:** a new `useSessionInfoStore` (`openRoomId`, `open`, `close`) works like the existing `useMcpStore`.
  - `useEscapeClose` closes the panel first, before its other checks.
  - Switching rooms also closes the panel.
- **Closing:** the ✕ button, Esc, or a click on the dim area behind the panel.
- **Server:** no change. Data still comes from `room.info`.
- **Goal:** full session info with nothing cut off, and the chat keeps its full height when the panel is closed.

## Functional Requirements

- The (i) button shows in the chat header for every room, closed rooms too. Its hover text is "Session info".
- The panel shows these rows, always in this order: Working dir · Branch · PR/MR · Model · Effort · Context.
  - **Full values:** every value is shown in full and wraps when long (for example `word-break: break-all` for paths).
  - **Missing values:** a row with no value shows `—`. Rows are never hidden, so the layout stays the same.
  - **Working dir:** has a copy button (`navigator.clipboard.writeText`). It shows "Copied" for about 1.5 s. If the browser blocks the clipboard, nothing breaks.
  - **PR/MR:** uses the provider label (`PR #12` / `MR !12`) as a link that opens in a new tab (existing `ExternalLink` atom). The row label is "Pull request" or "Merge request".
  - **Context:** shows `34% · 68k / 200k` plus a thin react-bootstrap `ProgressBar`.
- **Closing:**
  - ✕, Esc, or a click on the backdrop closes the panel.
  - Esc closes only the panel, not the room.
  - Selecting another room, or going Back, closes it too.
- **Live updates:** values update while the panel is open (it reads `room.info` from the store).
- **Other panels:** the panel shows only in the main chat view. Opening MCP or sub-agent details hides it.

## Non-Functional Requirements

- **Conventions:** the molecule is pure (props in, `onClose` out, local state only for "Copied"). `ChatPanel` (an organism) connects the store. Labels go in `ui.config.ts`.
- **Accessibility:** the panel has `role="dialog"`, `aria-label="Session info"`, and focus moves to the ✕ button on open.
- **Dark mode:** colours use Bootstrap CSS variables (`--bs-body-bg`, `--bs-border-color`), so dark mode works.
- **Checks:** `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.

## Files in Scope

- **Create:**
  - `apps/web/src/hooks/store/useSessionInfoStore.ts`
  - `apps/web/src/components/molecules/SessionInfoPanel.tsx`
- **Delete:** `apps/web/src/components/molecules/SessionInfoBar.tsx`
- **Modify:**
  - `apps/web/src/components/organisms/ChatPanel.tsx`: add the (i) button, render the panel, close it on room change, and remove the strip.
  - `apps/web/src/hooks/feature/useEscapeClose.ts`: close the panel first.
  - `apps/web/src/configs/ui.config.ts`: update `SESSION_INFO_TEXT` (row labels, panel title, copy / copied text).
  - `apps/web/src/styles/chat.css`: remove the `.chat-panel__info*` styles, add the panel and backdrop styles, and add `position: relative` to `.chat-panel`.
- `TokenFormatUtil` and the server code stay as they are.

## Risks & Assumptions

- **Assumption:** rows with no value show `—` instead of being hidden. The user did not say which they want, so this keeps the layout the same each time.
- **Assumption:** the panel is as wide as the chat and sits just under the header, with a light dim layer over the messages.
- **Risk:** the clipboard API needs a secure context. `localhost` counts as one, so copy works here.
- **Testing:** the workflow is `Skip-Testing`, so there is no tester task.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Add `useSessionInfoStore` and the Esc handling in `useEscapeClose`. Build the pure `SessionInfoPanel` (rows, copy button, PR/MR link, context bar, ✕) with CSS. Wire it into `ChatPanel` (the (i) button, backdrop click, close on room change). Delete `SessionInfoBar` and its CSS, and clean up `SESSION_INFO_TEXT`. | developer | none | Meets the Functional Requirements. No value is cut off. Esc closes only the panel. Grep finds no `SessionInfoBar` / `chat-panel__info`. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
