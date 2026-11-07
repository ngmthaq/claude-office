# Title: Web Test Plan — AskUserQuestion stepper card

- Classification: feature
- Description: Check the new stepper question card, the "Other" box below its choice, and the one-question layout.
- Target URL: http://127.0.0.1:4317
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop 1440x900

---

## Goal

- Prove the card shows one question per step, with step chips, Back / Next / Submit, and the right on/off states.
- Prove the "Other" text box shows below "Other" only when it is ticked.
- Prove answers stay when moving between steps and reach Claude. Prove the one-question card has no stepper.

## Scope

- In scope: `AskUserQuestionCard` in the chat panel of one new room.
- Out of scope: server answer checks (unchanged), Skip (unchanged and passed last run), ExitPlanMode, mobile.

## Preconditions

- Port 4317 is free (checked). I run `pnpm prod` and wait for "Server listening".
- I start a new session in the `claude-office` folder.

## Risks & Assumptions

- Each prompt uses some tokens. Prompts say "use no other tools", so no files change.
- If Claude does not call the tool, the related cases are `Blocked`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Stepper shows step 1 | high | New room | 1. Send Prompt A. 2. Wait for the card. | Prompt A: "Use the AskUserQuestion tool to ask me two questions: (1) single-select, header 'Color', options Red / Blue; (2) multi-select, header 'Fruits', options Apple / Banana / Cherry. Use no other tools." | Chips "1. Color" (current, `aria-current="step"`) and "2. Fruits" (disabled). Only the Color question shows. Skip on the left; Next on the right; no Back; no Submit |
| TC-02 | PASS | Next is off until answered; no auto-advance | high | TC-01 | 1. Check Next. 2. Pick **Blue**. 3. Check Next and the current step. | none | Next disabled at step 1. After Blue: still on Color step, Next enabled, Color chip shows ✓ |
| TC-03 | PASS | Other box below, only when ticked | high | TC-02 | 1. Check the Other text box is not shown. 2. Tick **Other**. 3. Check the box. 4. Pick **Blue** again. | none | Step 1: no Other text box. Step 3: a text box shows under "Other" (below it, not beside it) and has focus; Next disabled (empty text). Step 4: box hidden, Next enabled |
| TC-04 | PASS | Move to step 2; Back keeps answers | high | TC-03 | 1. Click **Next**. 2. Check the buttons. 3. Click **Back**. 4. Check the Color answer. 5. Click **Next**. | none | Step 2: Fruits question shows, Back shows, Submit (disabled) replaces Next. After Back: Blue is still picked. Next goes back to Fruits |
| TC-05 | PASS | Submit with multi-select + Other | high | TC-04 | 1. Tick **Apple**. 2. Tick **Other**, type text. 3. Click **Submit**. 4. Wait for the reply. | Other text: "Mango" | Submit enabled after step 2. Card becomes read-only with all questions listed: "Blue" and "Apple, Mango", "Allowed" badge. Claude's reply names Blue and Apple, Mango |
| TC-06 | PASS | One question: no stepper | medium | TC-05 done | 1. Send Prompt B. 2. Wait for the card. 3. Check the layout. 4. Pick **Large**, click **Submit**. | Prompt B: "Use the AskUserQuestion tool once more to ask one single-select question, header 'Size', options Small / Large. Use no other tools." | No chips, no Back / Next. "Size" badge, Skip and Submit only. After Submit: "Allowed" and "Large". Claude's reply names Large |
