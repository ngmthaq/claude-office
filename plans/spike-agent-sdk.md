# Spike S1: Claude Agent SDK findings

Date: 2026-11-05. Status: done. All 3 questions are answered with real runs.

## Summary

| Question                                           | Answer                                                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Q1. Can the SDK use the existing Claude Code login? | Yes. No API key needed. The init message shows `apiKeySource: "none"`.                                      |
| Q2. Which fields mark sub-agent start, end, parent? | Start: `system/task_started`. End: `system/task_notification` (and the parent's `tool_result`). Parent: `parent_tool_use_id` on child messages. |
| Q3. Can `canUseTool` wait for an outside answer?   | Yes. It is an async function. It can wait as long as needed. Allow and deny both work.                      |

Surprise: the sub-agent tool is named `Agent` (not `Task`) in this SDK version.

## Setup used

- SDK: `@anthropic-ai/claude-agent-sdk` 0.3.318
- Node v24.11.1, pnpm 10.25.0, Claude Code CLI 2.1.292 (init reports its own `claude_code_version`)
- Auth: the SDK started the local Claude Code and used its login. No env var or key was set or read.
- The scripts ran from inside a Claude Code session. Nested runs worked. No `CLAUDECODE*` var was removed.
- Total real SDK runs: 6 (1 login, 1 sub-agents, 4 permission; the first permission run did not trigger the callback, see Q3).

## Q1 Login

- `query()` with no key worked. The reply was `Hello there!`.
- Init message fields seen: `session_id`, `model`, `apiKeySource`, `claude_code_version`, `cwd`, `tools`, `permissionMode`, `agents`, `slash_commands`.
- Model used: `claude-opus-5-5` (the account default).
- The SDK also loaded the user's normal Claude Code setup (skills, slash commands, agents) by default. For the app, pass `settingSources` to control this.

```json
{ "type": "system", "subtype": "init", "model": "claude-opus-5-5", "apiKeySource": "none", "session_id": "…" }
```

## Q2 Sub-agent messages

Test: one prompt asked for 2 sub-agents in parallel (count `.md` files in `plans/`, list `.claude/agents/`).

| Event            | Message                                                        | Key fields                                                                 |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Spawn requested  | `assistant` with a `tool_use` block, `name: "Agent"`           | `block.id` (the tool_use id), `parent_tool_use_id: null`                   |
| Start            | `system`, `subtype: "task_started"`                            | `task_id`, `tool_use_id`, `description`, `subagent_type`, `spawn_depth`, `is_backgrounded` |
| Progress         | `system`, `subtype: "task_progress"`                           | `task_id`, `tool_use_id`, `last_tool_name`, `usage`                        |
| Child activity   | `assistant` and `user` messages                                | `parent_tool_use_id` = the sub-agent's tool_use id                         |
| End              | `system`, `subtype: "task_updated"` then `"task_notification"` | `status: "completed"`, `summary`, `tool_use_id`, `usage`                   |
| End (result)     | top-level `user` message with a `tool_result` block            | `tool_use_id` = the same id, `parent_tool_use_id: null`                    |

Cleaned examples:

```json
{ "type": "system", "subtype": "task_started", "task_id": "a074…", "tool_use_id": "toolu_01Qs…",
  "description": "Count .md files in plans", "subagent_type": "Explore", "spawn_depth": 1,
  "is_backgrounded": false }
```

```json
{ "type": "assistant", "parent_tool_use_id": "toolu_01Qs…",
  "message": { "content": [{ "type": "tool_use", "name": "Glob", "id": "toolu_01BY…" }] } }
```

```json
{ "type": "system", "subtype": "task_notification", "task_id": "a074…", "tool_use_id": "toolu_01Qs…",
  "status": "completed", "summary": "The plans/ folder has 12 .md files …" }
```

Timing (ms after the run started, from `logs/subagents-check-*.jsonl`):

| Sub-agent | tool_use id    | Start (tool_use) | End (tool_result) | Child messages |
| --------- | -------------- | ---------------- | ----------------- | -------------- |
| A         | `toolu_01Qs…`  | 5664             | 13401             | 7              |
| B         | `toolu_01RK…`  | 7307             | 12869             | 5              |

- The 2 sub-agents overlapped in time: yes (B started about 1.6 s after A, and both ended around 12.9 s to 13.4 s).
- Each child message carries the right `parent_tool_use_id`, so interleaved messages can be split by parent. No mix-ups seen.
- The 2 `tool_use` blocks arrived in separate `assistant` messages (one per content block), not in one message.
- Use `tool_use_id` to join `task_started` / `task_notification` with the `Agent` tool_use. `task_id` is the SDK's own id for the task.
- Sub-agents tried `Bash`, got `system/permission_denied` (mode `dontAsk`), and used `Glob` instead. Child tool calls need permission handling too.
- A top-level `tool_result` with `parent_tool_use_id: null` and a matching id is the final answer of the sub-agent.

## Q3 Permission callback

Signature (from `sdk.d.ts`):

```ts
type CanUseTool = (
  toolName: string,
  input: Record<string, unknown>,
  options: { signal: AbortSignal; suggestions?: PermissionUpdate[]; blockedPath?: string;
             decisionReason?: string; toolUseID: string; /* … */ },
) => Promise<PermissionResult>;
// PermissionResult: { behavior: 'allow', updatedInput? } | { behavior: 'deny', message, interrupt? }
```

Options keys seen at runtime: `signal`, `suggestions`, `blockedPath`, `displayName`, `description`, `toolUseID`, `requestId`.

- Wait pattern: the callback returns a Promise. The script resolved it from one stdin line. The SDK paused the tool until then. In the browser, store the Promise resolver keyed by `toolUseID` / `requestId` and call it when the WebSocket answer arrives.
- Allow (`y`): the tool ran. The tool_result was `done`. `updatedInput` must be given (pass the original input).
- Deny (`n`): the tool did not run. The tool_result had `is_error: true` and the exact deny `message`. Claude read it and said so, and did not retry. `result.permission_denials` lists the denied call.
- Measured wait: 1150 ms with a delayed answer (about 4 s sleep minus app start time). A piped `y` gave 0 ms. No timeout was hit.
- Abort signal: an `AbortSignal` is passed, `aborted: false` during the wait. It is meant to fire when the run is cancelled. Not triggered in this spike.
- `suggestions` gives ready-made "always allow" rules (`addRules`, `addDirectories`, `setMode`). A UI can offer them as buttons.
- Surprise: a read-only `echo hi` is auto-allowed and never calls `canUseTool`. The probe command needed to write (`touch …`). Two early runs did not reach the callback for this reason.

Cleaned example of the call:

```json
{ "toolName": "Bash",
  "input": { "command": "touch spikes/…/permission-probe.txt && echo done" },
  "options": { "toolUseID": "toolu_013y…", "requestId": "7835…", "blockedPath": "…/permission-probe.txt",
               "suggestions": [{ "type": "addRules", "behavior": "allow", "destination": "localSettings" }] } }
```

## Impact on S3 / S5 / S9

- S3 (start session and chat):
  - Login works with no key, so there is no key screen.
  - Read `session_id` and `model` from the `system/init` message.
  - Decide `settingSources` on purpose, because the default loads the user's own setup.
- S5 (permission prompts in UI):
  - `canUseTool` can await a browser answer. The plan works as designed.
  - Key pending requests by `toolUseID`. Wire `signal` to cancel the prompt in the UI.
  - Return `deny` with a clear `message`, because Claude reads it.
  - Plain read-only commands never prompt, so the UI will only show prompts for risky tools.
  - Sub-agent tool calls can also trigger the callback.
- S9 (sub-agents join and leave the room):
  - Use `system/task_started` (join) and `system/task_notification` (leave). Both carry `tool_use_id`, so no guessing.
  - Detect the sub-agent tool by `name === 'Agent'`, and also accept `'Task'` for older versions.
  - Route child messages by `parent_tool_use_id`. Parallel sub-agents did not mix.
  - `task_progress` gives `last_tool_name` and `usage` for the details panel.
  - Estimate of 8: still fits. The fields are clear and well typed. Nesting (`spawn_depth`, `parent_task_id`) and background tasks (`is_backgrounded`) are extra cases but exist as fields. No reason to raise or lower the estimate.

## How to re-run

See [spikes/agent-sdk/README.md](../spikes/agent-sdk/README.md). Logs are in `spikes/agent-sdk/logs/` (git-ignored).
