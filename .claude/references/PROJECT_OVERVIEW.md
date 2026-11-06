# PROJECT OVERVIEW

---

- **Project Name**: `claude-office`
- **Project Description**: `A local web app that wraps Claude Code. It shows all Claude sessions on this device as rooms in a pixel 2D office. Each room has a root agent character that the user chats with. Sub-agents join the room as new characters and leave when they finish.`
- **Programming Languages**: `TypeScript`
- **Frameworks**: `React + Vite (frontend), Node.js + Fastify (backend)`
- **Package Managers**: `pnpm (workspace monorepo)`
- **Key Libraries**: `@anthropic-ai/claude-agent-sdk, pixi.js, @fastify/websocket, better-sqlite3` (planned, not installed yet)
- **Database**: `SQLite (local file, app data only)`
- **Doc Directory**: `/plans`
- **Testing Workflow**: `Skip-Testing` <!-- Code-First | Test-First | Skip-Testing -->
- **Playwright Check**: `Ask-User` <!-- Always | None | Ask-User -->

> Note: DO NOT change the list format above. Only fill in the values.

## Additional Information

### Status

- New project. On 2026-11-05 the repo has only the `.claude/` setup. There is no app code yet.
- The stack above comes from the user's choices during onboarding. Change this file when the real code differs.

### Main features

| Feature        | What it does                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| Office view    | A pixel 2D office drawn with PixiJS. One room for each Claude session on this device.            |
| Session list   | Shows all sessions. The user can open, resume, start, and stop sessions.                         |
| Root agent     | Each room has one root agent character. The user chats with it. This is the main chat.          |
| Sub-agents     | When Claude starts a sub-agent (Task tool), a new character walks into the room.                 |
| Sub-agent exit | When the sub-agent finishes, its character leaves the room.                                      |

### How it works (planned)

- **Backend (Node)** uses the Claude Agent SDK to start, resume, and talk to sessions.
  - It finds old sessions in `~/.claude/projects/` (Claude Code's own session files).
  - It reads the SDK message stream. A `Task` tool call means "sub-agent started". Its tool result means "sub-agent finished".
  - It sends events to the browser over WebSocket.
- **Frontend (React)** shows the chat panel and session list. A PixiJS canvas shows the office and characters.
- **SQLite** stores app data only: room layout, character looks, custom session names. Claude's files stay the source of truth for chat history.

### Safety notes

- The app runs Claude Code on the user's machine. The backend must listen on `localhost` only.
- Never read or log the Anthropic API key or other secrets.

### Tools

- **Graphify** is set up for this project (skill + hooks). Build the graph with `graphify . --code-only` after code exists.
- **RTK** is on for all projects (global hook).
