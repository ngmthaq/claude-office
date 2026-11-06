# Agent SDK spike (S1)

Throw-away scripts that check 3 facts about `@anthropic-ai/claude-agent-sdk`.
Findings are in [plans/spike-agent-sdk.md](../../plans/spike-agent-sdk.md).

## Setup

```sh
cd spikes/agent-sdk
pnpm install --ignore-workspace
```

You need a logged-in Claude Code on this machine. No API key is used.

## Scripts

| Command           | What it checks                                         |
| ----------------- | ------------------------------------------------------ |
| `pnpm run login` | S1.1: SDK uses the Claude Code login                   |
| `pnpm subagents`  | S1.2: sub-agent start, end, and parent fields          |
| `pnpm permission` | S1.3: `canUseTool` waits for a `y`/`n` answer on stdin |
| `pnpm typecheck`  | Strict TypeScript check                                |

Use `echo y | pnpm permission` to allow and `echo n | pnpm permission` to deny.
Each run saves every SDK message to `logs/<script>-<timestamp>.jsonl` (git-ignored).
