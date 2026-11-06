# Title: Plan — Pass live `peer_message` events to the chat store

- Classification: bug
- Description: Add `peer_message` to the web WebSocket client's room-event list, and make that `switch` exhaustive so a new server event type can't be dropped silently.

---

## Approach Summary / Goal

- **Root cause:** `apps/web/src/services/ws-client.service.ts:106-121` passes live room events to `useChatStore.getState().applyEvent` only for a fixed list of types, and `peer_message` was never added. Every live result card and live hand-back card is dropped. They only show when `session_history` replays the server's event buffer. The server side is fine: the card is sent about 260 ms after the sub-agent finishes.
- **Fix:**
  - Add `case 'peer_message':` to that list.
  - Add an exhaustive `default` branch (`const unhandled: never = event`) so TypeScript fails the build if a `ServerEvent` type is not handled.
- **Goal:** the live result card shows in the browser right after the sub-agent finishes, titled "Result: `<description>`".

## Functional Requirements

- A live `peer_message` event adds a card to the chat with no view switch needed. This covers both `task` and `handback` cards.
- A live `task` card also updates the matching sub-agent's Result. That happens in the store already, once the event arrives.
- Every other event type behaves as before.
- Typecheck fails if any `ServerEvent` type is missing from the `switch`.

## Non-Functional Requirements

- `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

## Files in Scope

- Modify `apps/web/src/services/ws-client.service.ts`

## Risks & Assumptions

- **The exhaustive check may find other gaps:** if some `ServerEvent` type that is not a room event is also unhandled, the build will fail. The developer then adds an explicit no-op `case` for it and lists it. No behaviour change.
- **Testing:** the project is `Skip-Testing`, so the plan has no tester task. After review, I'll re-run `/web-test` TC-07 (with `LOG_LEVEL=debug`) to check the live card and its title.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Add `case 'peer_message':` to the `applyEvent` group in `ws-client.service.ts`. | developer | none | A live `peer_message` reaches `useChatStore.applyEvent`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | Add an exhaustive `default: { const unhandled: never = event; … }` to that `switch`. Add no-op cases for any `ServerEvent` types that are still unhandled, and list them. | developer | 1 | `pnpm typecheck`, `pnpm lint` and `pnpm build` pass. Removing the `peer_message` case makes typecheck fail (check once, then restore). | `guides/CLEAN_CODE/ENTRY_POINT.md` |
