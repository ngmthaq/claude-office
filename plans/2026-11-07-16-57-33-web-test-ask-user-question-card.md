# Title: Web Test Plan — AskUserQuestion card

- Classification: feature
- Description: Check that the new AskUserQuestion card works in the chat panel, and that Claude gets the answers.
- Target URL: http://127.0.0.1:4317
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop 1440x900

---

## Goal

- Prove that when Claude calls `AskUserQuestion`, the chat shows the new card (not the plain permission card).
- Prove that Submit only turns on when every question has an answer, that "Other" works, and that Skip works.
- Prove that Claude gets the submitted answers, and the card shows a read-only view after.

## Scope

- In scope: chat panel in one new room; `apps/web/src/components/molecules/AskUserQuestionCard.tsx`; the answer flow through `permission.service.ts`.
- Out of scope: ExitPlanMode, other tools' permission cards, mobile, reload/history replay (known gap: answers are not shown after reload).

## Preconditions

- Port 4317 is free. I run `pnpm prod` (it rebuilds with the new code) and wait for "Server listening".
- I start a new session in the `claude-office` repo folder from the app.

## Risks & Assumptions

- Each prompt uses some tokens. Prompts tell Claude to use only `AskUserQuestion` and no other tools, so no files change.
- Assumption: Claude follows the prompt and calls the tool. If it does not, the related cases are `Blocked`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Card shows questions and options | high | New room open | 1. Send Prompt A in the chat input. 2. Wait for the card. | Prompt A: "Use the AskUserQuestion tool to ask me two questions: (1) single-select, header 'Color', options Red / Blue; (2) multi-select, header 'Fruits', options Apple / Banana / Cherry. Use no other tools." | Card "Claude has questions for you" shows 2 questions, header chips "Color" and "Fruits", radios for Q1, checkboxes for Q2, option descriptions, an "Other" choice with text box on each, Skip and Submit buttons |
| TC-02 | PASS | Submit is off until every question has an answer | high | TC-01 | 1. Check Submit. 2. Pick "Blue" in Q1. 3. Check Submit. | none | Submit is disabled at step 1 and still disabled at step 3 (Q2 has no answer) |
| TC-03 | PASS | "Other" needs text | high | TC-02 | 1. In Q2 tick "Apple" and "Banana". 2. Tick "Other" in Q2 with empty text. 3. Check Submit. 4. Type text in the Q2 Other box. 5. Check Submit. | Other text: "Mango" | Submit disabled at step 3, enabled at step 5 |
| TC-04 | PASS | Submit sends answers; read-only view | high | TC-03 | 1. Click **Submit**. 2. Wait for Claude's reply. | none | Card shows a green allowed badge and the answers "Blue" and "Apple, Banana, Mango". Inputs are gone. Claude's reply names Blue and Apple, Banana, Mango |
| TC-05 | PASS | Skip | high | TC-04 done | 1. Send Prompt B. 2. Wait for the card. 3. Click **Skip**. 4. Wait for Claude's reply. | Prompt B: "Use the AskUserQuestion tool once more to ask one single-select question, header 'Size', options Small / Large. Use no other tools." | Card shows "Skipped" badge. Claude replies and asks in plain chat text (or says it was skipped). No error in the chat |
| TC-06 | PASS | Room shows waiting while the card is open | medium | During TC-01 | 1. While the card is pending, look at the room state in the session list / room. | none | Room shows the waiting state while the card is pending, and goes back to working/idle after Submit |
