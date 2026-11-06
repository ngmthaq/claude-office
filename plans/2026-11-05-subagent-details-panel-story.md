# S10 — Sub-agent details

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 5
- **Depends On:** S9 ([doc](./2026-11-05-subagents-join-and-leave-room-story.md))

## User Story

As the developer, I want to click a sub-agent and see its task, tool calls, and result so that I can see what it is doing.

## Goal

**Problem:** The characters show that sub-agents work, but not what they do. If their tool calls mix into the main chat, the main chat gets hard to read.

**Solution:** The server sends sub-agent events apart from the main chat. Clicking a sub-agent opens a read-only panel with its type, its task, its live tool calls, and its result. The main chat keeps a short card for each sub-agent.

**Impact:** I can check delegated work without noise in the main chat.

## Requirements

### Functional Requirements

- Click a sub-agent character to open a side panel with its type, its task prompt, and its live tool calls.
- The panel shows the result when the sub-agent finishes.
- The panel is read only.
- The main chat shows one card for each sub-agent. The card opens the same panel, even after the character has left.
- Sub-agent tool calls do not show in the main chat.

### Non-Functional Requirements

- **Performance:** the panel updates live with no lag in the office view.

## Acceptance Criteria

- [ ] Given a sub-agent in the room, when I click it, then a side panel shows its type, its task prompt, and its tool calls as they happen.
- [ ] Given the sub-agent finishes, when the panel is open, then the panel shows its result.
- [ ] Given the details panel, then I can only read it. There is no input box.
- [ ] Given a sub-agent has left, when I look at the main chat, then a sub-agent card is there, and it opens the same details.

## Tasks

| #     | Task | Done when | Depends On |
| ----- | --- | --- | --- |
| S10.1 | [BE] Send sub-agent tool calls and results as events linked to that sub-agent, not mixed into the main chat | The main chat shows no sub-agent tool calls | — |
| S10.2 | [FE] Sub-agent details panel (type, task, live tool calls, result) | Clicking a character opens the right details | S10.1 |
| S10.3 | [FE] Sub-agent card in the main chat that opens the details | The card works after the character has left | S10.2 |
| S10.4 | [QA] Check the S10 criteria by hand | Every criterion above passes | S10.3 |

## Estimate

- **Points:** 5
- **Reason:** Medium effort and complexity, low uncertainty. It sends sub-agent events apart from the main chat, and adds a new panel and a chat card.

## Out of Scope

- Chatting with or stopping one sub-agent.
- Sub-agent details for old (resumed) sessions.
