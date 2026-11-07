# Title: Plan — AskUserQuestion UI

- Classification: feature
- Description: Show an interactive card in chat for `AskUserQuestion`, and send the user's answers back to Claude through the existing permission flow.

---

## Approach Summary / Goal

- Remove `AskUserQuestion` from `ASK_IN_CHAT_TOOLS`. It then goes through the normal `permission_request` flow, so the pending map, abort cancel, and room "waiting" state work as today.
- `ExitPlanMode` stays in `ASK_IN_CHAT_TOOLS`. No change for it.
- Add an optional `answers` field to the `permission_answer` client event. The server builds the SDK result from it.
- The web `MessageList` shows the new question card when `toolName` is `AskUserQuestion`, and the old `PermissionCard` for other tools.
- Goal: the user can answer Claude's questions inside Claude Office.

## Functional Requirements

- The card shows each question (1–4) with its `header` chip, question text, and options (label + description). If an option has `preview`, show it in a small `<pre>`.
- Single-select questions use radio buttons. Multi-select questions use checkboxes.
- Each question has an extra **Other** choice with a text box. Typed text is the answer.
- **Submit** is on only when every question has an answer (Other needs non-empty text).
- Submit sends `decision: 'allow'` + `answers` (`{ [question text]: answer }`). Multi-select answers are joined with `", "`. The server returns `{ behavior: 'allow', updatedInput: { ...input, answers } }`.
- **Skip** sends `decision: 'deny'`. The server denies with a message telling Claude the user skipped and to ask in plain chat text.
- After the answer, the card shows a read-only result (chosen answers, or "Skipped").
- A second answer for the same request is ignored. Session stop / query end still cancels open cards.

## Non-Functional Requirements

- Security: zod checks `answers` (at most 4 entries, each answer ≤ 5,000 chars). The server checks that every `answers` key is a real question in the pending input, and that every question has an answer. If not, it ignores the answer and logs it. Logs never hold answer text.
- Follow the current layered structure and Bootstrap UI style. Keep accessible labels (`role="group"`, `aria-label`, labelled inputs).

## Files in Scope

- `packages/shared/src/events/permission-answer.ts` — add optional `answers`
- `apps/server/src/configs/sdk.config.ts` — `ASK_IN_CHAT_TOOLS` becomes `['ExitPlanMode']`; add `QUESTION_SKIPPED_MESSAGE`
- `apps/server/src/services/permission.service.ts` — AskUserQuestion result in `answerPermission`
- `apps/server/src/controllers/permission.controller.ts` — pass `answers`
- `apps/web/src/components/molecules/AskUserQuestionCard.tsx` (new)
- `apps/web/src/components/organisms/MessageList.tsx` — pick the card by tool name; send `answers`
- `apps/web/src/dtos/permission-item.dto.ts`, `apps/web/src/hooks/store/useChatStore.ts` — keep the submitted answers for the read-only view
- Web styles file used by `permission-card` (only if needed)

## Risks & Assumptions

- **Assumption:** the input shape matches the SDK type `AskUserQuestionInput` (`questions[].question/header/options/multiSelect`). If the input does not match, the card falls back to the old `PermissionCard` view, so the user can still allow or deny.
- **Risk:** sub-agents rarely call this tool. If they do, the card shows the same "from sub-agent" badge.
- **Out of scope:** ExitPlanMode UI (later task).

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status  | Task                                                                                                                                       | Responsible Role      | Dependencies                                                  | Acceptance Criteria                                                                                                                                                                                                                                         | Skills                                                                                        |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | DONE    | Shared + server: add `answers` to `PermissionAnswerEventSchema`; change `sdk.config.ts`, `permission.service.ts`, `permission.controller.ts` | developer             | none                                                          | AskUserQuestion emits `permission_request`. Allow with good `answers` returns `updatedInput` with `answers`. Bad or missing answers are ignored and logged without text. Skip denies with the skip message. ExitPlanMode is still denied at once. `pnpm typecheck`, `lint`, `build` pass | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`, `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 2   | DONE    | Web: `AskUserQuestionCard`, routing in `MessageList`, store/DTO changes                                                                   | developer             | task 1 contract (runs in parallel; contract fixed in this plan) | Card works as in Functional Requirements. Submit is off until complete. Read-only view after answer. `pnpm typecheck`, `lint`, `build` pass                                                                                                               | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md`                                                    |
| 3   | SKIPPED | Unit tests                                                                                                                                 | tester                | 1, 2                                                          | Testing Workflow is `Skip-Testing`                                                                                                                                                                                                                          | `.claude/agents/party-mode-tester.md#testing-workflow`                                        |
| 4   | DONE    | Browser check with the `web-test` skill after the Root Agent review                                                                        | Root Agent (web-test) | 1, 2                                                          | The card shows, and the answers reach Claude in a real session                                                                                                                                                                                              | `.claude/skills/web-test/SKILL.md`                                                            |
