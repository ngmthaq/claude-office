# Graph Report - claude-office  (2026-11-06)

## Corpus Check
- 167 files · ~76,412 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .graphify-bak 1, .css 1)

## Summary
- 1415 nodes · 2324 edges · 118 communities (110 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 149 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ws-route.ts
- Execution Workflow
- canUseTool
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
- CLAUDE
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
- ref_anthropic_ai_claude_agent_sdk
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
- Step 2 — Brainstorming
- office-scene.ts
- Step 1 — Brainstorming (Root Agent)
- Step 6 — Reply to and Resolve Threads
- server/tsconfig.json
- folder-browser.ts
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
- Title: Plan — S1 Spike: check the Agent SDK
- settings.json
- Step 3 — User Approval Gate
- Step 7 — Summary Report to User
- Title: Plan — S3 Start a session and chat
- subagents-check.ts
- S6 — Resume an old session
- shared/tsconfig.json
- use-chat-store.ts
- AgentSprite
- App.tsx
- Step 5 — Sub-Agent Result Return
- Step 1 — Check Browser Permission
- sendClientEvent
- GameCanvas.tsx
- AgentSprite
- CameraController
- step-6-test-report.md
- Claude Office: a pixel 2D office UI for Claude Code — Overview
- agent-sprite.ts
- history-reader.ts
- Agent SDK spike (S1)
- ws-client.ts
- onboarding/SKILL.md
- Title: Plan — S5 Permission prompts in the UI
- RoomView
- Graphify Setup
- RTK Setup
- use-sessions-store.ts
- Title: Plan — S9 + S10 Sub-agents in the room, with details
- room-view.ts
- Phase 6 — Create Tickets
- Vulnerable Package Watchlist
- SECURITY_SCANNER/ENTRY_POINT.md
- AI / LLM Security
- Report Format
- Phase 3 — Break Down Work
- Security Scanner
- Secret Patterns
- Project Onboarding
- Coding Conventions
- Phase 5 — Generate Docs
- canUseTool
- startWsClient
- Phase 1 — Take Input
- Step 3 — Test Plan
- DRY.md
- KISS.md
- SEPARATION_OF_CONCERNS.md

## God Nodes (most connected - your core abstractions)
1. `SessionManager` - 47 edges
2. `sendClientEvent()` - 29 edges
3. `useSessionsStore` - 23 edges
4. `RoomSummary` - 21 edges
5. `OfficeScene` - 19 edges
6. `handleClientEvent()` - 18 edges
7. `AgentSprite` - 17 edges
8. `RoomView` - 17 edges
9. `registerWsRoute()` - 16 edges
10. `CameraController` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Files in Scope` --references--> `sendClientEvent()`  [INFERRED]
  plans/2026-11-05-21-50-52-s3-start-session-and-chat.md → apps/web/src/features/connection/ws-client.ts
- `Naming` --references--> `AgentSprite`  [INFERRED]
  .claude/references/CODING_CONVENTIONS.md → apps/web/src/game/agent-sprite.ts
- `Web, room` --references--> `AgentSprite`  [INFERRED]
  plans/2026-11-06-07-25-33-s9-s10-subagents-in-room-with-details.md → apps/web/src/game/agent-sprite.ts
- `Approach Summary / Goal` --references--> `RoomSummary`  [INFERRED]
  plans/2026-11-06-07-25-33-s9-s10-subagents-in-room-with-details.md → packages/shared/src/session-events.ts
- `Shared` --references--> `RoomSummary`  [INFERRED]
  plans/2026-11-06-07-25-33-s9-s10-subagents-in-room-with-details.md → packages/shared/src/session-events.ts

## Import Cycles
- None detected.

## Communities (118 total, 8 thin omitted)

### Community 0 - "ws-route.ts"
Cohesion: 0.16
Nodes (7): ALLOWED_ORIGINS, SERVER_VERSION, originCheck(), errorName(), WsRouteOptions, ErrorEvent, fastify

### Community 1 - "Execution Workflow"
Cohesion: 0.18
Nodes (11): Execution Workflow, Step 10 — Propose Patches, Step 1 — Find the Scope and Look Around, Step 2 — Dependency Audit (SCA), Step 3 — Secrets & Exposure Scan, Step 4 — Static Analysis (SAST), Step 5 — Vulnerability Deep Scan, Step 6 — AI / LLM Security (+3 more)

### Community 3 - "canUseTool"
Cohesion: 0.25
Nodes (8): How to re-run, Impact on S3 / S5 / S9, Q1 Login, Q2 Sub-agent messages, Q3 Permission callback, Setup used, Spike S1: Claude Agent SDK findings, Summary

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, globals, prettier, typescript, typescript-eslint (+21 more)

### Community 5 - "web/package.json"
Cohesion: 0.07
Nodes (28): dependencies, @claude-office/shared, pixi.js, react, react-dom, react-markdown, remark-gfm, zustand (+20 more)

### Community 6 - "Data Handling"
Cohesion: 0.09
Nodes (22): Authentication & Access Control, Broken Authorization / IDOR / BOLA (CWE-284, CWE-639), Business Logic, Command Injection (CWE-78), Cross-Site Scripting — XSS (CWE-79), Cryptography, CSRF (CWE-352), Data Handling (+14 more)

### Community 7 - "config.ts"
Cohesion: 0.11
Nodes (19): ASK_IN_CHAT_MESSAGE, ASK_IN_CHAT_TOOLS, DATA_DIR, DB_PATH, HOST, MIGRATIONS_DIR, PERMISSION_DENY_MESSAGE, PORT (+11 more)

### Community 8 - "agent-sdk/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @anthropic-ai/claude-agent-sdk, devDependencies, tsx, @types/node, typescript, @anthropic-ai/claude-agent-sdk, tsx (+11 more)

### Community 9 - "Tester"
Cohesion: 0.12
Nodes (16): Additional Skill References, Code-First, Constraints, Delegation Prompt Template, Failure Modes, Inputs, Note for Code-First and Test-First, Outputs (+8 more)

### Community 10 - "agile-planning/SKILL.md"
Cohesion: 0.11
Nodes (14): AGENT RULES, DO, DO NOT, 2a. Ask clarifying questions first, 2b. Look at the codebase (read-only), 2c. Write the analysis, Phase 2 — Brainstorm, 4a. Find a reference story (+6 more)

### Community 11 - "server/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, @claude-office/shared, fastify, @fastify/websocket, devDependencies, tsx (+17 more)

### Community 12 - "pull-request/SKILL.md"
Cohesion: 0.13
Nodes (7): Step 3 — Choose the Target Branch, Step 4 — Collect Context, Step 5 — Fill the Template, Step 7 — Summary Report, Suggested format, Step 4 — Check That the Code Matches the Requirements, Step 9 — Write the Review Report

### Community 13 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, esModuleInterop, isolatedModules, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+5 more)

### Community 14 - "session-manager.ts"
Cohesion: 0.14
Nodes (9): cutStrings(), LoadSkipped, PendingPermission, ResumeErrorCode, ResumeResult, RoomEventListener, SessionStateListener, StartResult (+1 more)

### Community 15 - "shared/package.json"
Cohesion: 0.15
Nodes (12): dependencies, zod, exports, main, name, private, scripts, typecheck (+4 more)

### Community 16 - "CLAUDE"
Cohesion: 0.50
Nodes (4): AGENT RULES, CLAUDE, CODING CONVENTIONS, PROJECT OVERVIEW

### Community 18 - "Developer"
Cohesion: 0.18
Nodes (11): Additional Skill References, Constraints, Delegation Prompt Template, Developer, Failure Modes, Inputs, Outputs, Position in the Workflow (+3 more)

### Community 19 - "AAA — Arrange, Act, Assert"
Cohesion: 0.18
Nodes (8): AAA — Arrange, Act, Assert, Common Violations, Rules, Shared Arrange, Test Naming, The Pattern, Step 5 — Load Guides, Step 8 — Apply AAA Testing Review

### Community 20 - "SessionManager"
Cohesion: 0.05
Nodes (45): RoomRow, RoomsRepo, toRoomRow(), main(), listFolders(), realHome(), resolveFolder(), createMapperState() (+37 more)

### Community 21 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, noUncheckedIndexedAccess, skipLibCheck, strict, target (+2 more)

### Community 22 - "session-events.ts"
Cohesion: 0.04
Nodes (47): ArchivedEvent, ArchivedListEvent, ArchivedRoomSchema, AssistantTextEvent, AuthErrorEvent, FolderEntrySchema, FoldersEvent, FoldersListEvent (+39 more)

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
Nodes (44): ClientEventSchema, ErrorEventSchema, HelloEvent, HelloEventSchema, ParseFailure, ParseResult, PingEvent, PingEventSchema (+36 more)

### Community 28 - "Title: Plan — S2 App foundation"
Cohesion: 0.14
Nodes (15): ClientEvent, parseClientEvent(), parseWith(), readEventType(), safeJsonParse(), ServerEvent, Approach Summary / Goal, Files in Scope (+7 more)

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
Cohesion: 0.33
Nodes (6): Additional Information, How it works (planned), Main features, Safety notes, Status, Tools

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
Cohesion: 0.24
Nodes (7): Approved, Cancels, Requests Changes, Step 4 — Approval Gate, Constraints, Step-by-Step Instructions, Web Test

### Community 41 - "Step 5 — Run Tests in the Browser"
Cohesion: 0.33
Nodes (5): 1. Start the browser, 2. Run each test case, 3. Browser safety rules, 4. Finish, Step 5 — Run Tests in the Browser

### Community 42 - "Step 2 — Brainstorming"
Cohesion: 0.40
Nodes (5): Brainstorming Dialogue, Check the Test Scope, Classify the Intent, Step 2 — Brainstorming, Usage Notes

### Community 43 - "office-scene.ts"
Cohesion: 0.16
Nodes (9): ScreenRect, View, WorldRect, computeBounds(), labelRect(), OfficeScene, selectRoom(), ROOM_HEIGHT (+1 more)

### Community 44 - "Step 1 — Brainstorming (Root Agent)"
Cohesion: 0.25
Nodes (8): Brainstorming Dialogue, Bug, Check Task Complexity, Classify the Intent, Feature, Step 1 — Brainstorming (Root Agent), Unclear Cases, Usage Notes

### Community 45 - "Step 6 — Reply to and Resolve Threads"
Cohesion: 0.25
Nodes (7): Do not resolve when, Push the changes first, Reply, then resolve — per accepted thread, Step 6 — Reply to and Resolve Threads, Using MCP, Using the browser, Using the CLI

### Community 46 - "server/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, paths, types, extends, include, ../../tsconfig.base.json

### Community 47 - "folder-browser.ts"
Cohesion: 0.18
Nodes (7): HOME_DIR, FolderErrorCode, FolderListing, FolderResult, FolderEntry, LOGS_DIR, LogWriter

### Community 48 - "sdk-event-mapper.ts"
Cohesion: 0.14
Nodes (25): SUBAGENT_TOOL_EVENTS_MAX, ACCOUNT_ERRORS, AUTH_ERRORS, authErrorMessage(), describeContent(), findSubagentId(), finishAllSubagents(), finishSubagent() (+17 more)

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

### Community 69 - "Title: Plan — S1 Spike: check the Agent SDK"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — S1 Spike: check the Agent SDK

### Community 70 - "settings.json"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, $schema

### Community 71 - "Step 3 — User Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels / Aborts, Requests Changes, Step 3 — User Approval Gate

### Community 72 - "Step 7 — Summary Report to User"
Cohesion: 0.50
Nodes (3): Step 7 — Summary Report to User, Summary Report Template, Usage Notes

### Community 73 - "Title: Plan — S3 Start a session and chat"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S3 Start a session and chat

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
Cohesion: 0.08
Nodes (39): AuthErrorNotice(), AuthErrorNoticeProps, ChatItemView(), ExternalLink(), MessageList(), MessageListProps, PermissionCard(), answer() (+31 more)

### Community 78 - "AgentSprite"
Cohesion: 0.24
Nodes (4): AgentSprite, SubagentSprite, SessionState, Approach Summary / Goal

### Community 79 - "App.tsx"
Cohesion: 0.12
Nodes (13): App(), ConnectionBadge(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, ConnectionState, ConnectionStatus, useConnectionStore (+5 more)

### Community 80 - "Step 5 — Sub-Agent Result Return"
Cohesion: 0.67
Nodes (3): Step 5 — Sub-Agent Result Return, Sub-Agent Result Template, Usage Notes

### Community 81 - "Step 1 — Check Browser Permission"
Cohesion: 0.40
Nodes (4): 1. Check that the user allows the browser, 2. Check that a browser tool is available, 3. Get the target, Step 1 — Check Browser Permission

### Community 82 - "sendClientEvent"
Cohesion: 0.20
Nodes (19): ChatInput(), onKeyDown(), submit(), ChatInputProps, ChatPanel(), sendArchive(), sendClose(), CloseConfirmDialog() (+11 more)

### Community 83 - "GameCanvas.tsx"
Cohesion: 0.12
Nodes (15): loadSheets(), SHEET_URLS, SheetName, sheetTextures, TILE_SIZE, tileCache, GameCanvas(), startDevTools() (+7 more)

### Community 84 - "AgentSprite"
Cohesion: 0.12
Nodes (17): RoomSummary, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+9 more)

### Community 86 - "step-6-test-report.md"
Cohesion: 0.50
Nodes (3): Step 6 — Test Report, Test Report Template, Usage Notes

### Community 87 - "Claude Office: a pixel 2D office UI for Claude Code — Overview"
Cohesion: 0.33
Nodes (6): Claude Office: a pixel 2D office UI for Claude Code — Overview, Deferred to Later, Delivery Order, Open Questions, Stories, Summary

### Community 88 - "agent-sprite.ts"
Cohesion: 0.29
Nodes (8): CLOTHES_POOL, drawBubble(), drawDot(), drawExclamation(), HAIR_POOL, hashString(), pick(), TilePos

### Community 89 - "history-reader.ts"
Cohesion: 0.26
Nodes (12): HISTORY_TEXT_MAX, ROOM_EVENT_BUFFER_MAX, contentOf(), cut(), isRecord(), listHistory(), loadRoomEvents(), mapAssistantContent() (+4 more)

### Community 90 - "Agent SDK spike (S1)"
Cohesion: 0.40
Nodes (3): Agent SDK spike (S1), Scripts, Setup

### Community 91 - "ws-client.ts"
Cohesion: 0.21
Nodes (14): ArchivedDialog(), ArchivedState, useArchivedStore, FolderGroup, groupByFolder(), HistoryDialog(), lastSegment(), toTime() (+6 more)

### Community 92 - "onboarding/SKILL.md"
Cohesion: 0.19
Nodes (5): graphify, graphify, PROJECT OVERVIEW, Step 2 — Coding Conventions, Step 3 — Finish

### Community 93 - "Title: Plan — S5 Permission prompts in the UI"
Cohesion: 0.22
Nodes (8): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — S5 Permission prompts in the UI

### Community 94 - "RoomView"
Cohesion: 0.23
Nodes (3): RoomView, subagentEndStatus(), subagentSpot()

### Community 95 - "Graphify Setup"
Cohesion: 0.25
Nodes (7): Add to Claude Code, Build the graph, Graphify Setup, Install, Keep it up to date (optional), Search the graph, What you need

### Community 96 - "RTK Setup"
Cohesion: 0.29
Nodes (6): Add to Claude Code, Check savings, Common commands, Install, Notes, RTK Setup

### Community 97 - "use-sessions-store.ts"
Cohesion: 0.25
Nodes (6): FAKE_ROOM_PREFIX, RenameTarget, SessionsState, startFakeRooms(), stateAt(), STATES

### Community 98 - "Title: Plan — S9 + S10 Sub-agents in the room, with details"
Cohesion: 0.18
Nodes (10): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Server, Shared, Status (+2 more)

### Community 99 - "room-view.ts"
Cohesion: 0.15
Nodes (18): getTile(), createBadgeBackground(), createBadgeText(), createDesk(), createFloor(), createPlant(), createSmallDesks(), createWalls() (+10 more)

### Community 100 - "Phase 6 — Create Tickets"
Cohesion: 0.22
Nodes (8): 6a. Choose where to create the tickets, 6b. Create story tickets, 6c. Create task tickets, 6d. Update the overview, 6e. Show a summary, MCP Reference, No MCP — use the browser, Phase 6 — Create Tickets

### Community 101 - "Vulnerable Package Watchlist"
Cohesion: 0.22
Nodes (9): Cargo, Go Modules, Maven / Gradle, npm, pip, Reporting Format, RubyGems, Triage Rules (+1 more)

### Community 103 - "AI / LLM Security"
Cohesion: 0.33
Nodes (6): AI / LLM Security, Data Leakage via Prompts, Indirect Prompt Injection (RAG / Agentic), Insecure Tool Use, Model & Infrastructure Basics, Prompt Injection (CWE-1336)

### Community 104 - "Report Format"
Cohesion: 0.33
Nodes (6): 1. Scan Summary, 2. Finding Cards, 3. Dependency Audit, 4. Secrets Scan, 5. Proposed Patches, Report Format

### Community 105 - "Phase 3 — Break Down Work"
Cohesion: 0.25
Nodes (8): 3a. Epic → User Stories, 3b. User Story → Tasks, Dependencies, How to split a big story, Output format, Phase 3 — Break Down Work, What counts as a user story, What is NOT a user story

### Community 106 - "Security Scanner"
Cohesion: 0.40
Nodes (5): Reference Files, Rules, Security Scanner, Severity Guide, When to Use

### Community 107 - "Secret Patterns"
Cohesion: 0.40
Nodes (5): Detected Patterns, How to Fix, Running the Scanner, Secret Patterns, What the Script Cannot Find — Check by Hand

### Community 108 - "Project Onboarding"
Cohesion: 0.40
Nodes (5): How to Use This Skill, Onboarding Workflow, Override Notice, Project Onboarding, Purpose

### Community 109 - "Coding Conventions"
Cohesion: 0.29
Nodes (7): Code order in a file, Coding Conventions, Folder structure, Imports, Naming, Other rules, Style (Prettier + ESLint)

### Community 110 - "Phase 5 — Generate Docs"
Cohesion: 0.25
Nodes (7): After writing, File path, Overview file, Overview template, Phase 5 — Generate Docs, Rules, Story doc template

### Community 111 - "canUseTool"
Cohesion: 0.36
Nodes (6): Functional Requirements, createLogWriter(), canUseTool(), lines, log, main()

### Community 112 - "startWsClient"
Cohesion: 0.60
Nodes (6): startWsClient(), connect(), openSelectedRoom(), routeServerEvent(), scheduleReconnect(), parseServerEvent()

### Community 113 - "Phase 1 — Take Input"
Cohesion: 0.40
Nodes (4): 1a. Find the input source, 1b. Find the input type, 1c. Show what you got, Phase 1 — Take Input

### Community 114 - "Step 3 — Test Plan"
Cohesion: 0.50
Nodes (4): Planning Rules, Step 3 — Test Plan, Test Plan Template, Usage Notes

## Knowledge Gaps
- **20 isolated node(s):** `@anthropic-ai/claude-agent-sdk`, `@claude-office/shared`, `@types/better-sqlite3`, `@types/node`, `@types/ws` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 736 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentSprite` connect `AgentSprite` to `Title: Plan — S9 + S10 Sub-agents in the room, with details`, `room-view.ts`, `Coding Conventions`, `GameCanvas.tsx`, `AgentSprite`, `agent-sprite.ts`, `RoomView`?**
  _High betweenness centrality (0.311) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `sendClientEvent()` (e.g. with `Files in Scope` and `Task List`) actually correct?**
  _`sendClientEvent()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@anthropic-ai/claude-agent-sdk`, `@claude-office/shared`, `@types/better-sqlite3` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07096774193548387 - nodes in this community are weakly interconnected._
- **Why does `Coding Conventions` connect `Coding Conventions` to `onboarding/SKILL.md`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `RoomSummary` (e.g. with `Functional Requirements` and `Task List`) actually correct?**
  _`RoomSummary` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._