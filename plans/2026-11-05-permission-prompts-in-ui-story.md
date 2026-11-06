# S5 — Permission prompts in the UI

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 5
- **Depends On:** S3 ([doc](./2026-11-05-start-session-and-chat-story.md)), S4 ([doc](./2026-11-05-office-map-rooms-root-agents-story.md))

## User Story

As the developer, I want to Allow or Deny tool use in the UI so that Claude can keep working safely without the terminal.

## Goal

**Problem:** Claude asks for my OK before some tools, like file edits or commands. In the browser there is no terminal prompt. So Claude either gets stuck, or it must run with no checks.

**Solution:** The server holds each permission request and sends it to the browser. The chat shows a card with Allow and Deny buttons. The root agent shows a bubble, so I see the waiting session from the map.

**Impact:** Claude stays safe, and I can find a waiting session fast.

## Requirements

### Functional Requirements

- The chat shows each permission request with the tool name, its input, and Allow and Deny buttons.
- The root agent shows a bubble while a request waits, both on the map and in the room.
- Allow lets the tool run. Deny tells Claude no, and Claude goes on.
- Pending requests show again after a page reload.

### Non-Functional Requirements

- **Security:** a request is only answered by a clear click. There is no auto-allow in this story.
- **Reliability:** a request is never lost while the server runs.

## Acceptance Criteria

- [ ] Given Claude wants a tool that needs my OK, when it asks, then the chat shows a card with the tool name, its input, and Allow and Deny buttons.
- [ ] Given that request, when I look at the office, then the root agent shows a bubble, both on the map and in the room.
- [ ] Given I click Allow, then the tool runs and Claude goes on.
- [ ] Given I click Deny, then Claude is told no and goes on without the tool.
- [ ] Given I reload the page while a request waits, when the app reconnects, then the request shows again.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S5.1 | [BE] Permission handler: keep pending requests per session and wait for the answer over WebSocket | Allow and Deny both reach the SDK correctly | — |
| S5.2 | [BE] Send pending requests again when the browser reconnects | A reload shows the waiting request | S5.1 |
| S5.3 | [FE] Permission card in the chat with the tool name, an input preview, and Allow and Deny | Clicking a button sends the answer and locks the card | S5.1 |
| S5.4 | [FE] Waiting bubble over the root agent, in the room and on the map | The bubble shows while a request waits and hides after the answer | S5.1, S4.3 |
| S5.5 | [QA] Check the S5 criteria by hand | Every criterion above passes | S5.2–S5.4 |

## Estimate

- **Points:** 5
- **Reason:** Medium effort, complexity, and uncertainty. The server must hold a request and wait for the browser. It must also come back after a reload.

## Out of Scope

- "Always allow" rules or saved permission lists.
- Desktop or sound alerts (deferred).
- Permission prompts from sub-agents shown on the sub-agent character.
