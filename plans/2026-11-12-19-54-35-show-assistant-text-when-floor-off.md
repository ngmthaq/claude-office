# Title: Plan — Agent text messages disappear from the chat panel when "Show floor" is off

- Classification: bug
- Description: Stop chat items from shrinking inside the scrolling message list, so assistant messages keep their full height when the floor is off.

---

## Approach Summary / Goal

- Root cause: `.message-list` (`apps/web/src/styles/chat.css:74`) is a column flexbox that scrolls, and its children can shrink (`flex-shrink: 1` by default). With the floor off, `.chat-drawer--full .message--assistant` gets `overflow-x: auto` (`chat.css:276-280`). A flex child whose overflow is not `visible` loses its content-based minimum height. When the list is taller than the panel, the browser shrinks assistant messages to almost zero height and their text is cut off. Cards have no overflow rule, so they keep their height.
- Fix: add `.message-list > * { flex-shrink: 0; }` in `chat.css` next to the `.message-list` rule. Every chat item then keeps its content height, whatever its overflow is.
- Goal: the chat panel shows the same messages with the floor on or off.

## Functional Requirements

- Floor off: all agent text replies show with full height in a long, scrolling session.
- Floor off: user messages, cards and internal events show as before.
- Turning the floor on and off again does not hide any message.
- Messages that arrive while the floor is off show up right away.
- Floor on: the chat panel looks and works the same as today.
- Floor off: wide tables in assistant messages still scroll sideways inside the message.

## Non-Functional Requirements

- CSS only. No JS changes and no new store state.
- Plain CSS, in the same style as `chat.css`.

## Files in Scope

- `apps/web/src/styles/chat.css` (change)

## Risks & Assumptions

- Assumption: only `MessageList.tsx` uses `.message-list`, so the rule affects the main chat list only. A search showed no other use.
- Risk: nothing in the list can shrink now. Items were not meant to shrink before, so this should not change the floor-on layout.
- Note: bug plans normally need a regression test. You chose a browser check instead, so the tester task is skipped.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status  | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------- | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE    | In `apps/web/src/styles/chat.css`, add `.message-list > * { flex-shrink: 0; }` right after the `.message-list` rule. Do not change other rules. Run lint and build for `apps/web`. | developer | none | The rule exists, and nothing else in the file changes. Lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | SKIPPED | Regression test. Skipped because you chose a browser check only. | tester | — | — | `agents/party-mode-tester.md#testing-workflow` |
| 3   | DONE    | Browser check (Root Agent with the web-test skill, no code changes). Use a long session with assistant text, a table and cards. Check floor on, floor off, toggling back and forth, and messages that arrive while the floor is off. | — (Root Agent check at Step 6) | task 1 | Every acceptance item in issue #10 passes, with screenshots. Floor-on view is unchanged. | `.claude/skills/web-test/SKILL.md` |
| 4   | DONE    | After the review passes, commit the fix on `main` (Root Agent). | — (Root Agent) | task 3 | One commit on `main` with the CSS fix and the saved plan. | — |
