# Title: Plan — Match the result card style to the sub-agent and tool cards

- Classification: feature
- Description: Restyle `PeerMessageCard` so its header and body match the existing cards: bold label, grey one-line detail, capped width, pointer cursor, and the report shown without a chat bubble.

---

## Approach Summary / Goal

- **Header:** match `SubagentCard`. Robot icon, then a **bold label**, then a grey detail truncated to one line (`flex-grow-1 text-truncate text-body-secondary`), then the badge.
  - Hand-back and task cards get the label "Result". Peer messages get "Message".
  - The detail is the description for task cards. It comes from the server title with the `Result: ` prefix removed, or "Sub-agent result" if there's no title. For hand-backs it's the sender name or "sub-agent". For peer messages it's the sender name or "another session".
- **Body:** match `ToolCard`. A small grey `h6` heading "Report" above the markdown, with no `.message--assistant` bubble. The markdown goes in a new `.peer-card__body` class. It gets the same table, cell and `pre` styles as assistant messages, by adding it to the existing selectors in `chat.css`.
- **CSS:** add `.peer-card` to the `max-width: 48rem` rule and `.peer-card summary` to the pointer-cursor rule. Remove the redundant `.peer-card table` rule.
- **Goal:** the result card looks like part of the same card family as the sub-agent card it belongs to.

## Functional Requirements

- **Collapsed header:** one line, with the icon, the bold label, the grey truncated detail, and the badge (for hand-back and task cards). It never wraps. Long details end in "…".
  - For example, a task card shows **Result** · `Count files in events dir` · `done`.
- **Pointer cursor:** the header shows a pointer cursor.
- **Width:** the card is never wider than `48rem`, like the other cards.
- **Expanded body:**
  - The "Open sub-agent" link, when there is one.
  - A small grey "Report" heading.
  - The markdown report. Tables have borders and scroll sideways, the same as in assistant messages. Code blocks look like they do in the tool card.
  - No chat-bubble background.
- **Unchanged:** behaviour (collapse, badge logic, link), the server, and the event shape.

## Non-Functional Requirements

- **No magic strings:** labels and fallbacks go in `PEER_CARD_TEXT` in `configs/ui.config.ts`, and the prefix to strip is a named constant there.
- **Same safety rules:** no raw HTML, Markdown + `remarkGfm` + `ExternalLink`, as now.
- **Checks:** `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Modify `apps/web/src/components/atoms/PeerMessageCard.tsx`
- Modify `apps/web/src/configs/ui.config.ts` (`PEER_CARD_TEXT`: labels, detail fallbacks, "Report" heading, `Result: ` prefix)
- Modify `apps/web/src/styles/chat.css`

## Risks & Assumptions

- **The prefix is shared text:** the web removes the `Result: ` prefix that the server adds to task titles. If the server text ever changes, the detail would show the full title, which still reads fine. Sending the bare description from the server would be cleaner, but it would mean changing the event, which is out of scope.
- **History titles:** history task cards that use the summary as their title (for example `Background command "…" completed`) show it as the grey detail, truncated.
- **Testing:** the project is `Skip-Testing`, so the plan has no tester task. After review, I suggest a short `/web-test` visual check: one history session and one live run.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Add the labels, detail fallbacks, the "Report" heading text and the `Result: ` prefix constant to `PEER_CARD_TEXT`. Rebuild the `PeerMessageCard` header like `SubagentCard`, and the body as an `h6` heading plus a `.peer-card__body` markdown container, with no bubble. | developer | none | Matches the header and body requirements. Typecheck passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | `chat.css`: add `.peer-card` to the max-width rule, add `.peer-card summary` to the cursor rule, add `.peer-card__body` to the `.message--assistant` table, cell and `pre` selectors, and remove the `.peer-card table` rule. | developer | 1 | The CSS uses no new colours, only the existing Bootstrap variables. Lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
