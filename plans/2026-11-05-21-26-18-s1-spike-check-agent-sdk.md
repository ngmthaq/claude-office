# Title: Plan — S1 Spike: check the Agent SDK

- Classification: feature
- Description: Write small TypeScript scripts in `spikes/agent-sdk/` to test the Agent SDK's login, sub-agent messages, and permission callback, then write the results in `plans/spike-agent-sdk.md`.

---

## Approach Summary / Goal

- `spikes/agent-sdk/` is a small package of its own, outside the pnpm workspace. It has `@anthropic-ai/claude-agent-sdk` (0.3.x) and `tsx`, and holds 3 TS scripts, one for each question.
- Each script saves the raw SDK messages to `spikes/agent-sdk/logs/` as JSON lines. Git ignores that folder.
- The permission script waits on a Promise. A y/n answer typed on stdin resolves it. The WebSocket will use the same pattern later.
- **Goal:** answer the 3 acceptance criteria of S1 with facts, so S3, S5, and S9 are built on facts, not guesses.

## Functional Requirements

- `login-check.ts` sends one short prompt and prints the reply text, the session id, and the auth/model info from the `system` init message.
- `subagents-check.ts` asks Claude to start 2 sub-agents at the same time, on read-only tasks in this repo. It logs every message.
  - It prints a short summary: for each sub-agent, the tool_use id, the tool name (`Task` or `Agent`), when it starts and ends, and the `parent_tool_use_id` seen on its messages.
- `permission-check.ts` uses `canUseTool`. The callback prints the tool name and input, then waits for `y`/`n` on stdin and returns allow or deny. The script prints the result and how long it waited.
- `plans/spike-agent-sdk.md` answers each of the 3 S1 criteria. It also has short, cleaned message examples and "what this means for S3 / S5 / S9".

## Non-Functional Requirements

- Never print or log env var values, API keys, or token values. Logs keep SDK messages only.
- Test prompts are harmless and read-only. Use small turn limits so usage stays low.
- Scripts use strict TS and the project style rules (single quotes, semicolons, 2-space indent). They are throw-away code, so they need no other polish.
- Nothing goes in `apps/` or `packages/`.

## Files in Scope

- `spikes/agent-sdk/package.json`, `tsconfig.json`, `README.md` (how to run each script)
- `spikes/agent-sdk/src/login-check.ts`
- `spikes/agent-sdk/src/subagents-check.ts`
- `spikes/agent-sdk/src/permission-check.ts`
- `spikes/agent-sdk/src/log-writer.ts` (a small helper that saves messages as JSON lines)
- `.gitignore` (new; has `node_modules/`, `spikes/agent-sdk/logs/`)
- `spikes/agent-sdk/logs/*.jsonl` (created by the scripts, git-ignored)
- `plans/spike-agent-sdk.md`

## Risks & Assumptions

- **Assumption:** the SDK starts the bundled Claude Code, and that uses your existing login from the keychain. If it fails, the note says what setup is needed. We will not add a key.
- **Risk:** the scripts run from inside this Claude Code session, where `CLAUDECODE*` env vars are set. A nested run may act differently. If it does, the note says so, and you can run the scripts again from a plain terminal.
- **Risk:** newer SDK versions may name the sub-agent tool `Agent` instead of `Task`. The script catches both names, and the note writes down the real one.
- **Risk:** Claude may run the 2 sub-agents one after the other instead of at the same time. The script logs the timing so the note can say what really happened.
- **Assumption:** for the sub-agent run, the developer sub-agent sends the answer by piping `y` on stdin. The script still waits on the Promise. You can also run it by hand to type the answer yourself, and I will ask you to do that at review.
- **Assumption:** Skip-Testing applies, so there are no tester tasks. S1.5 (the review with you) happens at Step 7.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1   | DONE | Set up `spikes/agent-sdk/`: `package.json` (SDK, tsx, typescript), `tsconfig.json` (strict), `README.md`, `src/log-writer.ts`, and a root `.gitignore`. Run `pnpm install` there. | developer | none | Install works. `log-writer.ts` writes one JSON line per message to `logs/<script>-<timestamp>.jsonl`. `.gitignore` covers `node_modules/` and `spikes/agent-sdk/logs/`. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE | Write and run `src/login-check.ts` (S1.1) | developer | 1 | The script runs, prints a reply, the session id, and the init info (model, auth source if shown). It prints no secrets. A log file is saved. If it fails, the exact error is reported. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE | Write and run `src/subagents-check.ts` (S1.2) | developer | 2 | A log is saved. The printed summary shows, for each of the 2 sub-agents: tool name, tool_use id, start time, end time (its tool_result), and the `parent_tool_use_id` on its child messages. It also says whether the 2 sub-agents overlapped in time. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | DONE | Write and run `src/permission-check.ts` (S1.3). The prompt makes Claude use a tool that needs permission, such as a harmless `Bash` command like `echo hi` or `date`. `canUseTool` waits for y/n on stdin. | developer | 2 | Run with `y` piped on stdin, the callback runs, waits, returns allow, and the tool runs. Run with `n`, the tool is denied and Claude gets the deny message. The wait time and callback arguments (including any abort signal) are printed and logged. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | DONE | Write `plans/spike-agent-sdk.md` (S1.4) from the logs and output of tasks 2–4 | developer | 3, 4 | The note answers all 3 S1 criteria, with field names and short, cleaned JSON examples. It has a "Impact on S3 / S5 / S9" section, including whether the S9 estimate (8) still fits. It has no secrets and no env values. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |

Tasks 3 and 4 can run at the same time after task 2. I will give tasks 1–5 to one developer sub-agent so it keeps the context. That is simpler for a spike this small.
