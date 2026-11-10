# Title: Plan — Keep the chat draft and question answers for each room

- Classification: feature
- Description: Move the unsent text, attachments, and half-finished question answers into one Zustand store with an entry for each room.

---

## Approach Summary / Goal

- The goal is that a user can switch rooms and come back to the same text, files, and question answers.
- Today this data is local to `ChatInput`, `useChatAttachments`, and `AskUserQuestionCard`, so it is lost when the room changes.
- A new in-memory store holds it by room ID. Nothing is saved to browser storage.
- The "send finished" check moves from `ChatInput` to `ws-client.service.ts`. `ChatInput` is not on screen while the user is in another room, so it can miss the server's reply.

## Functional Requirements

- A room shows its own text and files after the user switches away and back.
- A room's text and files never show in another room.
- A question card shows the same selections, "Other" text, and step after the user switches rooms and back.
- A file that is still being read when the user switches rooms finishes in the correct room.
- When the server accepts a message, the room's text and files are cleared. This also works if the user is in another room at that time.
- When the server rejects a message, the text and files stay.
- When the user clears the text by hand, the old text does not come back.
- When Claude's question is answered or skipped, its saved answers are removed.
- When a room leaves the room list (archive or delete), all its saved data is removed.
- A page reload or restart clears all drafts. There is no expiry.

## Non-Functional Requirements

- No server or shared package changes.
- `AskUserQuestionCard` stays a pure molecule. It gets its data through props from `MessageList`.
- The code follows `CODING_CONVENTIONS.md`.
- There are no automated tests, because the project uses Skip-Testing.

## Files in Scope

- Create `apps/web/src/hooks/store/useChatDraftStore.ts`
- Create `apps/web/src/dtos/question-progress.dto.ts`
- Change `apps/web/src/hooks/feature/useChatAttachments.ts`
- Change `apps/web/src/components/organisms/ChatInput.tsx`
- Change `apps/web/src/components/molecules/AskUserQuestionCard.tsx`
- Change `apps/web/src/components/organisms/MessageList.tsx`
- Change `apps/web/src/services/ws-client.service.ts`

## Risks & Assumptions

- **Behaviour change:** a text-only message now stays in the box until the server accepts it, as the issue asks. Today the box clears at once. The box is locked during that short wait, and the same wait already exists for messages with files.
- **Changes to the issue:** your answers remove user story 3 and the reload acceptance check. A restored archived room has an empty chat box.
- **Assumption:** a question keeps the same request ID when the room's history loads again. If it does not, that card starts empty.
- **Memory:** attachment data for each room stays in memory until it is sent, the room is removed, or the page reloads.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Create `question-progress.dto.ts` (selections, step, last visited step). Create `useChatDraftStore` with text, attachments, sending flag, and question progress for each room, plus actions to change, clear, and drop rooms. | developer | none | Store and DTO compile. Each action changes only the given room. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Change `useChatAttachments` to use the store for attachments and the sending flag, with the same return shape. Make attachment IDs unique across remounts. | developer | 1 | Files stay per room. A file still being read finishes in its own room. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | Change `ChatInput` to read and write text in the store. Send text-only and file messages through the same path. Remove `baselineRef` and the outcome effect. Keep the disconnect and timeout handling. | developer | 1, 2 | Text stays per room. Clearing by hand stays cleared. A failed send keeps the text. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4 | DONE | Change `AskUserQuestionCard` to take progress and a change callback as props. Wire them to the store in `MessageList`. | developer | 1 | Selections, "Other" text, and step come back after a room switch. The card has no store import. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5 | DONE | In `ws-client.service.ts`: `user_message` clears a room that is sending; `session_error` stops sending and keeps the draft; `permission_resolved` removes that question's progress; `sessions` drops rooms no longer in the list. | developer | 1 | A send finished while in another room clears the draft. Archive and delete remove the room's data. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
