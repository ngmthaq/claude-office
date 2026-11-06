# Title: Web Test Plan — Sub-agent result card

- Classification: feature
- Description: Check that sub-agent hand-backs show as a clean, collapsed `PeerMessageCard` in the production build, both in resumed (history) sessions and live.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `pnpm prod`)
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop only (current browser window)

---

## Goal

- Prove that hand-back messages render as a `PeerMessageCard`, not a raw user bubble, when an existing session is opened from history.
- Prove that the card starts collapsed, has the right title and status badge, renders the report as markdown (including tables), and has no harness boilerplate.
- Prove that a live hand-back shows the card with a working "Open sub-agent" link that opens the details panel.
- Prove that normal user, assistant, tool and sub-agent items still look as before.

## Scope

- In scope: the chat panel (`MessageList`), `PeerMessageCard`, the History dialog (to open an old session), the sub-agent details panel (link target).
- Out of scope: the office canvas, the permission UI, mobile layout, peer messages from other sessions (I can't produce one safely here), and the live-link edge case where the "finished" event comes before the hand-back.

## Preconditions

- You have stopped your dev server on port 4317.
- I run `pnpm prod` and wait for "Server listening at http://127.0.0.1:4317".
- At least one session in this project has hand-backs. The developer found 46, for example in session `0acd9df5-…`.

## Risks & Assumptions

- The live test starts one new Claude session in the app, in this repo folder. It sends one prompt asking for a small **read-only** background sub-agent ("list the files in packages/shared/src/events and report the count"). It uses some tokens and changes no files. If the app asks to approve a tool, I will allow only read-only tools.
- Resuming a history session may show its full old chat. I won't send messages in it.
- I assume the History dialog lists sessions for this project folder. If I can't find one with a hand-back, TC-01 to TC-05 become `Blocked`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | History hand-back shows as a card, not a raw bubble | high | App open at target URL | 1. Open the **History** dialog. 2. Pick a session from this project that has a hand-back. 3. Open it and scroll to a hand-back. | session with a hand-back (e.g. `0acd9df5-…`) | A card with a robot icon and the title "Sub-agent result". No user bubble with `<agent-message` or "Another Claude session sent a message" text. |
| TC-02 | PASS | Card is collapsed by default | high | TC-01 | 1. Look at the card without clicking. | none | Only the summary row (icon, title, badge) shows. The report body is hidden. |
| TC-03 | FAIL | Status badge matches the report | high | TC-01 | 1. Read the badge. 2. Expand the card and find the report's status line. | none | The badge text (complete / incomplete / blocked, or "report") matches the status in the report. Complete is green. |
| TC-04 | PASS | Report renders as markdown, boilerplate removed | high | TC-01 | 1. Click the card summary to expand it. | none | Headings and tables render as HTML (real table, not pipe text). No "[Subagent hand-back]" paragraph, no `[harness:` line, no "That "other Claude session"…" note, no extra indent. |
| TC-05 | PASS | History card has no "Open sub-agent" link | medium | TC-04 | 1. Look inside the expanded card. | none | No "Open sub-agent" button. |
| TC-06 | PASS | Other chat items still render normally | medium | TC-01 | 1. Scroll the same session. | none | User bubbles, assistant markdown and tool cards look as before. No errors on the page. |
| TC-07 | FAIL | Live hand-back shows a card | high | App open | 1. Start a **new session** in this repo folder. 2. Send: "Use the Agent tool with run_in_background true to start a general-purpose sub-agent that lists the files in packages/shared/src/events and reports how many there are. Do not edit anything." 3. Wait for the sub-agent to finish. | the prompt in step 2 | A sub-agent card appears and finishes. After that, a collapsed card titled "Result from …" (or "Sub-agent result") with a badge appears in the chat. |
| TC-08 | BLOCKED | "Open sub-agent" opens the details panel | high | TC-07 | 1. Expand the live card. 2. Click **Open sub-agent**. | none | The sub-agent details panel opens for that sub-agent. If the link is missing, I mark this `Fail` and note the known order risk. |
| TC-09 | PASS | Browser console has no new errors | low | TC-01–TC-08 done | 1. Read the console messages. | none | No React or WebSocket errors from the new card. |
