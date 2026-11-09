# Title: Plan — Move the attach button below Send and Stop

- Classification: feature
- Description: Change the button order in the chat input to Send, Stop, Attach, then Mode.

---

## Approach Summary / Goal

- Goal: Send and Stop come first in the button column, and Attach comes after them.
- The JSX for the paperclip button moves below the Send and Stop buttons. No CSS change is needed, because the column already stacks its children in order.

## Functional Requirements

- The order from top to bottom is Send, Stop, Attach, Mode. Send and Stop still show only in their current states.
- The attach button still opens the file picker and is still disabled while sending.

## Non-Functional Requirements

- No behaviour changes other than the button order.

## Files in Scope

- Change: `apps/web/src/components/organisms/ChatInput.tsx`
- Update by command: `graphify-out/`

## Risks & Assumptions

- I assumed the permission mode button should stay last, because you named only Send and Stop.
- Testing Workflow is `Skip-Testing`, so there are no tester tasks.

## Open Questions / Blockers

- None block the plan. See the browser check question below.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | In `ChatInput.tsx`, move the hidden file input and the paperclip `IconButton` to after the Send and Stop buttons inside `chat-input-buttons`. | developer | none | Order is Send, Stop, Attach, Mode. The file picker still opens, and the button is disabled while sending. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Run typecheck, lint and build. Run `graphify update .`. | developer | 1 | All checks pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
