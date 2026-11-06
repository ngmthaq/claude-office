# Claude Office: a pixel 2D office UI for Claude Code — Overview

- **Source:** Pasted text (from `/onboarding`)
- **Type:** epic
- **Created:** 2026-11-05
- **Stories:** 10 · **Total Points:** 55 · **Done:** 0 · **In progress:** 0 · **Not started:** 10

## Summary

Claude Office is a local web app for one developer. It wraps Claude Code and shows every session on this device as a room in a pixel 2D office. You chat with each room's root agent, approve tool use in the UI, and watch sub-agents walk in when they start and walk out when they finish.

## Stories

| #   | User Story | Doc | Points | Depends On | Ticket | Status |
| --- | --- | --- | --- | --- | --- | --- |
| S1  | Spike: check the Agent SDK | [Doc](./2026-11-05-spike-check-agent-sdk-story.md) | 3 | — | — | ⬜ Not started |
| S2  | App foundation | [Doc](./2026-11-05-app-foundation-story.md) | 5 | — | — | ⬜ Not started |
| S3  | Start a session and chat | [Doc](./2026-11-05-start-session-and-chat-story.md) | 8 | S1, S2 | — | ⬜ Not started |
| S4  | Office map, rooms, and root agents | [Doc](./2026-11-05-office-map-rooms-root-agents-story.md) | 8 | S3 | — | ⬜ Not started |
| S5  | Permission prompts in the UI | [Doc](./2026-11-05-permission-prompts-in-ui-story.md) | 5 | S3, S4 | — | ⬜ Not started |
| S6  | Resume an old session | [Doc](./2026-11-05-resume-old-session-story.md) | 5 | S3 | — | ⬜ Not started |
| S7  | Stop and close | [Doc](./2026-11-05-stop-and-close-session-story.md) | 5 | S3, S4 | — | ⬜ Not started |
| S8  | Rename and archive rooms | [Doc](./2026-11-05-rename-and-archive-rooms-story.md) | 3 | S4 | — | ⬜ Not started |
| S9  | Sub-agents join and leave the room | [Doc](./2026-11-05-subagents-join-and-leave-room-story.md) | 8 | S1, S4 | — | ⬜ Not started |
| S10 | Sub-agent details | [Doc](./2026-11-05-subagent-details-panel-story.md) | 5 | S9 | — | ⬜ Not started |

**Status legend:** ⬜ Not started · 🚧 In progress · ✅ Done

## Delivery Order

1. S1 Spike: check the Agent SDK **and** S2 App foundation *(can run at the same time)*
2. S3 Start a session and chat *(blocked by S1, S2)*
3. S4 Office map, rooms, and root agents **and** S6 Resume an old session *(both blocked by S3, can run at the same time)*
4. S5 Permission prompts, S7 Stop and close, S8 Rename and archive, S9 Sub-agents join and leave *(all blocked by S4, can run at the same time)*
5. S10 Sub-agent details *(blocked by S9)*

## Deferred to Later

- Live sessions that run in other terminals (needs Claude Code hooks).
- Desktop or sound alerts when a session waits for your OK.
- Custom characters and office decoration.
- Chatting with sub-agents directly.
- Support for two or more browser tabs at the same time.
- An install package and setup docs for other people.
- Automated tests.

## Open Questions

- [ ] After S1, recheck the S9 estimate. If sub-agent events are hard to track, S9 may grow. Owner: the developer (you).
