# Title: Plan — Add a switch to show or hide the office floor

- Classification: feature
- Description: Add a saved "Show floor" switch in the header. When it is off, the app removes the PixiJS floor and the chat fills the space next to the sidebar.

---

## Approach Summary / Goal

- A small new Zustand store holds the switch value and saves it in `localStorage`, the same way `useChatWidthStore` does.
- When the switch is off, `OfficePage` does not render `GameCanvas`. Its existing cleanup then destroys the PixiJS app, so the floor uses no CPU or GPU.
- A new CSS class makes the chat drawer fill the free space. The saved chat width does not change, so the old width comes back when the switch goes on.
- Goal: users who only want sessions and chat get the full width, and the floor costs nothing.

## Functional Requirements

- The header shows a "Show floor" switch next to the other actions. It is on by default.
- Switch on: the layout and behaviour are the same as today.
- Switch off: only the header, sidebar, and chat panel are visible.
- Switch off: the chat fills all the space to the right of the sidebar, and the resize handle is not rendered.
- Switch off with no session selected: the space shows "Select a session to start chatting".
- Switch off: no PixiJS app exists, and a reload with the switch off does not create one.
- Switch on again: the floor comes back from the current session data, and the chat has the width the user set before.
- The switch keeps its value after a page reload. If storage is blocked, it is on by default and lasts for that page only.
- Select, new, close, archive, and history work the same with the switch on or off.
- The switch has a label and works with the keyboard.
- If the user is renaming a room on the floor when the switch goes off, the rename stops. Without this, the Escape key would stop closing the chat.

## Non-Functional Requirements

- Web app only. No server or shared package changes.
- Turning the switch does not remount `ChatPanel`, so drafts and scroll position stay.
- Code follows `CODING_CONVENTIONS.md`.

## Files in Scope

- `apps/web/src/configs/layout.config.ts` (change)
- `apps/web/src/configs/ui.config.ts` (change)
- `apps/web/src/hooks/store/useFloorStore.ts` (new)
- `apps/web/src/components/organisms/HeaderActions.tsx` (change)
- `apps/web/src/components/pages/OfficePage.tsx` (change)
- `apps/web/src/components/templates/AppLayout.tsx` (change)
- `apps/web/src/components/organisms/GameCanvas.tsx` (change)
- `apps/web/src/components/organisms/ChatPanel.tsx` (change)
- `apps/web/src/styles/chat-drawer.css` (change)
- `apps/web/src/styles/chat.css` (change)

## Risks & Assumptions

- Risk: the app has never rebuilt a PixiJS app after a full draw. Sprites could be blank the second time. The browser check covers this. If it happens, the fix is the PixiJS `releaseGlobalResources` destroy option.
- Sub-agents that are working walk into the room again when the floor comes back. You accepted this with the "Remove it" choice.
- Assumption: the switch goes before the "New session" button, after the usage badge.
- Assumption: the helper message is also shown when there are no sessions at all. The issue only asks for "no session selected", and that case includes this one.
- Assumption: if the window gets smaller, the chat width is still limited as it is today, even with the switch off.
- Automated tests are skipped, because the project setting is `Skip-Testing`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1 | DONE | Add `FLOOR_VISIBLE_STORAGE_KEY` to `layout.config.ts`. Add `FLOOR_TEXT` (switch label, helper message) to `ui.config.ts`. Create `useFloorStore.ts` with `visible` and `setVisible`, which saves to `localStorage` inside try/catch. | developer | none | Default is `true`. The value loads after a reload. Blocked storage does not throw. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Add a react-bootstrap `Form.Check type="switch"` to `HeaderActions.tsx`, connected to the store. | developer | task 1 | The switch has the visible label "Show floor", works with Tab and Space, and lines up with the header buttons. | `guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
| 3 | DONE | In `OfficePage.tsx`, pass `canvas` and `resizeHandle` as `null` when the switch is off, and pass a `floorVisible` prop. In `AppLayout.tsx`, add the `chat-drawer--full` class when it is off. | developer | task 1 | Switch off: no `.game-canvas` or `.chat-resize-handle` in the DOM. Switch on: the DOM is the same as today. `ChatPanel` does not remount. | `guides/CLEAN_CODE/ATOMIC_DESIGN.md` |
| 4 | DONE | In `chat-drawer.css`, add `.chat-drawer--full`: fill the free space, always visible, no slide animation, no double border next to the sidebar. | developer | task 3 | Switch off: the chat touches the sidebar and the right edge, with no empty gap. `--chat-width` is not changed. | `guides/CLEAN_CODE/KISS.md` |
| 5 | DONE | In `ChatPanel.tsx`, when there is no room and the switch is off, show the helper message. Add its style to `chat.css`. | developer | tasks 1, 4 | The message is centred when the switch is off and no session is selected. Nothing shows while the drawer closes with the switch on. | `guides/CLEAN_CODE/KISS.md` |
| 6 | DONE | In the `GameCanvas.tsx` effect cleanup, call `stopRename` if the current rename has `place === 'office'`. | developer | none | Turning off during a floor rename clears the rename, and Escape closes the chat again. A sidebar rename is not touched. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 7 | SKIPPED | Automated tests. Reason: the project uses `Skip-Testing`. | tester | none | None. | `agents/party-mode-tester.md#testing-workflow` |

After the review, I will run the issue's acceptance criteria in a real browser, including turning the floor off and on again to confirm the sprites draw.
