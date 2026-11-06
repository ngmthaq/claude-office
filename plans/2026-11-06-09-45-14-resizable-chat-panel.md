# Title: Plan — Resizable chat panel

- Classification: feature
- Description: Add a drag handle on the left edge of the chat drawer. It sets the width between 30rem and 50rem, keeps the office canvas at least 20rem wide, and saves the width in localStorage.

---

## Approach Summary / Goal

- Add a thin vertical drag handle on the left edge of `.chat-drawer`. Dragging it left makes the chat wider.
- Store the width in a small Zustand store, and write it to the drawer as a CSS variable (`--chat-width`). Both `width` and the hidden-state `margin-right` use this variable, so the slide in/out animation keeps working.
- Clamp the width to `[30rem, min(50rem, space left so the office canvas keeps ≥ 20rem)]`. Clamp again when the window size changes.
- Goal: the user can pick a comfortable chat width, and it stays after a reload.

## Functional Requirements

1. A handle on the left edge of the open chat drawer. The cursor shows `col-resize` on hover.
2. Pointer drag (mouse, pen, touch) changes the width live. Dragging left makes it wider.
3. Min width is 30rem (480px), the same as today. Max width is the smaller of 50rem (800px) and (app width − session list width − 20rem).
4. When the window is too small for even 30rem plus a 20rem office, the min wins (30rem, capped at 100% as today).
5. On window resize, the saved width is clamped again so the office never drops below 20rem (while space allows).
6. Double-click on the handle resets the width to 30rem.
7. Keyboard: the handle can get focus (Tab). ← makes it wider and → makes it narrower, by 1rem steps. Home sets the min and End sets the max.
8. The width is saved to localStorage (key `claude-office.chatWidth`, stored in px) when a drag or key change ends. On load, the app reads it back and clamps it. A bad or missing value gives 30rem.
9. The open/close slide animation still works at any width.
10. While dragging: no text selection, the drawer has no width transition (so it does not lag), and the office canvas resizes as you drag.

## Non-Functional Requirements

- Accessibility: the handle has `role="separator"`, `aria-orientation="vertical"`, `aria-valuemin/max/now`, `aria-label="Resize chat panel"`, and a visible focus style.
- localStorage reads and writes are wrapped in try/catch. A blocked storage never breaks the app.
- No new dependencies. Same CSS colors as the current borders.
- Speed: pointer moves are throttled with `requestAnimationFrame`.

## Files in Scope

- Create: `apps/web/src/features/chat/ChatResizeHandle.tsx` — the handle (pointer, double-click, and keys).
- Create: `apps/web/src/features/chat/use-chat-width-store.ts` — width state, clamp logic, and localStorage load/save.
- Modify: `apps/web/src/App.tsx` — render the handle inside `.chat-drawer` and set `--chat-width` on it.
- Modify: `apps/web/src/styles.css` — `.chat-drawer` uses `var(--chat-width, 30rem)` for `width` and `margin-right`. Add the handle styles and a "dragging" class that turns off the transition.

## Risks & Assumptions

- Assumption: 1rem = 16px (the browser default). The clamp math reads the real root font size, so it still works if this changes.
- Assumption: the session list stays a fixed 15rem. The developer reads its real width from the DOM for the clamp, not a hard-coded number.
- Risk: PixiJS resizes the canvas on every drag frame. `resizeTo` handles this, but a very large room may feel slow. We will check this in the browser test.
- Assumption: this work goes on the current branch `feat/chat-autocomplete`. Tell me if you want a new branch from `main` instead.
- Skip-Testing: no tester task. I will check with typecheck, lint, and review.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1 | DONE | Build `use-chat-width-store.ts` and `ChatResizeHandle.tsx`; wire them into `App.tsx`; update `.chat-drawer` CSS to use `--chat-width` and add the handle styles | developer | none | Functional Requirements 1–10 work. Slide animation works at any width. Typecheck, lint, and prettier pass. No `any`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/ATOMIC_DESIGN.md` |
