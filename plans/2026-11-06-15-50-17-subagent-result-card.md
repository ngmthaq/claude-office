# Title: Plan — Sub-agent result card

- Classification: feature
- Description: Map peer messages (sub-agent hand-backs and messages from other sessions) to a new `peer_message` event. Show them in a collapsible card with a parsed status badge, a rendered markdown body, no harness boilerplate, and a link to the sub-agent when it is known.

---

## Approach Summary / Goal

- **Server, live:** `mapUser` drops string-content user messages today. When such a message has `origin.kind === 'peer'`, emit a new shared `peer_message` event. It carries `origin.body` as the report and `origin.name` as the sender name. It also carries `subagentId`, found by matching `origin.senderTaskId` with the existing `findSubagentId` lookup, or `null`.
- **Server, history:** the SDK history API has no `origin`. So a new server util recognises the text envelope (`Another Claude session sent a message:` + `<agent-message from="…">…</agent-message>`). It takes the inner text, removes the `[Subagent hand-back] … The report follows:` preamble and any `[harness: …]` line, and removes the 2-space indent. `history.repository.ts` emits `peer_message` (`subagentId: null`) instead of a `user_message` bubble.
- **Web:** a new `peer` chat item and a `PeerMessageCard` atom, built from the `ToolCard` collapsible pattern and the `SubagentDetails` markdown setup. A small util reads the report's status (complete / incomplete / blocked) for the badge.
- **Goal:** hand-backs and peer messages show as a tidy, collapsed card, both live and in resumed sessions, instead of being dropped (live) or shown as a raw user bubble (history).

## Functional Requirements

- **Live hand-back:** a card appears in the chat at the point where the hand-back arrives.
  - It is collapsed by default.
  - The header shows a robot icon, the title "Result from `<name>`", and a status badge.
  - Expanding the card shows the report as markdown with GFM tables.
- **Status badge:** it shows `complete` / `incomplete` / `blocked`, read from the report. It matches lines like `Status: complete`, `— Status: complete` and `- [x] complete`. If no status is found, it shows a neutral `report` badge.
- **Sub-agent link:** when `subagentId` matches a tracked sub-agent, the card shows an "Open sub-agent" link, which opens the existing details panel.
- **Other peer messages:** a peer message from another session (not a sub-agent) uses the same card. Its title is "Message from `<name>`" (or "Message from another session" when there is no name). It has no badge and no link.
- **History:** in a resumed session, the same envelope shows as the card with the boilerplate removed. The title falls back to "Sub-agent result" or "Message from another session", and there is no link.
- **Unchanged:** user, assistant, tool and sub-agent rendering all work the same as before.

## Non-Functional Requirements

- Never render the report as raw HTML. Use `react-markdown` defaults (no `rehype-raw`), with `ExternalLink` for links.
- The parsing helpers are pure functions in `utils/`, with no magic strings in components. Status colours go in `configs/ui.config.ts`.
- One shared event per file. Register it in `room-event.ts`, `server-event.ts` and `index.ts`.
- `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Create `packages/shared/src/events/peer-message.ts`: `{type:'peer_message', roomId, messageId, senderName: string|null, subagentId: string|null, isHandback: boolean, body: string, time}`
- Modify `packages/shared/src/events/room-event.ts`, `server-event.ts`, `index.ts`
- Create `apps/server/src/utils/peer-message.util.ts`: envelope detection and body extraction (history)
- Modify `apps/server/src/services/sdk-event-mapper.service.ts`: `mapUser` handles `origin.kind === 'peer'`
- Modify `apps/server/src/repositories/history.repository.ts`: `pushUserText` emits `peer_message` for the envelope
- Modify `apps/web/src/dtos/chat-item.dto.ts`: new `peer` item
- Modify `apps/web/src/hooks/store/useChatStore.ts`: handle `peer_message`
- Create `apps/web/src/utils/report-status.util.ts`: status parsing
- Modify `apps/web/src/configs/ui.config.ts`: `REPORT_STATUS_BG` and the card titles
- Create `apps/web/src/components/atoms/PeerMessageCard.tsx`
- Modify `apps/web/src/components/organisms/MessageList.tsx`: render the `peer` item and wire "Open sub-agent" to `useSubagentDetailsStore`

## Risks & Assumptions

- Assumption: live `SDKUserMessage.origin` carries `body` for in-process sub-agent hand-backs. The SDK types say it does, and the session JSONL agrees. If `body` is missing, fall back to the same text extraction that history uses.
- Assumption: `subagentId` (the tool_use id) found through `senderTaskId` is the same id the web uses for `SubagentItem.id`. The research says it is.
- Risk: the history envelope format belongs to the harness and may change. If detection fails, the message falls back to today's raw user bubble, so nothing is lost.
- Risk: status parsing is a heuristic, so reports in other formats show the neutral `report` badge.
- Testing workflow is `Skip-Testing`, so there is no tester task. The developer checks the work by hand, including running the history util on a real JSONL hand-back from `~/.claude/projects/-Users-nmthang6-Documents-Repositories-self-claude-code-office/`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Shared event `peer-message.ts` (schema above), registered in `room-event.ts`, `server-event.ts` and `index.ts`. | developer | none | Typecheck passes, and the event parses with `parseServerEvent`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | Server live mapping: in `mapUser`, for string content with `origin.kind === 'peer'`, emit `peer_message`. Use `origin.body`, falling back to the util from task 3. Set `senderName` from `origin.name ?? null`, `subagentId` from `findSubagentId(origin.senderTaskId)` or null, and `isHandback` from `!!origin.senderTaskId`. Other string user messages keep today's behaviour. | developer | task 1, 3 | A live hand-back emits one `peer_message` with the matched `subagentId`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | `apps/server/src/utils/peer-message.util.ts`: `parsePeerEnvelope(text)` returns `{from, body, isHandback} \| null`. It removes the preamble up to and including `The report follows:`, removes `[harness: …]` lines, removes the 2-space indent, and ignores text after `</agent-message>`. Use it in `history.repository.ts` `pushUserText`. | developer | task 1 | On a real JSONL hand-back, the body starts with the report's first line and has no boilerplate. Non-envelope text still becomes `user_message`. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
| 4   | TODO   | Web: add the `peer` item to `chat-item.dto.ts`, handle the event in `useChatStore.ts`, add `report-status.util.ts`, and add `REPORT_STATUS_BG` plus the titles in `ui.config.ts`. | developer | task 1 | The store adds a `peer` item for each event. The util returns complete / incomplete / blocked / null for the sample formats. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | TODO   | Web: `PeerMessageCard.tsx` (react-bootstrap `Card as="details"`, collapsed, robot icon + title + badge in `<summary>`, Markdown + remarkGfm + ExternalLink body, "Open sub-agent" link when `subagentId` matches a tracked sub-agent). Render it from `MessageList.tsx`. | developer | task 4 | Meets the Functional Requirements. `pnpm typecheck`, `pnpm lint` and `pnpm build` pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
