# Title: Plan — Fix the squeezed prompt box in sub-agent details

- Classification: bug
- Description: Stop direct children of the scrolling panel bodies from shrinking, so the prompt box shows at its normal height and the body scrolls instead.

## Approach Summary / Goal

- Root cause: `.subagent-details__body` is a flex column with `overflow-y: auto`. Its children have the default `flex-shrink: 1`. The prompt `<pre>` has `overflow: auto`, so its minimum height is 0 and it shrinks to one line when there are many tool calls.
- Fix: add `.subagent-details__body > *, .mcp-panel__body > * { flex-shrink: 0; }` in `apps/web/src/styles.css`. The prompt keeps its `max-height: 12rem` and scrolls inside itself. The body scrolls as a whole.
- Checked other classes: only the prompt `<pre>` is a direct child that can shrink today. The rule on `.mcp-panel__body` prevents the same bug later.

## Files in Scope

- `apps/web/src/styles.css`

## Risks & Assumptions

- `12rem` is tall enough.
- No regression test (`Skip-Testing`). The fix is checked in the browser by web-test case TC-06.

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Add `.subagent-details__body > *, .mcp-panel__body > * { flex-shrink: 0; }` | developer | none | With many tool calls, the prompt box shows up to 12rem tall, and the body scrolls. `pnpm lint` passes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
