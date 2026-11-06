# Graph Report - claude-code-office  (2026-11-06)

## Corpus Check
- 188 files · ~94,916 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .graphify-bak 1, .css 1)

## Summary
- 1600 nodes · 2637 edges · 136 communities (130 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 167 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84afe42e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ws-route.ts
- Execution Workflow
- Title: Plan — S1 Spike: check the Agent SDK
- package.json
- web/package.json
- Data Handling
- config.ts
- agent-sdk/package.json
- Tester
- agile-planning/SKILL.md
- server/package.json
- pull-request/SKILL.md
- compilerOptions
- session-manager.ts
- shared/package.json
- AGENT_RULES.md
- party-mode/SKILL.md
- Developer
- AAA — Arrange, Act, Assert
- SessionManager
- compilerOptions
- session-events.ts
- Step 1 — Project Overview
- pull-request-template.md
- Pull Request
- S2 — App foundation
- events.ts
- Title: Plan — S2 App foundation
- ChatInput.tsx
- S3 — Start a session and chat
- S7 — Stop and close
- S9 — Sub-agents join and leave the room
- compilerOptions
- Atomic Design
- Additional Information
- Code Review Checklist
- Researcher
- SOLID
- scan-secrets.sh
- web-test/SKILL.md
- Step 5 — Run Tests in the Browser
- folder-browser.ts
- OfficeScene
- Step 1 — Brainstorming (Root Agent)
- Step 6 — Reply to and Resolve Threads
- server/tsconfig.json
- command-catalog.ts
- sdk-event-mapper.ts
- Step 6 — Review (Root Agent)
- Step 1 — Choose the Access Method
- S4 — Office map, rooms, and root agents
- S5 — Permission prompts in the UI
- Step 2 — Planning (Root Agent)
- Party-Mode
- Step 4 — Triage and Group Comments
- S1 — Spike: check the Agent SDK
- S10 — Sub-agent details
- Language & Framework Patterns
- Credits
- Clean Code
- S8 — Rename and archive rooms
- Step 4 — Delegation to Sub-Agents
- Step 6 — Create the PR
- Step 3 — Fetch Reviewer Comments
- Step 5 — Resolve via Party-Mode
- Step 10 — Offer to Post Review (File + Line Comments)
- Step 3 — Fetch the Code Diff
- Step 2 — Find the Target PR
- history-reader.ts
- settings.json
- Step 3 — User Approval Gate
- Step 7 — Summary Report to User
- RoomsRepo
- subagents-check.ts
- S6 — Resume an old session
- shared/tsconfig.json
- use-chat-store.ts
- GameCanvas.tsx
- ChatResizeHandle.tsx
- file-index.ts
- What You Must Do When Invoked
- use-connection-store.ts
- use-sessions-store.ts
- Title: Plan — S9 + S10 Sub-agents in the room, with details
- Title: Plan — S4 Office map, rooms, and root agents
- step-6-test-report.md
- Claude Office: a pixel 2D office UI for Claude Code — Overview
- agent-sprite.ts
- Step 1 — Check Browser Permission
- handleClientEvent
- sendClientEvent
- onboarding/SKILL.md
- ChatPanel.tsx
- RoomView
- Graphify Setup
- Title: Plan — S3 Start a session and chat
- .ensureQuery
- ws-client.ts
- room-view.ts
- Title: Plan — S5 Permission prompts in the UI
- Vulnerable Package Watchlist
- SECURITY_SCANNER/ENTRY_POINT.md
- AI / LLM Security
- Report Format
- CameraController
- Security Scanner
- Secret Patterns
- Title: Plan — S6 Resume an old session
- Coding Conventions
- .resume
- Spike S1: Claude Agent SDK findings
- startWsClient
- .loadClosedRooms
- Title: Plan — Resizable chat panel
- canUseTool
- Phase 6 — Create Tickets
- Phase 3 — Break Down Work
- Phase 5 — Generate Docs
- Agent SDK spike (S1)
- graphify reference: extra exports and benchmark
- Title: Plan — Autocomplete for `/` commands and `@` files in the chat box
- ref_anthropic_ai_claude_agent_sdk
- Files in Scope
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- main.tsx
- dependencies
- devDependencies
- scripts
- parseClientEvent

## God Nodes (most connected - your core abstractions)
1. `SessionManager` - 49 edges
2. `sendClientEvent()` - 31 edges
3. `useSessionsStore` - 25 edges
4. `handleClientEvent()` - 22 edges
5. `RoomSummary` - 21 edges
6. `OfficeScene` - 19 edges
7. `react-bootstrap` - 18 edges
8. `ChatInput()` - 18 edges
9. `AgentSprite` - 17 edges
10. `RoomView` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Functional Requirements` --references--> `resolveFolder()`  [INFERRED]
  plans/2026-11-06-06-27-34-s6-resume-old-session.md → apps/server/src/sessions/folder-browser.ts
- `Non-Functional Requirements` --references--> `resolveFolder()`  [INFERRED]
  plans/2026-11-06-09-01-12-chat-autocomplete-slash-and-at.md → apps/server/src/sessions/folder-browser.ts
- `Web, chat` --references--> `ToolCard()`  [INFERRED]
  plans/2026-11-06-07-25-33-s9-s10-subagents-in-room-with-details.md → apps/web/src/features/chat/ToolCard.tsx
- `Files in Scope` --references--> `sendClientEvent()`  [INFERRED]
  plans/2026-11-05-21-50-52-s3-start-session-and-chat.md → apps/web/src/features/connection/ws-client.ts
- `Naming` --references--> `AgentSprite`  [INFERRED]
  .claude/references/CODING_CONVENTIONS.md → apps/web/src/game/agent-sprite.ts

## Import Cycles
- None detected.

## Communities (136 total, 6 thin omitted)

### Community 0 - "ws-route.ts"
Cohesion: 0.16
Nodes (12): ALLOWED_ORIGINS, SERVER_VERSION, originCheck(), errorName(), WsRouteOptions, ErrorEvent, packages_shared_src_index_clientevent, packages_shared_src_index_errorevent (+4 more)

### Community 1 - "Execution Workflow"
Cohesion: 0.18
Nodes (11): Execution Workflow, Step 10 — Propose Patches, Step 1 — Find the Scope and Look Around, Step 2 — Dependency Audit (SCA), Step 3 — Secrets & Exposure Scan, Step 4 — Static Analysis (SAST), Step 5 — Vulnerability Deep Scan, Step 6 — AI / LLM Security (+3 more)

### Community 3 - "Title: Plan — S1 Spike: check the Agent SDK"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, globals, prettier, typescript, typescript-eslint (+21 more)

### Community 5 - "web/package.json"
Cohesion: 0.17
Nodes (11): @claude-office/shared, @types/node, name, private, type, version, ref_node_url, @types/react (+3 more)

### Community 6 - "Data Handling"
Cohesion: 0.09
Nodes (22): Authentication & Access Control, Broken Authorization / IDOR / BOLA (CWE-284, CWE-639), Business Logic, Command Injection (CWE-78), Cross-Site Scripting — XSS (CWE-79), Cryptography, CSRF (CWE-352), Data Handling (+14 more)

### Community 7 - "config.ts"
Cohesion: 0.11
Nodes (22): ASK_IN_CHAT_MESSAGE, ASK_IN_CHAT_TOOLS, DATA_DIR, DB_PATH, HOST, MIGRATIONS_DIR, PERMISSION_DENY_MESSAGE, PORT (+14 more)

### Community 8 - "agent-sdk/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @anthropic-ai/claude-agent-sdk, devDependencies, tsx, @types/node, typescript, @anthropic-ai/claude-agent-sdk, tsx (+11 more)

### Community 9 - "Tester"
Cohesion: 0.12
Nodes (16): Additional Skill References, Code-First, Constraints, Delegation Prompt Template, Failure Modes, Inputs, Note for Code-First and Test-First, Outputs (+8 more)

### Community 10 - "agile-planning/SKILL.md"
Cohesion: 0.11
Nodes (15): 1a. Find the input source, 1b. Find the input type, 1c. Show what you got, Phase 1 — Take Input, 2a. Ask clarifying questions first, 2b. Look at the codebase (read-only), 2c. Write the analysis, Phase 2 — Brainstorm (+7 more)

### Community 11 - "server/package.json"
Cohesion: 0.07
Nodes (26): dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, @claude-office/shared, fastify, @fastify/websocket, devDependencies, tsx (+18 more)

### Community 12 - "pull-request/SKILL.md"
Cohesion: 0.13
Nodes (7): Step 3 — Choose the Target Branch, Step 4 — Collect Context, Step 5 — Fill the Template, Step 7 — Summary Report, Suggested format, Step 4 — Check That the Code Matches the Requirements, Step 9 — Write the Review Report

### Community 13 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, esModuleInterop, isolatedModules, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+5 more)

### Community 14 - "session-manager.ts"
Cohesion: 0.11
Nodes (18): listBackgroundTaskIds(), listSubagents(), MapperState, CommandList, cutStrings(), LoadSkipped, PendingPermission, ResumeErrorCode (+10 more)

### Community 15 - "shared/package.json"
Cohesion: 0.15
Nodes (12): dependencies, zod, exports, main, name, private, scripts, typecheck (+4 more)

### Community 16 - "AGENT_RULES.md"
Cohesion: 0.17
Nodes (9): AGENT RULES, CLAUDE, CODING CONVENTIONS, graphify, graphify, PROJECT OVERVIEW, AGENT RULES, DO (+1 more)

### Community 17 - "party-mode/SKILL.md"
Cohesion: 0.14
Nodes (9): DRY — Don't Repeat Yourself, DRY Rules, KISS — Keep It Simple, Stupid, KISS Rules, Separation of Concerns, SoC Rules, Step 5 — Sub-Agent Result Return, Sub-Agent Result Template (+1 more)

### Community 18 - "Developer"
Cohesion: 0.18
Nodes (11): Additional Skill References, Constraints, Delegation Prompt Template, Developer, Failure Modes, Inputs, Outputs, Position in the Workflow (+3 more)

### Community 19 - "AAA — Arrange, Act, Assert"
Cohesion: 0.18
Nodes (8): AAA — Arrange, Act, Assert, Common Violations, Rules, Shared Arrange, Test Naming, The Pattern, Step 5 — Load Guides, Step 8 — Apply AAA Testing Review

### Community 20 - "SessionManager"
Cohesion: 0.23
Nodes (3): errorName(), SessionManager, RoomEvent

### Community 21 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noUncheckedIndexedAccess, skipLibCheck, strict, target (+2 more)

### Community 22 - "session-events.ts"
Cohesion: 0.04
Nodes (47): ArchivedEvent, ArchivedListEvent, ArchivedRoomSchema, AssistantTextEvent, AuthErrorEvent, FileEntrySchema, FolderEntrySchema, FoldersListEvent (+39 more)

### Community 23 - "Step 1 — Project Overview"
Cohesion: 0.20
Nodes (10): 1.1 — Project Name and Description, 1.2 — Programming Languages and Frameworks, 1.3 — Package Manager, 1.4 — Key Libraries, 1.5 — Database, 1.6 — Doc Directory, 1.7 — Testing Workflow, 1.8 — Playwright Check (+2 more)

### Community 24 - "pull-request-template.md"
Cohesion: 0.20
Nodes (8): Changes Made, Checklist, Description, How to Test, Related Issues, Screenshots, Type of Change, Step 2 — Find the PR Template

### Community 25 - "Pull Request"
Cohesion: 0.20
Nodes (10): `create`, Pull Request, `resolve`, `review`, Rules for All Modes, Rules for `create`, Rules for `resolve`, Rules for `review` (+2 more)

### Community 26 - "S2 — App foundation"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S2 — App foundation (+2 more)

### Community 27 - "events.ts"
Cohesion: 0.04
Nodes (48): ClientEventSchema, ErrorEventSchema, HelloEventSchema, ParseFailure, ParseResult, PingEvent, PingEventSchema, PongEvent (+40 more)

### Community 28 - "Title: Plan — S2 App foundation"
Cohesion: 0.20
Nodes (11): ClientEvent, ServerEvent, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 29 - "ChatInput.tsx"
Cohesion: 0.12
Nodes (26): applyPick(), AutocompleteRows, AutocompleteToken, findToken(), rankCommands(), rankFiles(), rowInsertText(), tokenKey() (+18 more)

### Community 30 - "S3 — Start a session and chat"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S3 — Start a session and chat (+2 more)

### Community 31 - "S7 — Stop and close"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S7 — Stop and close (+2 more)

### Community 32 - "S9 — Sub-agents join and leave the room"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S9 — Sub-agents join and leave the room (+2 more)

### Community 33 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, jsx, lib, paths, types, extends, include, ../../tsconfig.base.json (+1 more)

### Community 34 - "Atomic Design"
Cohesion: 0.22
Nodes (8): Atomic Design, Atomic Design Rules, Atoms, Folder Structure, Molecules, Organisms, Pages, Templates

### Community 35 - "Additional Information"
Cohesion: 0.29
Nodes (7): Additional Information, How it works (planned), Main features, PROJECT OVERVIEW, Safety notes, Status, Tools

### Community 36 - "Code Review Checklist"
Cohesion: 0.22
Nodes (7): Atomic Design _(UI only)_, Code Review Checklist, DRY _(All)_, KISS _(All)_, Separation of Concerns _(All)_, SOLID _(OOP)_, Step 6 — Apply Clean Code Review

### Community 37 - "Researcher"
Cohesion: 0.25
Nodes (8): Constraints, Failure Modes, Inputs, Outputs, Position in the Workflow, Purpose, Researcher, Workflow Steps

### Community 38 - "SOLID"
Cohesion: 0.25
Nodes (7): D — Dependency Inversion Principle, I — Interface Segregation Principle, L — Liskov Substitution Principle, O — Open/Closed Principle, S — Single Responsibility Principle, SOLID, SOLID Rules

### Community 39 - "scan-secrets.sh"
Cohesion: 0.50
Nodes (7): main(), report(), scan_diff(), scan_files(), scan_line(), severity_color(), scan-secrets.sh script

### Community 40 - "web-test/SKILL.md"
Cohesion: 0.11
Nodes (16): Brainstorming Dialogue, Check the Test Scope, Classify the Intent, Step 2 — Brainstorming, Usage Notes, Planning Rules, Step 3 — Test Plan, Test Plan Template (+8 more)

### Community 41 - "Step 5 — Run Tests in the Browser"
Cohesion: 0.33
Nodes (5): 1. Start the browser, 2. Run each test case, 3. Browser safety rules, 4. Finish, Step 5 — Run Tests in the Browser

### Community 42 - "folder-browser.ts"
Cohesion: 0.18
Nodes (10): HOME_DIR, FolderErrorCode, FolderListing, FolderResult, packages_shared_src_index_folderentry, FolderEntry, ref_node_fs, ref_node_path (+2 more)

### Community 43 - "OfficeScene"
Cohesion: 0.24
Nodes (4): computeBounds(), labelRect(), OfficeScene, selectRoom()

### Community 44 - "Step 1 — Brainstorming (Root Agent)"
Cohesion: 0.25
Nodes (8): Brainstorming Dialogue, Bug, Check Task Complexity, Classify the Intent, Feature, Step 1 — Brainstorming (Root Agent), Unclear Cases, Usage Notes

### Community 45 - "Step 6 — Reply to and Resolve Threads"
Cohesion: 0.25
Nodes (7): Do not resolve when, Push the changes first, Reply, then resolve — per accepted thread, Step 6 — Reply to and Resolve Threads, Using MCP, Using the browser, Using the CLI

### Community 46 - "server/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, paths, types, extends, include, ../../tsconfig.base.json

### Community 47 - "command-catalog.ts"
Cohesion: 0.38
Nodes (10): collectMarkdown(), Frontmatter, readFrontmatter(), readHead(), safeReaddir(), scanCommands(), scanDiskCommands(), scanSkills() (+2 more)

### Community 48 - "sdk-event-mapper.ts"
Cohesion: 0.17
Nodes (21): ACCOUNT_ERRORS, AUTH_ERRORS, authErrorMessage(), describeContent(), findSubagentId(), finishAllSubagents(), finishSubagent(), mapAssistant() (+13 more)

### Community 49 - "Step 6 — Review (Root Agent)"
Cohesion: 0.29
Nodes (7): Checklist, Minimum Skill References, Review Feedback (when not qualified), Review Workflow, Routing, Rules, Step 6 — Review (Root Agent)

### Community 50 - "Step 1 — Choose the Access Method"
Cohesion: 0.29
Nodes (7): Find the platform, None available, Step 1 — Choose the Access Method, Tier 1 — Platform MCP (best), Tier 2 — Platform CLI (backup), Tier 3 — Claude browser control, What each mode needs

### Community 51 - "S4 — Office map, rooms, and root agents"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S4 — Office map, rooms, and root agents (+2 more)

### Community 52 - "S5 — Permission prompts in the UI"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S5 — Permission prompts in the UI (+2 more)

### Community 53 - "Step 2 — Planning (Root Agent)"
Cohesion: 0.33
Nodes (6): Additional rules for `bug` plans, Minimum Skill References, Plan Template, Planning Rules, Step 2 — Planning (Root Agent), Usage Notes

### Community 54 - "Party-Mode"
Cohesion: 0.33
Nodes (6): Common Rules, Constraints, Loop Guard, Party-Mode, Step-by-Step Instructions, Sub-Agent Roles

### Community 55 - "Step 4 — Triage and Group Comments"
Cohesion: 0.33
Nodes (5): Classify each comment that needs work, Group related comments, Remove comments that need no work, Step 4 — Triage and Group Comments, Write the triage table

### Community 56 - "S1 — Spike: check the Agent SDK"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S1 — Spike: check the Agent SDK (+2 more)

### Community 57 - "S10 — Sub-agent details"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S10 — Sub-agent details (+2 more)

### Community 58 - "Language & Framework Patterns"
Cohesion: 0.22
Nodes (9): Go, Java, JavaScript / TypeScript, Language & Framework Patterns, .NET / C#, PHP, Python, Ruby (+1 more)

### Community 59 - "Credits"
Cohesion: 0.40
Nodes (4): Credits, Notes for S4, What is in the characters sheet, What is in the indoors sheet

### Community 60 - "Clean Code"
Cohesion: 0.40
Nodes (5): Clean Code, Four contexts and their load order, How to Use This Guide, Reference Index, Universal Rules

### Community 61 - "S8 — Rename and archive rooms"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S8 — Rename and archive rooms (+2 more)

### Community 62 - "Step 4 — Delegation to Sub-Agents"
Cohesion: 0.40
Nodes (5): Re-delegation, Running in parallel, Start the developer sub-agent, Start the tester sub-agent, Step 4 — Delegation to Sub-Agents

### Community 63 - "Step 6 — Create the PR"
Cohesion: 0.40
Nodes (5): Copy-paste, Step 6 — Create the PR, Using MCP, Using the browser, Using the CLI

### Community 64 - "Step 3 — Fetch Reviewer Comments"
Cohesion: 0.40
Nodes (4): Step 3 — Fetch Reviewer Comments, Using MCP, Using the browser, Using the CLI

### Community 65 - "Step 5 — Resolve via Party-Mode"
Cohesion: 0.40
Nodes (4): Check out the PR branch first, Hand the triage list to party-mode, Pass-through rules, Step 5 — Resolve via Party-Mode

### Community 66 - "Step 10 — Offer to Post Review (File + Line Comments)"
Cohesion: 0.40
Nodes (4): Posting via browser, Posting via CLI, Posting via MCP, Step 10 — Offer to Post Review (File + Line Comments)

### Community 67 - "Step 3 — Fetch the Code Diff"
Cohesion: 0.40
Nodes (4): Step 3 — Fetch the Code Diff, Using MCP, Using the browser, Using the CLI

### Community 68 - "Step 2 — Find the Target PR"
Cohesion: 0.40
Nodes (5): Step 2 — Find the Target PR, Using MCP, Using the browser, Using the CLI, What to get from the PR

### Community 69 - "history-reader.ts"
Cohesion: 0.26
Nodes (12): HISTORY_TEXT_MAX, ROOM_EVENT_BUFFER_MAX, contentOf(), cut(), isRecord(), listHistory(), loadRoomEvents(), mapAssistantContent() (+4 more)

### Community 70 - "settings.json"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, $schema

### Community 71 - "Step 3 — User Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels / Aborts, Requests Changes, Step 3 — User Approval Gate

### Community 72 - "Step 7 — Summary Report to User"
Cohesion: 0.50
Nodes (3): Step 7 — Summary Report to User, Summary Report Template, Usage Notes

### Community 73 - "RoomsRepo"
Cohesion: 0.13
Nodes (12): RoomsRepo, toRoomRow(), ArchivedRoom, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers (+4 more)

### Community 74 - "subagents-check.ts"
Cohesion: 0.31
Nodes (8): log, main(), printSummary(), startTime, SUBAGENT_TOOLS, SubagentTrace, traces, trackMessage()

### Community 75 - "S6 — Resume an old session"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S6 — Resume an old session (+2 more)

### Community 76 - "shared/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.base.json

### Community 77 - "use-chat-store.ts"
Cohesion: 0.07
Nodes (45): AuthErrorNotice(), AuthErrorNoticeProps, ChatItemView(), ExternalLink(), MessageList(), MessageListProps, PermissionCard(), answer() (+37 more)

### Community 78 - "GameCanvas.tsx"
Cohesion: 0.12
Nodes (17): loadSheets(), SHEET_URLS, SheetName, sheetTextures, TILE_SIZE, tileCache, GameCanvas(), startDevTools() (+9 more)

### Community 79 - "ChatResizeHandle.tsx"
Cohesion: 0.33
Nodes (10): ChatResizeHandle(), DragState, endDragEffects(), nextWidth(), ChatWidthState, clampWidth(), getBounds(), loadInitialWidth() (+2 more)

### Community 80 - "file-index.ts"
Cohesion: 0.29
Nodes (9): buildListing(), cache, FileListing, gitPaths(), listFiles(), normalize(), SKIPPED_DIRS, walkPaths() (+1 more)

### Community 81 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 82 - "use-connection-store.ts"
Cohesion: 0.31
Nodes (7): ConnectionBadge(), STATUS_BG, ConnectionState, ConnectionStatus, useConnectionStore, HelloEvent, packages_shared_src_index_helloevent

### Community 83 - "use-sessions-store.ts"
Cohesion: 0.15
Nodes (15): FAKE_ROOM_PREFIX, RenameTarget, ScreenRect, SessionsState, View, WorldRect, startFakeRooms(), stateAt() (+7 more)

### Community 84 - "Title: Plan — S9 + S10 Sub-agents in the room, with details"
Cohesion: 0.17
Nodes (11): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Server, Shared, Status (+3 more)

### Community 85 - "Title: Plan — S4 Office map, rooms, and root agents"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 86 - "step-6-test-report.md"
Cohesion: 0.50
Nodes (3): Step 6 — Test Report, Test Report Template, Usage Notes

### Community 87 - "Claude Office: a pixel 2D office UI for Claude Code — Overview"
Cohesion: 0.33
Nodes (6): Claude Office: a pixel 2D office UI for Claude Code — Overview, Deferred to Later, Delivery Order, Open Questions, Stories, Summary

### Community 88 - "agent-sprite.ts"
Cohesion: 0.20
Nodes (10): AgentSprite, CLOTHES_POOL, drawBubble(), drawDot(), drawExclamation(), HAIR_POOL, hashString(), pick() (+2 more)

### Community 89 - "Step 1 — Check Browser Permission"
Cohesion: 0.50
Nodes (4): 1. Check that the user allows the browser, 2. Check that a browser tool is available, 3. Get the target, Step 1 — Check Browser Permission

### Community 90 - "handleClientEvent"
Cohesion: 0.15
Nodes (13): listFolders(), realHome(), resolveFolder(), broadcast(), errorEvent(), handleClientEvent(), registerWsRoute(), send() (+5 more)

### Community 91 - "sendClientEvent"
Cohesion: 0.21
Nodes (19): App(), ChatPanel(), sendArchive(), sendClose(), sendClientEvent(), FolderPicker(), browse(), NewSessionDialog() (+11 more)

### Community 92 - "onboarding/SKILL.md"
Cohesion: 0.11
Nodes (13): Add to Claude Code, Check savings, Common commands, Install, Notes, RTK Setup, Step 2 — Coding Conventions, Step 3 — Finish (+5 more)

### Community 93 - "ChatPanel.tsx"
Cohesion: 0.15
Nodes (15): IconButton(), IconButtonProps, CloseConfirmDialog(), CloseConfirmDialogProps, Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers (+7 more)

### Community 94 - "RoomView"
Cohesion: 0.17
Nodes (3): RoomView, subagentSpot(), SubagentSprite

### Community 95 - "Graphify Setup"
Cohesion: 0.25
Nodes (7): Add to Claude Code, Build the graph, Graphify Setup, Install, Keep it up to date (optional), Search the graph, What you need

### Community 96 - "Title: Plan — S3 Start a session and chat"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S3 Start a session and chat

### Community 97 - ".ensureQuery"
Cohesion: 0.32
Nodes (3): errorEvent(), InputQueue, Approach Summary / Goal

### Community 98 - "ws-client.ts"
Cohesion: 0.23
Nodes (14): ArchivedDialog(), ArchivedState, useArchivedStore, FolderGroup, groupByFolder(), HistoryDialog(), lastSegment(), toTime() (+6 more)

### Community 99 - "room-view.ts"
Cohesion: 0.14
Nodes (20): getTile(), createBadgeBackground(), createBadgeText(), createDesk(), createFloor(), createPlant(), createSmallDesks(), createWalls() (+12 more)

### Community 100 - "Title: Plan — S5 Permission prompts in the UI"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S5 Permission prompts in the UI

### Community 101 - "Vulnerable Package Watchlist"
Cohesion: 0.22
Nodes (9): Cargo, Go Modules, Maven / Gradle, npm, pip, Reporting Format, RubyGems, Triage Rules (+1 more)

### Community 103 - "AI / LLM Security"
Cohesion: 0.33
Nodes (6): AI / LLM Security, Data Leakage via Prompts, Indirect Prompt Injection (RAG / Agentic), Insecure Tool Use, Model & Infrastructure Basics, Prompt Injection (CWE-1336)

### Community 104 - "Report Format"
Cohesion: 0.33
Nodes (6): 1. Scan Summary, 2. Finding Cards, 3. Dependency Audit, 4. Secrets Scan, 5. Proposed Patches, Report Format

### Community 106 - "Security Scanner"
Cohesion: 0.40
Nodes (5): Reference Files, Rules, Security Scanner, Severity Guide, When to Use

### Community 107 - "Secret Patterns"
Cohesion: 0.40
Nodes (5): Detected Patterns, How to Fix, Running the Scanner, Secret Patterns, What the Script Cannot Find — Check by Hand

### Community 108 - "Title: Plan — S6 Resume an old session"
Cohesion: 0.17
Nodes (10): Session, HistoryEntry, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 109 - "Coding Conventions"
Cohesion: 0.29
Nodes (7): Code order in a file, Coding Conventions, Folder structure, Imports, Naming, Other rules, Style (Prettier + ESLint)

### Community 110 - ".resume"
Cohesion: 0.22
Nodes (6): RoomRow, createMapperState(), closedSession(), toSummary(), Functional Requirements, Files in Scope

### Community 111 - "Spike S1: Claude Agent SDK findings"
Cohesion: 0.25
Nodes (8): How to re-run, Impact on S3 / S5 / S9, Q1 Login, Q2 Sub-agent messages, Q3 Permission callback, Setup used, Spike S1: Claude Agent SDK findings, Summary

### Community 112 - "startWsClient"
Cohesion: 0.52
Nodes (7): startWsClient(), connect(), failPendingList(), openSelectedRoom(), routeServerEvent(), scheduleReconnect(), parseServerEvent()

### Community 113 - ".loadClosedRooms"
Cohesion: 0.24
Nodes (8): main(), Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Status, Task List, Title: Plan — S7 Stop and close

### Community 114 - "Title: Plan — Resizable chat panel"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 115 - "canUseTool"
Cohesion: 0.53
Nodes (5): ref_node_readline, canUseTool(), lines, log, main()

### Community 116 - "Phase 6 — Create Tickets"
Cohesion: 0.22
Nodes (8): 6a. Choose where to create the tickets, 6b. Create story tickets, 6c. Create task tickets, 6d. Update the overview, 6e. Show a summary, MCP Reference, No MCP — use the browser, Phase 6 — Create Tickets

### Community 117 - "Phase 3 — Break Down Work"
Cohesion: 0.25
Nodes (8): 3a. Epic → User Stories, 3b. User Story → Tasks, Dependencies, How to split a big story, Output format, Phase 3 — Break Down Work, What counts as a user story, What is NOT a user story

### Community 118 - "Phase 5 — Generate Docs"
Cohesion: 0.25
Nodes (7): After writing, File path, Overview file, Overview template, Phase 5 — Generate Docs, Rules, Story doc template

### Community 119 - "Agent SDK spike (S1)"
Cohesion: 0.40
Nodes (3): Agent SDK spike (S1), Scripts, Setup

### Community 120 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 121 - "Title: Plan — Autocomplete for `/` commands and `@` files in the chat box"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Autocomplete for `/` commands and `@` files in the chat box

### Community 122 - "ref_anthropic_ai_claude_agent_sdk"
Cohesion: 0.50
Nodes (4): ref_anthropic_ai_claude_agent_sdk, createLogWriter(), log, main()

### Community 123 - "Files in Scope"
Cohesion: 0.29
Nodes (7): CommandsEvent, CommandsListEvent, FileEntry, FilesEvent, FilesListEvent, SlashCommandEntry, Files in Scope

### Community 124 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 126 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 127 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 128 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 133 - "main.tsx"
Cohesion: 0.17
Nodes (8): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, container, apps_web_src_styles, bootstrap, bootstrap-icons, react-dom

### Community 137 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bootstrap, bootstrap-icons, @claude-office/shared, pixi.js, react, react-bootstrap, react-dom (+3 more)

### Community 138 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/node, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 139 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, typecheck

### Community 140 - "parseClientEvent"
Cohesion: 0.50
Nodes (4): parseClientEvent(), parseWith(), readEventType(), safeJsonParse()

## Knowledge Gaps
- **782 isolated node(s):** `$schema`, `PreToolUse`, `name`, `version`, `private` (+777 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 834 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentSprite` connect `agent-sprite.ts` to `room-view.ts`, `Coding Conventions`, `GameCanvas.tsx`, `Title: Plan — S9 + S10 Sub-agents in the room, with details`, `Title: Plan — S4 Office map, rooms, and root agents`, `RoomView`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Why does `Coding Conventions` connect `Coding Conventions` to `onboarding/SKILL.md`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `Naming` connect `Coding Conventions` to `agent-sprite.ts`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `sendClientEvent()` (e.g. with `Files in Scope` and `Task List`) actually correct?**
  _`sendClientEvent()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `handleClientEvent()` (e.g. with `.answerPermission()` and `.archive()`) actually correct?**
  _`handleClientEvent()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `RoomSummary` (e.g. with `Functional Requirements` and `Task List`) actually correct?**
  _`RoomSummary` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `PreToolUse`, `name` to the rest of the system?**
  _782 weakly-connected nodes found - possible documentation gaps or missing edges._