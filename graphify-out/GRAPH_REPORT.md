# Graph Report - claude-code-office  (2026-11-06)

## Corpus Check
- 286 files · ~105,189 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .css 1)

## Summary
- 1851 nodes · 3543 edges · 150 communities (136 shown, 14 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 312 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c53ec6f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- McpStatusPanel.tsx
- Execution Workflow
- web/package.json
- package.json
- main.ts
- Vulnerability Categories
- src/index.ts
- events/index.ts
- Tester
- agile-planning/SKILL.md
- server/package.json
- pull-request/SKILL.md
- compilerOptions
- .history
- shared/package.json
- AGENT_RULES.md
- CLEAN_CODE/ENTRY_POINT.md
- Developer
- AAA — Arrange, Act, Assert
- SessionService
- server-event.ts
- App.tsx
- Step 1 — Project Overview
- pull-request-template.md
- Pull Request
- S2 — App foundation
- models/index.ts
- ClientEvent
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
- main.tsx
- office-scene.ts
- Step 1 — Brainstorming (Root Agent)
- Step 6 — Reply to and Resolve Threads
- server/tsconfig.json
- Files in Scope
- SessionStoreRepository
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
- permission-answer.ts
- settings.json
- Step 3 — User Approval Gate
- Step 7 — Summary Report to User
- Files in Scope
- ref_node_readline
- S6 — Resume an old session
- shared/tsconfig.json
- use-chat-store.ts
- subagent-sprite.ts
- ChatResizeHandle.tsx
- .setPermissionMode
- What You Must Do When Invoked
- Title: Plan — Clean up files not needed by the app
- RoomView
- ws-client.ts
- ref_zod
- step-6-test-report.md
- Claude Office: a pixel 2D office UI for Claude Code — Overview
- agent-sprite.ts
- resume-result.dto.ts
- catalog.service.ts
- use-autocomplete-store.ts
- onboarding/SKILL.md
- IconButton
- SubagentSprite
- Graphify Setup
- commands.ts
- .notifyChanged
- room-view.ts
- Title: Plan — S3 Start a session and chat
- Vulnerable Package Watchlist
- SECURITY_SCANNER/ENTRY_POINT.md
- AI / LLM Security
- Report Format
- CameraController
- Security Scanner
- Secret Patterns
- Title: Web Test Plan — Sub-agent details in the MCP panel style
- Coding Conventions
- folder.repository.ts
- Spike S1: Claude Agent SDK findings
- RoomService
- .loadClosedRooms
- Title: Plan — Resizable chat panel
- RTK Setup
- Title: Plan — S1 Spike: check the Agent SDK
- Step 2 — Brainstorming
- use-connection-store.ts
- Title: Web Test Report — Sub-agent details in the MCP panel style
- graphify reference: extra exports and benchmark
- FolderRepository
- session.service.ts
- FileRepository
- graphify reference: query, path, explain
- Step 5 — Sub-Agent Result Return
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- RoomSummary
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- history.ts
- Title: Plan — 3-dots action menu for rooms (sidebar and chat header)
- Title: Plan — Fix the squeezed prompt box in sub-agent details
- Step 3 — Test Plan
- session-notice.ts
- Data Handling
- Authentication & Access Control
- PermissionService
- Title: Plan — Add space between the Prompt box and "Tool calls"
- subagent-finished.ts
- Title: Plan — Autocomplete for `/` commands and `@` files in the chat box
- Title: Plan — S4 Office map, rooms, and root agents
- Step 4 — Approval Gate
- pong.ts
- Title: Plan — Chat header shows only MCP; all room actions in the sidebar
- Title: Plan — Remove Rename from the chat header menu
- Step 1 — Check Browser Permission

## God Nodes (most connected - your core abstractions)
1. `SessionService` - 39 edges
2. `sendClientEvent()` - 32 edges
3. `ClientEvent` - 30 edges
4. `main()` - 29 edges
5. `Session` - 28 edges
6. `useSessionsStore` - 26 edges
7. `RoomEvent` - 26 edges
8. `RoomSummary` - 25 edges
9. `SdkEventMapperService` - 22 edges
10. `ChatInput()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Files in Scope` --references--> `ResumeErrorCode`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/dtos/resume-result.dto.ts
- `Risks & Assumptions` --references--> `main()`  [INFERRED]
  plans/2026-11-06-09-45-14-resizable-chat-panel.md → apps/server/src/main.ts
- `Files in Scope` --references--> `PendingPermission`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/repositories/session-store.repository.ts
- `Server layers` --references--> `Session`  [INFERRED]
  .claude/references/CODING_CONVENTIONS.md → apps/server/src/repositories/session-store.repository.ts
- `Non-Functional Requirements` --references--> `CloseConfirmDialog()`  [INFERRED]
  plans/2026-11-06-10-47-54-room-actions-menu.md → apps/web/src/features/chat/CloseConfirmDialog.tsx

## Import Cycles
- None detected.

## Communities (150 total, 14 thin omitted)

### Community 0 - "McpStatusPanel.tsx"
Cohesion: 0.09
Nodes (23): McpStatusPanel(), McpStatusPanelProps, STATUS_BG, STATUS_LABEL, STATUS_ORDER, EMPTY, McpRoomStatus, McpState (+15 more)

### Community 1 - "Execution Workflow"
Cohesion: 0.18
Nodes (11): Execution Workflow, Step 10 — Propose Patches, Step 1 — Find the Scope and Look Around, Step 2 — Dependency Audit (SCA), Step 3 — Secrets & Exposure Scan, Step 4 — Static Analysis (SAST), Step 5 — Vulnerability Deep Scan, Step 6 — AI / LLM Security (+3 more)

### Community 3 - "web/package.json"
Cohesion: 0.06
Nodes (33): dependencies, bootstrap, bootstrap-icons, @claude-office/shared, pixi.js, react, react-bootstrap, react-dom (+25 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, globals, prettier, typescript, typescript-eslint (+21 more)

### Community 5 - "main.ts"
Cohesion: 0.12
Nodes (20): ALLOWED_ORIGINS, DATA_DIR, HOST, PORT, SERVER_VERSION, DB_PATH, listMigrationFiles(), MIGRATIONS_DIR (+12 more)

### Community 6 - "Vulnerability Categories"
Cohesion: 0.20
Nodes (9): Business Logic, Command Injection (CWE-78), Cross-Site Scripting — XSS (CWE-79), Cryptography, Injection, Input Validation, Other Injection Sinks, SQL Injection (CWE-89) (+1 more)

### Community 7 - "src/index.ts"
Cohesion: 0.36
Nodes (8): WsRouteOptions, ErrorUtil, WsSendUtil, packages_shared_src_index_clientevent, packages_shared_src_index_errorevent, packages_shared_src_index_parseclientevent, fastify, ref_ws

### Community 8 - "events/index.ts"
Cohesion: 0.06
Nodes (34): ArchivedListEvent, ArchivedListEventSchema, ClientEventSchema, CommandsListEvent, CommandsListEventSchema, FilesListEvent, FilesListEventSchema, FoldersListEvent (+26 more)

### Community 9 - "Tester"
Cohesion: 0.12
Nodes (16): Additional Skill References, Code-First, Constraints, Delegation Prompt Template, Failure Modes, Inputs, Note for Code-First and Test-First, Outputs (+8 more)

### Community 10 - "agile-planning/SKILL.md"
Cohesion: 0.05
Nodes (38): 1a. Find the input source, 1b. Find the input type, 1c. Show what you got, Phase 1 — Take Input, 2a. Ask clarifying questions first, 2b. Look at the codebase (read-only), 2c. Write the analysis, Phase 2 — Brainstorm (+30 more)

### Community 11 - "server/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, @claude-office/shared, fastify, @fastify/websocket, zod, devDependencies (+19 more)

### Community 12 - "pull-request/SKILL.md"
Cohesion: 0.13
Nodes (7): Step 3 — Choose the Target Branch, Step 4 — Collect Context, Step 5 — Fill the Template, Step 7 — Summary Report, Suggested format, Step 4 — Check That the Code Matches the Requirements, Step 9 — Write the Review Report

### Community 13 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, esModuleInterop, isolatedModules, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+5 more)

### Community 14 - ".history"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — S6 Resume an old session

### Community 15 - "shared/package.json"
Cohesion: 0.15
Nodes (12): dependencies, zod, exports, zod, main, name, private, scripts (+4 more)

### Community 16 - "AGENT_RULES.md"
Cohesion: 0.17
Nodes (9): AGENT RULES, CLAUDE, CODING CONVENTIONS, graphify, graphify, PROJECT OVERVIEW, AGENT RULES, DO (+1 more)

### Community 17 - "CLEAN_CODE/ENTRY_POINT.md"
Cohesion: 0.17
Nodes (6): DRY — Don't Repeat Yourself, DRY Rules, KISS — Keep It Simple, Stupid, KISS Rules, Separation of Concerns, SoC Rules

### Community 18 - "Developer"
Cohesion: 0.18
Nodes (11): Additional Skill References, Constraints, Delegation Prompt Template, Developer, Failure Modes, Inputs, Outputs, Position in the Workflow (+3 more)

### Community 19 - "AAA — Arrange, Act, Assert"
Cohesion: 0.18
Nodes (8): AAA — Arrange, Act, Assert, Common Violations, Rules, Shared Arrange, Test Naming, The Pattern, Step 5 — Load Guides, Step 8 — Apply AAA Testing Review

### Community 21 - "server-event.ts"
Cohesion: 0.08
Nodes (30): AssistantTextEvent, AssistantTextEventSchema, AuthErrorEvent, AuthErrorEventSchema, ErrorEventSchema, McpStatusEventSchema, PermissionRequestEvent, PermissionRequestEventSchema (+22 more)

### Community 22 - "App.tsx"
Cohesion: 0.12
Nodes (31): App(), ChatPanel(), CloseConfirmDialog(), Confirming, RoomActionsMenu(), request(), send(), RoomActionsMenuProps (+23 more)

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

### Community 27 - "models/index.ts"
Cohesion: 0.16
Nodes (11): RoomPermissionModeEvent, RoomPermissionModeEventSchema, RoomRenameEvent, RoomRenameEventSchema, SessionStateEvent, SessionStateEventSchema, PermissionModeSchema, ROOM_NAME_MAX (+3 more)

### Community 28 - "ClientEvent"
Cohesion: 0.21
Nodes (6): SessionController, dispatch(), registerWsRoute(), ClientEvent, ErrorEvent, ServerEvent

### Community 29 - "ChatInput.tsx"
Cohesion: 0.16
Nodes (21): applyPick(), AutocompleteRows, AutocompleteToken, findToken(), rankCommands(), rankFiles(), rowInsertText(), tokenKey() (+13 more)

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
Cohesion: 0.25
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
Cohesion: 0.29
Nodes (7): D — Dependency Inversion Principle, I — Interface Segregation Principle, L — Liskov Substitution Principle, O — Open/Closed Principle, S — Single Responsibility Principle, SOLID, SOLID Rules

### Community 39 - "scan-secrets.sh"
Cohesion: 0.50
Nodes (7): main(), report(), scan_diff(), scan_files(), scan_line(), severity_color(), scan-secrets.sh script

### Community 40 - "web-test/SKILL.md"
Cohesion: 0.36
Nodes (3): Constraints, Step-by-Step Instructions, Web Test

### Community 41 - "Step 5 — Run Tests in the Browser"
Cohesion: 0.33
Nodes (5): 1. Start the browser, 2. Run each test case, 3. Browser safety rules, 4. Finish, Step 5 — Run Tests in the Browser

### Community 42 - "main.tsx"
Cohesion: 0.15
Nodes (9): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, container, apps_web_src_styles, Task List, bootstrap, bootstrap-icons (+1 more)

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

### Community 47 - "Files in Scope"
Cohesion: 0.10
Nodes (31): startWsClient(), connect(), failPendingList(), failPendingMcp(), openSelectedRoom(), routeServerEvent(), scheduleReconnect(), parseClientEvent() (+23 more)

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

### Community 69 - "permission-answer.ts"
Cohesion: 0.50
Nodes (3): PermissionAnswerEvent, PermissionAnswerEventSchema, PermissionDecisionSchema

### Community 70 - "settings.json"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, $schema

### Community 71 - "Step 3 — User Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels / Aborts, Requests Changes, Step 3 — User Approval Gate

### Community 72 - "Step 7 — Summary Report to User"
Cohesion: 0.50
Nodes (3): Step 7 — Summary Report to User, Summary Report Template, Usage Notes

### Community 73 - "Files in Scope"
Cohesion: 0.10
Nodes (18): parseRoomRow(), RawRoomRow, RoomRow, RoomRowSchema, RoomRepository, InputQueue, packages_shared_src_index_permissionmodeschema, ArchivedRoom (+10 more)

### Community 75 - "S6 — Resume an old session"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S6 — Resume an old session (+2 more)

### Community 76 - "shared/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.base.json

### Community 77 - "use-chat-store.ts"
Cohesion: 0.07
Nodes (46): IconButtonProps, AuthErrorNotice(), AuthErrorNoticeProps, CloseConfirmDialogProps, ChatItemView(), ExternalLink(), MessageList(), MessageListProps (+38 more)

### Community 78 - "subagent-sprite.ts"
Cohesion: 0.14
Nodes (15): loadSheets(), SHEET_URLS, SheetName, sheetTextures, TILE_SIZE, tileCache, GameCanvas(), createPixiApp() (+7 more)

### Community 79 - "ChatResizeHandle.tsx"
Cohesion: 0.33
Nodes (10): ChatResizeHandle(), DragState, endDragEffects(), nextWidth(), ChatWidthState, clampWidth(), getBounds(), loadInitialWidth() (+2 more)

### Community 80 - ".setPermissionMode"
Cohesion: 0.17
Nodes (10): PermissionMode, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 81 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 82 - "Title: Plan — Clean up files not needed by the app"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 83 - "RoomView"
Cohesion: 0.23
Nodes (3): RoomView, subagentEndStatus(), subagentSpot()

### Community 84 - "ws-client.ts"
Cohesion: 0.17
Nodes (21): ArchivedDialog(), ArchivedState, useArchivedStore, sendClientEvent(), FolderGroup, groupByFolder(), HistoryDialog(), lastSegment() (+13 more)

### Community 85 - "ref_zod"
Cohesion: 0.19
Nodes (9): ArchivedEvent, ArchivedEventSchema, FoldersEventSchema, McpStatusEvent, ArchivedRoomSchema, FolderEntrySchema, McpServerEntrySchema, McpServerStatusValueSchema (+1 more)

### Community 86 - "step-6-test-report.md"
Cohesion: 0.50
Nodes (3): Step 6 — Test Report, Test Report Template, Usage Notes

### Community 87 - "Claude Office: a pixel 2D office UI for Claude Code — Overview"
Cohesion: 0.33
Nodes (6): Claude Office: a pixel 2D office UI for Claude Code — Overview, Deferred to Later, Delivery Order, Open Questions, Stories, Summary

### Community 88 - "agent-sprite.ts"
Cohesion: 0.20
Nodes (10): AgentSprite, CLOTHES_POOL, drawBubble(), drawDot(), drawExclamation(), HAIR_POOL, hashString(), pick() (+2 more)

### Community 89 - "resume-result.dto.ts"
Cohesion: 0.14
Nodes (13): FolderErrorCode, FolderErrorCodeSchema, ResumeErrorCode, ResumeErrorCodeSchema, ResumeResultSchema, StartResult, StartResultSchema, SessionStartedEvent (+5 more)

### Community 90 - "catalog.service.ts"
Cohesion: 0.17
Nodes (9): CommandController, CommandList, CommandListSchema, McpStatusList, McpStatusListSchema, CatalogService, AsyncUtil, packages_shared_src_index_mcpserverentryschema (+1 more)

### Community 91 - "use-autocomplete-store.ts"
Cohesion: 0.19
Nodes (9): CommandRepository, AutocompleteState, ListItems, ListKind, ListState, patchRoom(), RoomLists, useAutocompleteStore (+1 more)

### Community 92 - "onboarding/SKILL.md"
Cohesion: 0.18
Nodes (7): Step 2 — Coding Conventions, Step 3 — Finish, How to Use This Skill, Onboarding Workflow, Override Notice, Project Onboarding, Purpose

### Community 93 - "IconButton"
Cohesion: 0.20
Nodes (11): IconButton(), Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Plan add-on 2 (approved) — Header actions + Esc fix, Plan add-on (approved) — Main actions icon-only, Risks & Assumptions (+3 more)

### Community 95 - "Graphify Setup"
Cohesion: 0.25
Nodes (7): Add to Claude Code, Build the graph, Graphify Setup, Install, Keep it up to date (optional), Search the graph, What you need

### Community 96 - "commands.ts"
Cohesion: 0.21
Nodes (8): CommandsEvent, CommandsEventSchema, FilesEvent, FilesEventSchema, FileEntry, FileEntrySchema, SlashCommandEntrySchema, Files in Scope

### Community 98 - ".notifyChanged"
Cohesion: 0.26
Nodes (4): ResumeResult, Functional Requirements, Risks & Assumptions, Non-Functional Requirements

### Community 99 - "room-view.ts"
Cohesion: 0.15
Nodes (18): getTile(), createBadgeBackground(), createBadgeText(), createDesk(), createFloor(), createPlant(), createSmallDesks(), createWalls() (+10 more)

### Community 100 - "Title: Plan — S3 Start a session and chat"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S3 Start a session and chat

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

### Community 108 - "Title: Web Test Plan — Sub-agent details in the MCP panel style"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Sub-agent details in the MCP panel style

### Community 109 - "Coding Conventions"
Cohesion: 0.25
Nodes (8): Code order in a file, Coding Conventions, Folder structure, Imports, Naming, Other rules, Server layers, Style (Prettier + ESLint)

### Community 110 - "folder.repository.ts"
Cohesion: 0.18
Nodes (11): HOME_DIR, Frontmatter, FileListing, SKIPPED_DIRS, FolderListing, FolderResult, packages_shared_src_index_fileentry, packages_shared_src_index_slashcommandentry (+3 more)

### Community 111 - "Spike S1: Claude Agent SDK findings"
Cohesion: 0.22
Nodes (8): How to re-run, Impact on S3 / S5 / S9, Q1 Login, Q2 Sub-agent messages, Q3 Permission callback, Setup used, Spike S1: Claude Agent SDK findings, Summary

### Community 113 - ".loadClosedRooms"
Cohesion: 0.23
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Status, Task List, Title: Plan — S7 Stop and close

### Community 114 - "Title: Plan — Resizable chat panel"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 115 - "RTK Setup"
Cohesion: 0.29
Nodes (6): Add to Claude Code, Check savings, Common commands, Install, Notes, RTK Setup

### Community 116 - "Title: Plan — S1 Spike: check the Agent SDK"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 117 - "Step 2 — Brainstorming"
Cohesion: 0.40
Nodes (5): Brainstorming Dialogue, Check the Test Scope, Classify the Intent, Step 2 — Brainstorming, Usage Notes

### Community 118 - "use-connection-store.ts"
Cohesion: 0.31
Nodes (7): ConnectionBadge(), STATUS_BG, ConnectionState, ConnectionStatus, useConnectionStore, HelloEvent, packages_shared_src_index_helloevent

### Community 119 - "Title: Web Test Report — Sub-agent details in the MCP panel style"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Sub-agent details in the MCP panel style

### Community 120 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 121 - "FolderRepository"
Cohesion: 0.33
Nodes (3): FileController, FolderController, FolderRepository

### Community 122 - "session.service.ts"
Cohesion: 0.06
Nodes (41): COMMANDS_TIMEOUT_MS, HISTORY_TEXT_MAX, MCP_STATUS_TIMEOUT_MS, ROOM_EVENT_BUFFER_MAX, STOP_TIMEOUT_MS, SUBAGENT_TOOL_EVENTS_MAX, TOOL_RESULT_MAX_CHARS, ASK_IN_CHAT_MESSAGE (+33 more)

### Community 124 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 125 - "Step 5 — Sub-Agent Result Return"
Cohesion: 0.67
Nodes (3): Step 5 — Sub-Agent Result Return, Sub-Agent Result Template, Usage Notes

### Community 126 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 127 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 128 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 129 - "RoomSummary"
Cohesion: 0.12
Nodes (16): RoomSummary, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+8 more)

### Community 133 - "history.ts"
Cohesion: 0.50
Nodes (3): HistoryEvent, HistoryEventSchema, HistoryEntrySchema

### Community 134 - "Title: Plan — 3-dots action menu for rooms (sidebar and chat header)"
Cohesion: 0.25
Nodes (7): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — 3-dots action menu for rooms (sidebar and chat header)

### Community 135 - "Title: Plan — Fix the squeezed prompt box in sub-agent details"
Cohesion: 0.33
Nodes (5): Approach Summary / Goal, Files in Scope, Risks & Assumptions, Task List, Title: Plan — Fix the squeezed prompt box in sub-agent details

### Community 136 - "Step 3 — Test Plan"
Cohesion: 0.50
Nodes (4): Planning Rules, Step 3 — Test Plan, Test Plan Template, Usage Notes

### Community 137 - "session-notice.ts"
Cohesion: 0.40
Nodes (4): SessionNoticeEvent, SessionNoticeEventSchema, SessionNoticeKind, SessionNoticeKindSchema

### Community 138 - "Data Handling"
Cohesion: 0.29
Nodes (7): Data Handling, Insecure Deserialization (CWE-502), Path Traversal (CWE-22), Sensitive Data Exposure (CWE-200, CWE-312, CWE-798), SSRF (CWE-918), Transport & Storage, XXE (CWE-611)

### Community 139 - "Authentication & Access Control"
Cohesion: 0.33
Nodes (6): Authentication & Access Control, Broken Authorization / IDOR / BOLA (CWE-284, CWE-639), CSRF (CWE-352), JWT Weaknesses, Mass Assignment (CWE-915), Session & Privilege

### Community 140 - "PermissionService"
Cohesion: 0.15
Nodes (10): PermissionService, PermissionDecision, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 141 - "Title: Plan — Add space between the Prompt box and "Tool calls""
Cohesion: 0.40
Nodes (4): Approach Summary / Goal, Files in Scope, Task List, Title: Plan — Add space between the Prompt box and "Tool calls"

### Community 142 - "subagent-finished.ts"
Cohesion: 0.40
Nodes (4): SubagentFinishedEvent, SubagentFinishedEventSchema, SubagentStatus, SubagentStatusSchema

### Community 143 - "Title: Plan — Autocomplete for `/` commands and `@` files in the chat box"
Cohesion: 0.20
Nodes (7): Approach Summary / Goal, Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Autocomplete for `/` commands and `@` files in the chat box

### Community 144 - "Title: Plan — S4 Office map, rooms, and root agents"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 145 - "Step 4 — Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels, Requests Changes, Step 4 — Approval Gate

### Community 147 - "Title: Plan — Chat header shows only MCP; all room actions in the sidebar"
Cohesion: 0.29
Nodes (6): Files in Scope, Functional Requirements, Risks & Assumptions, Status, Task List, Title: Plan — Chat header shows only MCP; all room actions in the sidebar

### Community 149 - "Title: Plan — Remove Rename from the chat header menu"
Cohesion: 0.33
Nodes (5): Files in Scope, Functional Requirements, Risks & Assumptions, Status, Title: Plan — Remove Rename from the chat header menu

### Community 150 - "Step 1 — Check Browser Permission"
Cohesion: 0.50
Nodes (4): 1. Check that the user allows the browser, 2. Check that a browser tool is available, 3. Get the target, Step 1 — Check Browser Permission

## Knowledge Gaps
- **807 isolated node(s):** `$schema`, `PreToolUse`, `name`, `version`, `private` (+802 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 885 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Coding Conventions` connect `Coding Conventions` to `onboarding/SKILL.md`?**
  _High betweenness centrality (0.271) - this node is a cross-community bridge._
- **Why does `Session` connect `SessionService` to `RoomSummary`, `.notifyChanged`, `Files in Scope`, `PermissionService`, `Coding Conventions`, `.history`, `.setPermissionMode`, `session.service.ts`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `Server layers` connect `Coding Conventions` to `SessionService`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `sendClientEvent()` (e.g. with `Files in Scope` and `Task List`) actually correct?**
  _`sendClientEvent()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ClientEvent` (e.g. with `Functional Requirements` and `Task List`) actually correct?**
  _`ClientEvent` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `main()` (e.g. with `registerWsRoute()` and `.closeAll()`) actually correct?**
  _`main()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `PreToolUse`, `name` to the rest of the system?**
  _807 weakly-connected nodes found - possible documentation gaps or missing edges._