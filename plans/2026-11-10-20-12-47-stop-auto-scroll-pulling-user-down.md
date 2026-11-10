# Title: Plan — Stop chat auto-scroll from pulling the user down

- Classification: feature
- Description: Rewrite `useAutoScroll` so it follows new content only while the user is at the bottom, and add a "Scroll to bottom" button to both panels.

---

## Approach Summary / Goal

- The hook works on the scroll container and keeps a "follow" flag. The flag decides if new content moves the view.
- Today the hook scrolls on every update and never checks where the user is.
- The plan follows issue #5, with your two changes: any scroll up stops auto-scroll, and sending a message jumps to the bottom.
- Goal: the user can read older messages while output streams, and can get back to the bottom in one click.

## Functional Requirements

- While output streams, any scroll up stops auto-scroll, even a small one. The view stays still and the button appears.
- Scrolling back to within 32px of the bottom hides the button and turns auto-scroll on.
- Clicking the button jumps to the bottom at once (no smooth scroll) and turns auto-scroll on.
- When a new user message is added, `MessageList` jumps to the bottom and turns auto-scroll on.
- Opening a room still starts at the bottom.
- The sub-agent details panel works the same way, except for the jump on send, because it has no chat input.

## Non-Functional Requirements

- `pnpm typecheck`, `pnpm lint` and `pnpm format:check` pass.
- The hook calls `setAtBottom` only from scroll events and `scrollToBottom`, so streaming does not add extra renders.
- The code follows the web layer rules. The new molecule stays pure, and constants go in `ui.config.ts`.

## Files in Scope

- Change: `apps/web/src/hooks/feature/useAutoScroll.ts`
- Create: `apps/web/src/components/molecules/ScrollToBottomButton.tsx`
- Change: `apps/web/src/components/organisms/MessageList.tsx`
- Change: `apps/web/src/components/organisms/SubagentDetails.tsx`
- Change: `apps/web/src/configs/ui.config.ts`
- Change: `apps/web/src/styles/chat.css`

## Risks & Assumptions

- The hook's rule in `onScroll`, in this order:
  1. If `scrollTop` went down and the view is more than 1px from the very bottom, follow turns off.
  2. Else, if the view is within 32px of the bottom, follow turns on.
- The 1px gap covers fractional scroll values. It also means that a list getting shorter cannot turn follow off, because the browser then puts the view at the very bottom.
- `atBottom` always has the same value as the follow flag, so the button shows only while auto-scroll is off.
- `lastScrollTopRef` is also updated after each automatic scroll, so a later user scroll compares against the right value.
- The jump on send watches the id of the last `user` item. History replay can also add user items, but only before the user has scrolled, so the jump changes nothing there.
- Risk: while the user is scrolled up, a new permission card appears below the view. The button is the only sign of it. The issue does not ask for more, so I leave this as it is.
- Risk: going to the sub-agent panel and back remounts the list, so it starts at the bottom again. This is how it works today.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `ui.config.ts`, add `AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 32`, `AUTO_SCROLL_AT_END_TOLERANCE_PX = 1` and `SCROLL_TO_BOTTOM_LABEL = 'Scroll to bottom'`. | developer | none | The constants are exported and used by tasks 2 and 3. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE | Rewrite `useAutoScroll` to return `{ containerRef, onScroll, atBottom, scrollToBottom }`. Use `followRef`, `lastScrollTopRef`, a `useLayoutEffect` on `dependency`, and the `onScroll` rule above. | developer | task 1 | Follow turns off on any scroll up that is not at the very bottom. It turns on within 32px. Updates do not move the view when follow is off. `scrollToBottom` jumps at once. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE | Create the `ScrollToBottomButton` molecule. It wraps `IconButton` with `icon="arrow-down"`, uses `SCROLL_TO_BOTTOM_LABEL`, and takes `visible` and `onClick` props. Add its style in `chat.css`: it floats near the bottom-centre of the list. | developer | task 1 | The button renders only when visible. It floats above the messages and does not change the layout. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | DONE | Update `MessageList`. Wrap the list in `.scroll-area`, put `containerRef` and `onScroll` on `.message-list`, remove the end marker, and render the button. Call `scrollToBottom` when the id of the last `user` item changes. In `chat.css`, add `.scroll-area` (`position: relative; display: flex; flex: 1; flex-direction: column; min-height: 0`) and `min-height: 0` on `.message-list`. | developer | tasks 2, 3 | All chat scenarios work as in the requirements, including the jump on send. Opening a room starts at the bottom. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | DONE | Update `SubagentDetails`. Wrap the body in `.scroll-area`, put `containerRef` and `onScroll` on `.subagent-details__body`, remove the end marker, and render the button. | developer | tasks 2, 3, 4 | The sub-agent panel scrolls the same way as the chat panel. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6   | DONE | Run `pnpm typecheck`, `pnpm lint` and `pnpm format:check`. Fix any problem in the changed files. | developer | tasks 1–5 | All three commands pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |

There is no tester task, because this project skips automated tests. After my review, I will run the `web-test` flow in a real browser with a live Claude session, as you chose. That flow asks you to approve its test cases before it starts.
