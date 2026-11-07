# Title: Plan — AskUserQuestion stepper card

- Classification: feature
- Description: Turn the question card into a one-question-per-step form, put the "Other" text box below its choice, and move the schema and helper out of the component.

---

## Approach Summary / Goal

- Move the Zod schema, the `Question` type, and the parser to `apps/web/src/dtos/ask-user-question.dto.ts`. Move `buildAnswer` to `apps/web/src/utils/ask-user-question.util.ts`. This follows `CODING_CONVENTIONS.md`.
- Rewrite `AskUserQuestionCard` as a stepper: one question per step, step chips on top, and Back / Next / Submit buttons at the bottom.
- The "Other" text box goes full width on its own line below the "Other" choice. It shows only when "Other" is ticked.
- There is no server or shared change. The answer contract stays the same.

## Functional Requirements

- **Step chips:** each chip shows the step number and the question `header`. The current chip is highlighted. A chip for an answered step shows a ✓. You can click the chip of a step you already visited to jump back to it.
- **One question per step:** the step shows its question text, options (with description and `preview`), and "Other".
- **Next** is off until the current question has an answer. On the last step, Next becomes **Submit**. Submit stays off until every question has an answer. **Back** is hidden on step 1.
- **Skip** is always shown on the left. It skips the whole card, the same as today.
- Picking a single-select option does **not** move to the next step by itself.
- **Other:** the text box shows below "Other" (full width) only when Other is ticked. It gets focus when it opens. Answers keep the 5,000-char limit. Unticking Other hides the box, and its text does not count as an answer.
- **One question:** no step chips and no Back or Next. Only Skip and Submit.
- Answers stay saved when you move between steps.
- **Read-only view** after Submit or Skip: no stepper. It lists every question with its answer (as now), or shows "Skipped" or "Cancelled".
- All controls are off while the status is `sending`.

## Non-Functional Requirements

- The component holds only UI and state. It has no Zod schema and no answer-building logic.
- `AskUserQuestionUtil` is a class with static methods, like the other web utils.
- Accessibility: the step chips are buttons with `aria-current="step"` on the current one. Inputs keep their labels. Ids stay unique per request, question, and option.
- Use react-bootstrap. Add no new libraries.

## Files in Scope

- Create: `apps/web/src/dtos/ask-user-question.dto.ts`
- Create: `apps/web/src/utils/ask-user-question.util.ts`
- Modify: `apps/web/src/components/molecules/AskUserQuestionCard.tsx`
- Modify: `apps/web/src/components/organisms/MessageList.tsx` (import the parser from the DTO)
- Modify: the web stylesheet (only if the step chips need a small style)

## Risks & Assumptions

- **Assumption:** clicking a chip only goes to steps already visited, so the user cannot skip ahead past an unanswered question.
- **Assumption:** Skip still means "skip all questions". There is no skip for one question.
- The answer format sent to the server does not change, so the server needs no new test.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status  | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------- | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE    | Move the schema, type, and parser to `dtos/ask-user-question.dto.ts`, and `buildAnswer` to `utils/ask-user-question.util.ts` (`AskUserQuestionUtil`). Update the imports in `MessageList` | developer | none | The component file has no `z.` code and no `buildAnswer`. The DTO follows the "one file per DTO" rule. `pnpm typecheck`, `lint`, `build` pass | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/references/CODING_CONVENTIONS.md` |
| 2   | DONE    | Rewrite `AskUserQuestionCard` as the stepper, with the Other box below, as in Functional Requirements | developer | task 1 (same developer, in order) | Every Functional Requirement is met. `pnpm typecheck`, `lint`, `build` pass | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | SKIPPED | Unit tests | tester | 1, 2 | Testing Workflow is `Skip-Testing` | `.claude/agents/party-mode-tester.md#testing-workflow` |
