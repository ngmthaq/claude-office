# Title: Plan — Full-width chat messages when "Show floor" is off

- Classification: feature
- Description: Add CSS rules under `.chat-drawer--full` that remove the 48rem width cap from chat items, so they fill the chat panel when the floor is hidden.

---

## Approach Summary / Goal

- Today every chat item in `apps/web/src/styles/chat.css` has `max-width: 48rem`. When the floor is off, the drawer gets the `chat-drawer--full` class, but nothing changes the item caps.
- Add new rules scoped to `.chat-drawer--full` that override these caps. The floor-on rules stay as they are, so the floor-on view does not change.
- Goal: with the floor off, assistant messages and cards fill the panel. User messages stay on the right, capped at 80%.

## Functional Requirements

- Floor off: `.message--assistant` fills the full message-list width.
- Floor off: `.tool-card`, `.permission-card`, `.subagent-card`, `.peer-card`, `.system-card` (and the question card, which uses one of these classes or Bootstrap `card`) fill the full width.
- Floor off: `.message-user` (and the `.message--user` bubble in it) stays on the right and has `max-width: 80%`.
- Floor off: `.notice` and `.internal-row` lose the 48rem cap but keep their current shrink-to-content and position.
- Code blocks (`pre`) and tables grow with their parent card or message.
- The sub-agent details panel (same drawer) follows the same rules.
- Floor on: no visual change.
- Window resize: items stay at full panel width (pure CSS, no JS sizes).

## Non-Functional Requirements

- CSS only. No new JS, no new store state.
- Keep rules in `chat.css` next to the existing caps, plain CSS, same style as the file.

## Files in Scope

- `apps/web/src/styles/chat.css` (change)
- `apps/web/src/components/molecules/AskUserQuestionCard.tsx` (change only if the question card has no class the new rules can target)

## Risks & Assumptions

- Assumption: the error card is the `.system-card` (or a Bootstrap alert inside the list). The developer confirms which class it uses.
- Risk: on a very wide screen, assistant text lines become long. You asked for full width, so this is expected.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `apps/web/src/styles/chat.css`, add `.chat-drawer--full` rules: `max-width: none` for `.message--assistant`, `.notice`, `.internal-row` and all card classes; `max-width: 80%` for `.message-user`; check every card type (tool, permission, question, sub-agent, peer, error) has a matching class. Run lint and build for `apps/web`. | developer | none | All listed items fill the panel with floor off; user bubbles stay right at ≤80%; floor-on CSS is unchanged; lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Browser check (Root Agent with the web-test skill, no code changes): floor on vs off, a session with assistant text, code block, table and cards, open a sub-agent details panel, resize the window. | — (Root Agent check at Step 6) | task 1 | Each acceptance item in issue #7 is seen to pass, with screenshots. | `.claude/skills/web-test/SKILL.md` |

No tester task, because the project uses Skip-Testing and this is a CSS-only change.

---

# Plan update — Full-width chat when "Show floor" is off (round 2)

**Why:** In the browser check (TC-04), small tables kept a full-width outer box, but their grid stayed as narrow as their text. The cause is the `display: block` rule on tables in `chat.css`. That rule lets wide tables scroll sideways, but it stops the grid from stretching to the box width.

**New task**

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | DONE | In `apps/web/src/styles/chat.css`, under `.chat-drawer--full` only: give tables in `.message--assistant`, `.peer-card__body` and `.system-card__body` `display: table; width: 100%`. Give those three parents `overflow-x: auto`, so very wide tables still scroll sideways. Run lint and build for `apps/web`. | developer | task 1 | With the floor off, every table's grid fills its parent (even 2-column tables). A table wider than the panel scrolls sideways inside its message or card, and the page does not scroll sideways. With the floor on, tables look the same as today. Lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | Browser re-check (Root Agent): re-run TC-04 on "Parallel file listing" and "Toggle button with tooltip", plus TC-01 and TC-08 for the floor-on view. | — (Root Agent check at Step 6) | task 3 | In each session, every table's first row matches the parent width (within 2px) with the floor off. Floor-on tables are unchanged. | `.claude/skills/web-test/SKILL.md` |

**Risk:** a very wide table now scrolls with its whole message or card, not on its own. With the floor off there is plenty of room, so this should rarely happen.

---

# Plan update — Space below tables (round 3)

**Why:** The user saw that a table runs straight into the next heading (no gap below the table). The user chose to fix it with the floor on and off.

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 5 | DONE | In `apps/web/src/styles/chat.css`, give tables in `.message--assistant`, `.peer-card__body` and `.system-card__body` a `1rem` bottom margin, but not when the table is the last child (so no extra space at the end of a message or card). Applies with the floor on and off. Run lint and build. | developer | task 3 | There is a 1rem gap between a table and the next element. A table that ends a message or card adds no extra space. Lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | DONE | Browser check (Root Agent): measure the gap below tables in "Toggle button with tooltip", with the floor on and off. | — (Root Agent check) | task 5 | The gap between a table and the next element is 16px. The last-child tables have 0 bottom margin. | `.claude/skills/web-test/SKILL.md` |

> Round 3 check: every table in "Toggle button with tooltip" has a 16px gap to the next P/H2/H3, with the floor on and off. No session had a table as the last child, so the `:last-child` reset was not seen in the browser.
