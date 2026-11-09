# Title: Plan — Attach files to a chat message (no history)

- Classification: feature
- Description: The browser reads and checks files and sends base64 over the WebSocket. The server checks them again and passes them to Claude as content blocks, without saving them.

---

## Approach Summary / Goal

- **Goal:** the user can attach images, PDFs, and text files to a message, and Claude can read them.
- The web app does the file work: picker, paste, drag and drop, chips, resize, and base64.
- The server stays small: it checks the files, builds the blocks, and pushes them to the SDK.
- `user_message` carries only name, kind, and size, so base64 never enters the server's event buffer or goes back to clients.

## Functional Requirements

1. The user can add files by paperclip button, paste, and drag and drop onto the chat panel.
2. Each file shows as a chip with an icon, name, size, and × button, plus a loading state while the browser reads it.
3. Allowed types are PNG, JPEG, GIF, WebP, PDF, and `.txt`, `.md`, `.json`, `.csv`, plus a fixed list of common code and config extensions.
4. A file with another type is not added, and the user sees "Type not supported".
5. Limits are 10 files, image 3.75 MB, PDF 20 MB, text 1 MB, and total 20 MB.
6. The browser scales down an image over the limit. An animated GIF over the limit is rejected.
7. Enter or the send button sends text and files. A message with files and no text is allowed.
8. While Claude is busy or the socket is down, the user can add or remove chips but cannot send.
9. The server checks count, type, decoded size, valid base64, valid UTF-8 for text, and file signature (first bytes) for images and PDFs. It ignores the size the client reports.
10. If the server rejects a file, it sends a `session_error` with code `attachment_rejected`, and the web app restores the text and chips.
11. A sent message shows chips for its files. An empty text message shows no empty bubble.
12. When a session loads from the transcript, text-file blocks do not appear as chat bubbles. Chips are not restored from the transcript.

## Non-Functional Requirements

- **Security:** the server does not trust the web app's checks. It escapes file names in the wrapper tag.
- **Privacy:** logs hold only counts, sizes, and types. They never hold file names, content, or base64.
- **Storage:** files stay in memory, and our app writes nothing to disk.
- **Speed:** files are read asynchronously, so the UI does not block.
- **Rules:** new events and models use Zod schemas in `packages/shared`.

## Files in Scope

| Area | Files |
| --- | --- |
| Shared (new) | `packages/shared/src/models/attachment.ts` |
| Shared (change) | `packages/shared/src/models/index.ts`, `events/session-send.ts`, `events/user-message.ts` |
| Server (new) | `apps/server/src/services/attachment.service.ts` |
| Server (change) | `services/session.service.ts`, `controllers/session.controller.ts`, `repositories/history.repository.ts`, `configs/limits.config.ts`, `main.ts` |
| Web (new) | `utils/attachment.util.ts`, `hooks/feature/useChatAttachments.ts`, `components/atoms/AttachmentChip.tsx`, `components/molecules/AttachmentList.tsx` |
| Web (change) | `components/organisms/ChatInput.tsx`, `ChatPanel.tsx`, `MessageList.tsx`, `hooks/store/useChatStore.ts`, `dtos/chat-item.dto.ts`, `configs/ui.config.ts`, `styles/chat-input.css`, `styles/chat.css` |

## Risks & Assumptions

- **Assumption:** the API limits (5 MB image, 32 MB request) come from memory. Task 1 tests that the SDK accepts these blocks, and I will come back to you if the limits need to change.
- **Risk:** Task 1 uses a small amount of your Claude usage.
- **Risk:** a file the API refuses (for example, a PDF with too many pages) may stay in the transcript and break later turns. The server checks lower this risk but cannot remove it.
- **Limit:** chips stay on messages only until the server restarts. A message with only files disappears when a session loads from the transcript. Claude still has the files.
- **Limit:** paste needs the text box to be enabled, because a disabled box cannot take focus. While Claude is busy, the paperclip and drag and drop still work.
- **Limit:** a text file that contains the wrapper's closing tag can confuse the block boundary. The impact is low, because these are the user's own files.
- **Testing:** the project uses Skip-Testing, so there are no automated tests and no tester tasks.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: none

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Run a throwaway script outside the repo that pushes `text`, `image`, and `document` blocks through the SDK | developer | none | Claude describes each file's content, and the result is reported. No repo files change | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Add the attachment model and limits in shared, add `attachments` to `session_send`, add display info to `user_message`, and allow empty text only with files | developer | task 1 | Schema rejects no text and no files, and rejects more than 10 files. `pnpm typecheck` passes | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3 | DONE | Create `AttachmentService` for the checks in requirement 9 and for building blocks. Text uses a wrapper tag whose prefix constant lives in `limits.config.ts` | developer | task 2 | Bad data, type, or size each return a rejection with a clear message. Valid files produce the right blocks | `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 4 | DONE | Change `send()` and the controller to push array content, emit `attachment_rejected`, add the wrapper to `wrapperPrefixes`, and set `maxPayload` to 30 MB in `main.ts` | developer | task 3 | Text-only send still works. No base64 in events or logs. A rejected send does not set busy | `.claude/guides/SECURITY_SCANNER/ENTRY_POINT.md` |
| 5 | DONE | Create `attachment.util.ts` (type, size format, base64, resize) and `useChatAttachments`, and add the allowed extensions to `ui.config.ts` | developer | task 2 | Limits are enforced before send. Big images come out under the limit. The list and loading state update correctly | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 6 | DONE | Create `AttachmentChip` and `AttachmentList`, then connect picker, paste, drop, send, and restore on rejection in `ChatInput` and `ChatPanel` | developer | task 5 | All three ways of adding files work. Plain text paste still works. Chips do not carry over to another room | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 7 | DONE | Show chips on user messages through `chat-item.dto.ts`, `useChatStore`, and `MessageList`, and add styles | developer | tasks 2, 6 | Sent files show as chips. A files-only message has no empty bubble. `pnpm typecheck` and `pnpm lint` pass | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
