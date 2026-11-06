# S1 — Spike: check the Agent SDK

- **Epic:** [Claude Office overview](./2026-11-05-claude-office-pixel-ui-overview.md)
- **Story Points:** 3
- **Depends On:** —

## User Story

As the developer, I want to test the Agent SDK with my login and with sub-agents so that I know the plan works before I build on it.

## Goal

**Problem:** The whole app depends on the Claude Agent SDK. We do not know yet if it can use the Claude Code login that is already on this machine. We also do not know how its messages show when a sub-agent starts and ends, or how the server can wait for a permission answer from the browser. If we guess wrong, S3, S5, and S9 must be built again.

**Solution:** A short, fixed-time spike (a research task, not a feature). Small throw-away scripts test each question. The answers go into one note.

**Impact:** The team builds S3, S5, and S9 on facts, not guesses. Estimates for those stories become more correct.

## Requirements

### Functional Requirements

- A test script sends a prompt with the Agent SDK and gets a reply.
- A test script records every SDK message for a prompt that starts 2 sub-agents at the same time.
- A test script shows that the permission callback can pause and go on after an outside answer.
- A note in `plans/spike-agent-sdk.md` answers each question.

### Non-Functional Requirements

- Time limit: about 1–2 days in total.
- Never write API keys or other secrets into the note or the message logs.
- Spike scripts are throw-away code. Do not ship them in `apps/`.

## Acceptance Criteria

- [ ] Given the Claude Code login on this machine, when a test script runs a prompt with the Agent SDK, then it gets a reply with no new API key. If it can't, the note says what setup is needed.
- [ ] Given a prompt that starts 2 sub-agents at the same time, when the script records all messages, then the note says which fields mark each sub-agent's start, its end, and its parent.
- [ ] Given a tool that needs an OK, when the SDK asks for permission, then the note says how the server can wait for an answer from the browser.

## Tasks

| #    | Task | Done when | Depends On |
| ---- | --- | --- | --- |
| S1.1 | [BE] Spike: run a small Agent SDK script with the existing login | The script gets a reply, or the blocker is written down | — |
| S1.2 | [BE] Spike: record the SDK messages for 2 sub-agents that run at the same time | A saved message log shows start, end, and parent fields for each sub-agent | S1.1 |
| S1.3 | [BE] Spike: test that the permission callback can wait for an outside answer | The script pauses on a tool call and goes on after a manual answer | S1.1 |
| S1.4 | [Docs] Write the findings to `plans/spike-agent-sdk.md` | The note answers the 3 criteria above | S1.2, S1.3 |
| S1.5 | [QA] Review the note with the user | The user agrees each criterion is answered, or the plan is changed | S1.4 |

## Estimate

- **Points:** 3
- **Reason:** Low effort and medium complexity. The output is a note. Uncertainty is high, but the unknowns are the reason this story exists, and the time is fixed.

## Out of Scope

- Any production code in `apps/` or `packages/`.
- Live terminal sessions and Claude Code hooks.
- Reading old session files (that is S6).
