# Title: Web Test Report — Live result card title (debug log run)

- Classification: bug
- Description: The server sends the live card about 260ms after the sub-agent finishes, using the transcript text, but the browser drops it, because the web WebSocket client does not pass `peer_message` events to the chat store.
- Target URL: http://127.0.0.1:4317
- Environment: local (production build, `LOG_LEVEL=debug pnpm prod`)
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-06-16-32-51-web-test-live-result-card-title.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 1     | 0    | 1    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-07 | Live result shows a card with the right title | FAIL | The server log shows the card was emitted. The browser showed no card for about 33 seconds after that, until the end of the run. The title could not be checked in the browser. |

## Failures

### TC-07 — Live result shows a card with the right title

- Steps: new session in `claude-code-office`, sent the approved prompt, polled the chat every second, read the server log.
- Expected: a "Result: …" card appears within a few seconds of the `task result card emitted` log line.
- Actual:
  - Server log (UTC):
    - `09:33:57.468 subagent started`
    - `09:34:11.076 subagent finished`
    - `09:34:11.336 task result card emitted {readMs: 258, usedTranscript: true, taskId: a0c50de27e63e2177}`
  - Browser: the sub-agent card showed "done" at `09:34:12.146Z`. At `09:34:44.390Z` there was still no `details.peer-card` (count 0, `cardAt` null).
- Root cause (found by reading the code, not changed):
  - `apps/web/src/services/ws-client.service.ts:106-121` passes live room events to `useChatStore.getState().applyEvent(event)` only for a fixed list of types: `user_message` … `subagent_finished`.
  - `peer_message` is not in that list, so every live result card is dropped on the client.
  - Cards only show when the room's history is sent again (`session_history` → `replaceHistory`, which runs `applyRoomEvent` on the server's event buffer). That explains the earlier "late card" observation: it appeared after switching views.
  - The same gap affects live `<agent-message>` hand-back cards.
- Evidence: the server log lines above, the browser poll result, and the file and line above.

## Blocked / Skipped

- None.

## Console and Network Problems

- None seen.

## Next Steps

- To fix the FAIL case, run `/party-mode` and give it this report file: `plans/2026-11-06-16-32-51-web-test-live-result-card-title-report.md`.
  - Fix: add `case 'peer_message':` to the `applyEvent` group in `apps/web/src/services/ws-client.service.ts`.
  - Then re-run TC-07 to check the title "Result: <description>" in the browser.
- The server side looks right. The card is sent about 260ms after the sub-agent finishes, using the transcript text (`usedTranscript: true`).
