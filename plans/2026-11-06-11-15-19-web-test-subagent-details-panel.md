# Title: Web Test Plan — Sub-agent details in the MCP panel style

- Classification: feature
- Description: Check that the sub-agent details panel has one header (Back, "<agent type> · <room name>", status badge) and that it scrolls and closes correctly.
- Target URL: http://127.0.0.1:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current window)

---

## Goal

- Prove that the sub-agent details replace the whole chat panel and show one header that matches the MCP panel.
- Prove that Back, scrolling, switching rooms, and the prompt box height work.

## Scope

- In scope: the sub-agent details panel opened from a sub-agent card in the chat, and the MCP panel for comparison.
- Out of scope: opening details from the office map sprite, and the content of tool cards.

## Preconditions

- The app runs at the target URL.
- An existing room (for example `onsight_sms_ecp`) has at least one sub-agent card in its chat.
- There are at least 2 rooms in the sidebar.

## Risks & Assumptions

- No action changes data. Only Back, cards, sidebar rooms, and the MCP button are clicked. No messages are sent to Claude.
- If no room shows a sub-agent card, the cases are `BLOCKED`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run

## Test Cases

| ID | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | PASS | Details show one header | high | A room has a sub-agent card | 1. Click the room in the sidebar. 2. Click the sub-agent card in the chat. | existing room | One header row only: Back button, title "<agent type> · <room name>", status badge on the right. No room header and no second Back button. |
| TC-02 | PASS | Header matches the MCP panel | medium | TC-01 | 1. Note the header layout. 2. Click Back. 3. Click the **MCP servers** button. 4. Compare. | none | Both headers use the same row style: Back on the left, a bold title, items on the right. |
| TC-03 | PASS | Body scrolls on its own | medium | Details open with enough content | 1. Scroll inside the details body. | none | The body scrolls. The header stays in place. |
| TC-04 | PASS | Back returns to the chat | high | Details open | 1. Click **Back to chat**. | none | The chat shows again, with the room header, the messages, and the input. |
| TC-05 | PASS | Switching rooms closes the details | high | Details open, 2+ rooms | 1. Click another room in the sidebar. 2. Click the first room again. | none | The other room shows its chat. The first room shows its chat, not the details. |
| TC-06 | PASS | Prompt box keeps its height | high | Details open on a sub-agent with many tool calls | 1. Look at the Prompt box. | `onsight_sms_ecp` sub-agent | The prompt shows several lines (up to about 12rem), not one line. |
