# Title: Plan — UI revamp with React-Bootstrap and Bootstrap Icons

- Classification: feature
- Description: Install `bootstrap`, `react-bootstrap`, and `bootstrap-icons`. Use the Bootstrap dark theme. Move all web UI to React-Bootstrap components, and turn small actions into icon-only buttons with tooltips.

---

## Approach Summary / Goal

- Add the 3 packages to `apps/web`. Import the Bootstrap CSS and Bootstrap Icons CSS in `main.tsx`, before `styles.css`. Set `data-bs-theme="dark"` on `<html>`.
- Add one shared `components/IconButton.tsx`. It wraps React-Bootstrap `Button` + `OverlayTrigger` + `Tooltip`. It needs a `label` prop, which it uses for both the tooltip and `aria-label`.
- Move each feature's markup to React-Bootstrap (`Button`, `Modal`, `Form`, `ListGroup`, `Badge`, `Card`, `Alert`). Keep all the current logic, stores, and events.
- At the end, cut `styles.css` down to only what Bootstrap can't do.
- Goal: the app looks the same everywhere, and button actions are clear and small.

## Functional Requirements

1. `bootstrap`, `react-bootstrap`, and `bootstrap-icons` are in `apps/web/package.json` and installed with pnpm.
2. The app uses the Bootstrap dark theme (`data-bs-theme="dark"`).
3. **Icon-only + tooltip** for small actions: close, cancel/back, rename, archive, stop, browse/parent folder, open history, open archived, restore, and so on. Each one shows a tooltip on hover/focus and has an `aria-label`.
4. **Icon + text** for main actions: Send, New session, Confirm/Start, Delete/Close (danger), Allow/Deny on permission cards.
5. Dialogs (`NewSessionDialog`, `HistoryDialog`, `ArchivedDialog`, `CloseConfirmDialog`) use React-Bootstrap `Modal`. Open/close works the same as now. Esc and the focus on the cancel button still work.
6. Inputs (`ChatInput` textarea, `RoomRenameInput`) use `Form.Control`. Keyboard actions (Enter to send, autocomplete keys, Esc to cancel rename) still work.
7. Cards in the chat (`ToolCard`, `PermissionCard`, `SubagentCard`, `AuthErrorNotice`) and `ConnectionBadge` use Bootstrap `Card` / `Alert` / `Badge`.
8. These things look and work as before: the office canvas, the chat drawer open/close slide, the resize handle, the autocomplete popup position, and markdown in messages.

## Non-Functional Requirements

- No Bootstrap JS bundle. Only React-Bootstrap.
- Follow `CODING_CONVENTIONS.md`: `@/` imports, no barrel files, strict TS, no `any`.
- `pnpm --filter @claude-office/web typecheck` and `build` pass.
- Accessibility: every icon-only button has an `aria-label`.

## Files in Scope

- `apps/web/package.json`, `pnpm-lock.yaml`
- `apps/web/index.html` (theme attribute)
- `apps/web/src/main.tsx` (CSS imports)
- New: `apps/web/src/components/IconButton.tsx`
- `apps/web/src/App.tsx`, `components/ConnectionBadge.tsx`
- `features/sessions/`: `SessionList.tsx`, `NewSessionDialog.tsx`, `FolderPicker.tsx`, `RoomRenameInput.tsx`
- `features/history/HistoryDialog.tsx`, `features/archived/ArchivedDialog.tsx`
- `features/chat/`: `ChatPanel.tsx`, `ChatInput.tsx`, `MessageList.tsx`, `ToolCard.tsx`, `PermissionCard.tsx`, `SubagentCard.tsx`, `AuthErrorNotice.tsx`, `CloseConfirmDialog.tsx`, `AutocompletePopup.tsx`
- `features/subagents/SubagentDetails.tsx`
- `apps/web/src/styles.css`
- Not in scope: `game/*`, stores, `ws-client.ts`, server, shared package.

## Risks & Assumptions

- **Assumption:** I chose which buttons are icon-only and which are icon + text using the rule in FR 3–4. Developers can choose the exact icon names.
- **Risk:** Bootstrap's reboot CSS changes base styles (fonts, margins, `box-sizing`). Small layout changes may happen. The browser check at the end will catch them.
- **Risk:** React-Bootstrap `Modal` renders in a portal on `document.body`. Custom focus code in dialogs may need small changes.
- **Risk:** Bootstrap CSS adds about 30 KB gzip to the bundle. This is fine for a local app.
- **Assumption:** The pixel look stays inside the PixiJS canvas only. The panels around it use the normal Bootstrap look.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

Tasks 2–5 run in parallel after task 1. They do **not** edit `styles.css`. Each one lists the CSS classes it stops using. Task 6 removes those rules.

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1 | TODO | Setup: install `bootstrap`, `react-bootstrap`, `bootstrap-icons` in `apps/web`. Import their CSS in `main.tsx` before `@/styles.css`. Add `data-bs-theme="dark"` in `index.html`. Create `components/IconButton.tsx` (props: `icon`, `label`, `variant?`, `size?`, `placement?`, `onClick`, other `Button` props). Move `App.tsx` header and `ConnectionBadge.tsx` to Bootstrap. | developer | none | Packages in `package.json`. Dark theme shows. `IconButton` shows a tooltip and has `aria-label={label}`. Header and badge use Bootstrap classes. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
| 2 | TODO | Sessions: `SessionList.tsx`, `NewSessionDialog.tsx`, `FolderPicker.tsx`, `RoomRenameInput.tsx`. Use `ListGroup`, `Modal`, `Form.Control`, `IconButton`. | developer | task 1 | Session actions are icon-only with tooltips. "New session" and "Start" are icon + text. Dialog is a `Modal`. Rename keys work. Typecheck passes. Lists the CSS classes no longer used. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | TODO | History + Archived: `HistoryDialog.tsx`, `ArchivedDialog.tsx`. Use `Modal`, `ListGroup`, `IconButton`. | developer | task 1 | Both dialogs are `Modal`s. Close and restore are icon-only with tooltips. Open/close works as before. Typecheck passes. Lists the unused CSS classes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | TODO | Chat: `ChatPanel.tsx`, `ChatInput.tsx`, `MessageList.tsx`, `AutocompletePopup.tsx`, `CloseConfirmDialog.tsx`. Use `Form.Control`, `Modal`, `IconButton`, `ListGroup` for the popup. Keep the drawer slide, resize handle, and popup position. | developer | task 1 | Header actions are icon-only with tooltips. Send is icon + text. Close confirm is a `Modal` with a danger button. Enter, autocomplete, and resize still work. Typecheck passes. Lists the unused CSS classes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | TODO | Chat cards + sub-agent panel: `ToolCard.tsx`, `PermissionCard.tsx`, `SubagentCard.tsx`, `AuthErrorNotice.tsx`, `SubagentDetails.tsx`. Use `Card`, `Alert`, `Badge`, `IconButton`. | developer | task 1 | Cards use Bootstrap `Card`/`Alert`. Allow/Deny are icon + text. Close buttons are icon-only with tooltips. Typecheck passes. Lists the unused CSS classes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | TODO | CSS cleanup: in `styles.css`, remove the rules from tasks 2–5 that are no longer used. Remove colors and fonts that Bootstrap now sets. Keep the layout, drawer, resize handle, canvas, and popup position rules. Use Bootstrap CSS variables (`--bs-*`) where colors are still needed. | developer | tasks 2–5 | No unused selectors are left (grep finds each class in the TSX). `styles.css` is much shorter. `typecheck` and `build` pass. | `guides/CLEAN_CODE/DRY.md`, `guides/CLEAN_CODE/KISS.md` |
| 7 | SKIPPED | Automated tests | tester | — | The project uses Skip-Testing. | `agents/party-mode-tester.md#testing-workflow` |

After task 6, I review the work (Step 6). Then I check the main screens and all 4 dialogs in Chrome and take screenshots.

---

## Plan add-on (approved) — Main actions icon-only

The user changed FR 4: main actions are also icon-only with a tooltip. No button shows a text label.

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | TODO | Change the main action buttons to `IconButton`, keeping their colors (`variant`): Send (`primary`), Stop (`danger`), New session, History, Archived (sidebar), Start here, Allow (`success`), Deny (`outline-danger`), confirm close (`danger`), Cancel in close confirm (`x-lg`, "Cancel"). In `IconButton.tsx`, wrap a disabled button in a `<span>` so its tooltip still shows. Files: `ChatInput.tsx`, `SessionList.tsx`, `NewSessionDialog.tsx`, `PermissionCard.tsx`, `CloseConfirmDialog.tsx`, `components/IconButton.tsx`. | developer | task 6 | No button in these files shows a text label. Each one has a tooltip and an `aria-label`. Colors stay the same. `disabled` still works, and a disabled button still shows its tooltip. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |

---

## Plan add-on 2 (approved) — Header actions + Esc fix

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 9 | TODO | Move the New session, History, and Archived `IconButton`s from `SessionList.tsx` to the right side of the app header (`ms-auto`), in a new `features/sessions/HeaderActions.tsx` used by `App.tsx`. Move the 3 dialog mounts with them. Remove the sidebar button group and its unused CSS. | developer | task 8 | The header shows the 3 icon buttons with tooltips on the right. The sidebar shows only the session list. All 3 dialogs open as before. Typecheck and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 10 | TODO | Review fix (high): Esc in a Bootstrap `Modal` also closes the chat room (Modal's `document` listener runs before App's `window` listener, after the store is already closed). Each Modal passes `onEscapeKeyDown={(e) => e.stopPropagation()}`. | developer | with task 9 | Esc in each dialog closes only the dialog. The selected room stays open. Esc without a dialog works as before. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 11 | TODO | Chat panel header (user request): Back button and title on the left; Close session and Archive session buttons on the right (wrap them in `ms-auto d-flex gap-2`). File: `features/chat/ChatPanel.tsx`. | developer | none | Back + title are left-aligned. Close and Archive are right-aligned at the header's end, also when the title is short or long (title truncates). Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 12 | TODO | Sidebar empty state (user request): when `rooms` is empty, `SessionList.tsx` shows a muted, centered message with a `bi-inbox` icon: "No sessions yet. Use the + button in the header to start one." File: `features/sessions/SessionList.tsx`. | developer | task 9 | Message shows only when there are no rooms; hidden when one or more exist. Uses Bootstrap utilities (`text-body-secondary`, `text-center`, etc.). Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 13 | TODO | Dialog close button (user report): in `HistoryDialog.tsx` and `ArchivedDialog.tsx` the close `IconButton` sits mid-header next to the title. Use `<Modal.Header closeButton>` (same as `NewSessionDialog`), move the subtitle `<p>` into `Modal.Body`, remove the custom close `IconButton`. | developer | none | Close × sits at the right edge of the header in all 4 dialogs and looks the same. Clicking it closes the dialog. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 14 | TODO | Chrome check fixes: (a) autocomplete active row: `.autocomplete__name` (and `__muted`/`__desc`) keep their colors on the blue `active` row, so the name is unreadable — inherit the active text color on `.autocomplete__row.active`. (b) sidebar rooms not selected use `Button variant="link"` and look like underlined blue links — make them plain body-colored rows (no underline), selected stays `primary`. Files: `styles.css`, `features/sessions/SessionList.tsx`. | developer | none | Active autocomplete row text is readable. Unselected rooms show as plain text rows, no underline; selected room is highlighted. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 15 | TODO | User request: in `features/chat/ChatPanel.tsx`, change the Archive session `IconButton` icon from `archive` to `box-arrow-in-down`, so it differs from the header's Archived button. | developer | none | Archive session button shows `bi-box-arrow-in-down`; label and logic unchanged. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
