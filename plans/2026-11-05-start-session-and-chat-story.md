# S3 — Start a session and chat

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 8
- **Depends On:** S1 ([doc](./2026-11-05-spike-check-agent-sdk-story.md)), S2 ([doc](./2026-11-05-app-foundation-story.md))

## User Story

As the developer, I want to start a session in a project folder and chat with the root agent so that I can do my work from the browser.

## Goal

**Problem:** Today each Claude session lives in its own terminal. To use the office, I must first be able to start a session and talk to Claude from the browser. This is the main chat of the app.

**Solution:** The server starts sessions with the Agent SDK in a folder I pick. It streams Claude's text, tool calls, and results to the browser as typed events. The web app shows a session list and a chat panel.

**Impact:** I can do real work with Claude from the browser. This is the base for the office view in S4.

## Requirements

### Functional Requirements

- Pick a project folder from a folder picker and start a new session there.
- A session list shows all sessions that are open in the app.
- The chat panel streams Claude's replies and renders Markdown.
- Tool calls show as cards with the tool name and input. The card shows the result when the tool ends. Cards can open and close.
- Many sessions can run at the same time. Each chat shows only its own messages.
- Errors show in the chat. The server keeps running.
- Each session is saved in the `rooms` table.
- If Claude is not logged in on this device, the chat shows a clear message with how to log in. The SDK brings its own Claude Code, so a missing `claude` CLI is not an error by itself.

### Non-Functional Requirements

- **Security:** only the server talks to the Agent SDK. The folder API checks the path, and it only lists folders.
- **Privacy:** never log the content of prompts or API keys.
- **Security:** the `/ws` route only accepts connections whose `Origin` header is the app's own address (`http://127.0.0.1:5173` in dev, or the server's own address). Binding to `127.0.0.1` stops other devices, but not other websites open in the same browser.
- **Security:** the app never asks for, saves, or sends an API key. Login stays with Claude Code (`claude` login or the `ANTHROPIC_API_KEY` env var).
- **Performance:** text streams into the chat with no visible delay.

## Acceptance Criteria

- [ ] Given the app is open, when I pick a project folder and click Start, then a new session shows in the list and its chat opens.
- [ ] Given an open session, when I send a message, then Claude's reply streams into the chat.
- [ ] Given Claude uses a tool, when the call happens, then the chat shows a card with the tool name and input. When the tool ends, the card shows the result. The card can open and close.
- [ ] Given two sessions, when both work at the same time, then each chat shows only its own messages.
- [ ] Given Claude or the SDK fails, when the error happens, then the chat shows the error and the server keeps running.
- [ ] Given a folder that does not exist, when I try to start, then the app shows an error and starts nothing.
- [ ] Given another website is open in my browser, when it tries to open a WebSocket to the server, then the server rejects it before any event is sent, and logs the rejected origin.
- [ ] Given Claude is not logged in on this device, when I start a session or send a message, then the chat shows a "not logged in" message with the login steps, and the server keeps running.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S3.1 | [DB] Add a `rooms` table (session ID, project folder, created date) | The migration runs. Rows survive a server restart | — |
| S3.2 | [BE] Session manager in `apps/server/src/sessions`: start a session in a folder, send messages, and keep open sessions in memory | Two sessions run at the same time without mixing | S3.1 |
| S3.3 | [BE] Turn the SDK stream into shared events (text, tool call, tool result, done, error) and send them over WebSocket | The browser gets typed events for one full turn | S3.2 |
| S3.4 | [BE] Folder API: list subfolders so the browser can pick a project folder, and check that the folder exists | It returns subfolders and rejects bad paths | — |
| S3.5 | [FE] Session list and a "New session" dialog with the folder picker in `features/sessions` | A new session starts from the dialog and shows in the list | S3.2, S3.4 |
| S3.6 | [FE] Chat panel in `features/chat`: streaming text, Markdown, tool cards, and an input box | A full turn with tool calls shows correctly | S3.3 |
| S3.7 | [BE] Detect login errors: map the SDK's `authentication_failed` (and related account errors) to a typed `auth_error` event. First confirm the real message order with a login-free run (not tested in S1) | A run with no login sends `auth_error`, not a generic error | S3.3 |
| S3.8 | [FE] Show the `auth_error` event in the chat as a "not logged in" message with the login steps: install the `claude` CLI and log in, or set `ANTHROPIC_API_KEY` | The message shows and the session can be tried again after login | S3.6, S3.7 |
| S3.9 | [BE] Check the `Origin` header on `/ws` in `apps/server/src/ws`: allow only a fixed list of the app's own origins (a constant in `config.ts`, not from env). Reject a missing or wrong origin | A connection with a wrong or missing origin is refused. The app's own page still connects | — |
| S3.10 | [QA] Check the S3 criteria by hand | Every criterion above passes | S3.5, S3.6, S3.8, S3.9 |

## Estimate

- **Points:** 8
- **Reason:** High effort and high complexity. This is the first real use of the SDK. It needs streaming events, many sessions at once, a folder picker, and the full chat UI. Uncertainty is medium after S1. The "not logged in" case (S3.7, S3.8) and the `Origin` check (S3.9) are small and do not change the estimate.

## Out of Scope

- The office map and characters (S4).
- Permission prompts in the UI (S5). Until S5, sessions use a fixed permission mode.
- Resuming old sessions (S6).
- Stop and close (S7).
- Sub-agent views (S9, S10).
