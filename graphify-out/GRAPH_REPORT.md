# Graph Report - claude-office  (2026-11-07)

## Corpus Check
- 344 files · ~119,270 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 10, (none) 4)

## Summary
- 2240 nodes · 4408 edges · 176 communities (161 shown, 15 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 487 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9b691e06`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OfficePage.tsx
- Execution Workflow
- web/package.json
- package.json
- main.ts
- Vulnerability Categories
- ws.route.ts
- events/index.ts
- Tester
- agile-planning/SKILL.md
- server/package.json
- pull-request/SKILL.md
- compilerOptions
- main
- shared/package.json
- onboarding/SKILL.md
- catalog.service.ts
- Developer
- AAA — Arrange, Act, Assert
- .errorName
- server-event.ts
- MessageList.tsx
- Step 1 — Project Overview
- pull-request-template.md
- Pull Request
- S2 — App foundation
- ref_zod
- ClientEvent
- useChatResize.ts
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
- ChatInput.tsx
- Title: Plan — Chat header shows only MCP; all room actions in the sidebar
- EventBusService
- OfficeScene
- Step 1 — Brainstorming (Root Agent)
- Step 6 — Reply to and Resolve Threads
- server/tsconfig.json
- Files in Scope
- Files in Scope
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
- Title: Plan — UI revamp with React-Bootstrap and Bootstrap Icons
- settings.json
- Step 3 — User Approval Gate
- Step 7 — Summary Report to User
- ui.config.ts
- HistoryEntry
- S6 — Resume an old session
- shared/tsconfig.json
- chat-item.dto.ts
- subagent-sprite.ts
- RoomActionsMenu
- Title: Plan — Live result card title from the sub-agent description
- Title: Plan — S7 Stop and close
- Title: Plan — Clean up files not needed by the app
- AgentSprite
- Task List
- Title: Web Test Plan — Re-run sub-agent result card fixes
- dependencies
- Claude Office: a pixel 2D office UI for Claude Code — Overview
- Title: Web Test Report — Re-run live sub-agent result card
- resume-result.dto.ts
- Title: Plan — Autocomplete for `/` commands and `@` files in the chat box
- autocomplete-token.dto.ts
- RoomView
- GitRepository
- McpStatusPanel.tsx
- .mapPeerText
- PermissionService
- party-mode/SKILL.md
- permission-answer.ts
- RoomView
- Title: Plan — S3 Start a session and chat
- Vulnerable Package Watchlist
- SECURITY_SCANNER/ENTRY_POINT.md
- AI / LLM Security
- Report Format
- CameraController
- Security Scanner
- Secret Patterns
- Title: Web Test Plan — Sub-agent details in the MCP panel style
- Title: Web Test Plan — Live result card (after ws-client fix)
- subagent-finished.ts
- Spike S1: Claude Agent SDK findings
- PeerMessageCard
- .notifyChanged
- Title: Plan — Resizable chat panel
- main.tsx
- Title: Plan — S1 Spike: check the Agent SDK
- devDependencies
- ChatPanel.tsx
- Title: Web Test Report — Sub-agent details in the MCP panel style
- Phase 1 — Take Input
- Session
- RoomEvent
- ServerEvent
- RTK Setup
- Step 5 — Run Tests in the Browser
- session-notice.ts
- Project Onboarding
- scripts
- RoomSummary
- Step 3 — Test Plan
- Title: Plan — Match the result card style to the sub-agent and tool cards
- web-test/SKILL.md
- Title: Plan — Sub-agent result card
- Title: Web Test Report — Live result card (after ws-client fix)
- Title: Plan — Fix the squeezed prompt box in sub-agent details
- Title: Plan — Production build and start scripts
- step-6-test-report.md
- Data Handling
- Authentication & Access Control
- Title: Plan — S5 Permission prompts in the UI
- Title: Plan — Add space between the Prompt box and "Tool calls"
- CLAUDE
- SubagentSprite
- Title: Plan — Use the Claude session title as the default room name
- useChatStore.ts
- PermissionCard.tsx
- Title: Plan — Live sub-agent result card from the sub-agent transcript
- src/index.ts
- Title: Plan — Session info overlay panel (replace the strip)
- Step 1 — Check Browser Permission
- Coding Conventions
- Title: Web Test Plan — Live result card title (debug log run)
- KISS.md
- Title: Web Test Report — Live result card title (debug log run)
- SEPARATION_OF_CONCERNS.md
- Step 5 — Sub-Agent Result Return
- Title: Web Test Report — Web app after the layered refactor
- Title: Web Test Plan — Web app after the layered refactor
- ws-client.service.ts
- Title: Web Test Report — Sub-agent result card
- Title: Plan — Remove Rename from the chat header menu
- Title: Web Test Report — Re-run sub-agent result card fixes
- Title: Plan: close other panels when sub-agent details open
- Title: Web Test Plan — Re-run live sub-agent result card
- HistoryRepository
- Phase 6 — Create Tickets
- Phase 3 — Break Down Work
- Graphify Setup
- Phase 5 — Generate Docs
- folders.ts
- archived.ts
- Step 2 — Brainstorming
- vite.config.ts
- Title: Plan — Session info panel: center rows, remove copy and progress bar
- pong.ts

## God Nodes (most connected - your core abstractions)
1. `SessionService` - 43 edges
2. `Session` - 41 edges
3. `main()` - 33 edges
4. `ClientEvent` - 31 edges
5. `IconButton()` - 29 edges
6. `RoomEvent` - 29 edges
7. `ChatPanel()` - 28 edges
8. `RoomView` - 28 edges
9. `SdkEventMapperService` - 26 edges
10. `RoomSummary` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Files in Scope` --references--> `ResumeErrorCode`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/dtos/resume-result.dto.ts
- `Risks & Assumptions` --references--> `main()`  [INFERRED]
  plans/2026-11-06-09-45-14-resizable-chat-panel.md → apps/server/src/main.ts
- `Files in Scope` --references--> `PendingPermission`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/repositories/session-store.repository.ts
- `Server layers` --references--> `Session`  [INFERRED]
  .claude/references/CODING_CONVENTIONS.md → apps/server/src/repositories/session-store.repository.ts
- `Files in Scope` --references--> `SessionService`  [INFERRED]
  plans/2026-11-06-16-18-06-live-subagent-result-card-from-transcript.md → apps/server/src/services/session.service.ts

## Import Cycles
- None detected.

## Communities (176 total, 15 thin omitted)

### Community 0 - "OfficePage.tsx"
Cohesion: 0.17
Nodes (11): ChatResizeHandle(), ChatResizeHandleProps, ConnectionBadge(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, OfficePage(), AppLayout() (+3 more)

### Community 1 - "Execution Workflow"
Cohesion: 0.18
Nodes (11): Execution Workflow, Step 10 — Propose Patches, Step 1 — Find the Scope and Look Around, Step 2 — Dependency Audit (SCA), Step 3 — Secrets & Exposure Scan, Step 4 — Static Analysis (SAST), Step 5 — Vulnerability Deep Scan, Step 6 — AI / LLM Security (+3 more)

### Community 3 - "web/package.json"
Cohesion: 0.18
Nodes (10): @claude-office/shared, @types/node, zod, name, private, type, version, bootstrap-icons (+2 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (32): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, globals, prettier, typescript, typescript-eslint (+24 more)

### Community 5 - "main.ts"
Cohesion: 0.07
Nodes (35): ALLOWED_ORIGINS, DATA_DIR, HOME_DIR, HOST, IS_PRODUCTION, LOG_LEVEL, LOG_LEVELS, LogLevel (+27 more)

### Community 6 - "Vulnerability Categories"
Cohesion: 0.20
Nodes (9): Business Logic, Command Injection (CWE-78), Cross-Site Scripting — XSS (CWE-79), Cryptography, Injection, Input Validation, Other Injection Sinks, SQL Injection (CWE-89) (+1 more)

### Community 7 - "ws.route.ts"
Cohesion: 0.35
Nodes (4): WsRouteOptions, ErrorUtil, WsSendUtil, fastify

### Community 8 - "events/index.ts"
Cohesion: 0.06
Nodes (35): ArchivedListEvent, ArchivedListEventSchema, ClientEventSchema, CommandsListEventSchema, ErrorEventSchema, FilesListEvent, FilesListEventSchema, FoldersListEvent (+27 more)

### Community 9 - "Tester"
Cohesion: 0.12
Nodes (16): Additional Skill References, Code-First, Constraints, Delegation Prompt Template, Failure Modes, Inputs, Note for Code-First and Test-First, Outputs (+8 more)

### Community 10 - "agile-planning/SKILL.md"
Cohesion: 0.11
Nodes (14): AGENT RULES, DO, DO NOT, 2a. Ask clarifying questions first, 2b. Look at the codebase (read-only), 2c. Write the analysis, Phase 2 — Brainstorm, 4a. Find a reference story (+6 more)

### Community 11 - "server/package.json"
Cohesion: 0.06
Nodes (34): dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, @claude-office/shared, fastify, @fastify/static, @fastify/websocket, zod (+26 more)

### Community 12 - "pull-request/SKILL.md"
Cohesion: 0.13
Nodes (7): Step 3 — Choose the Target Branch, Step 4 — Collect Context, Step 5 — Fill the Template, Step 7 — Summary Report, Suggested format, Step 4 — Check That the Code Matches the Requirements, Step 9 — Write the Review Report

### Community 13 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, esModuleInterop, isolatedModules, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+5 more)

### Community 15 - "shared/package.json"
Cohesion: 0.15
Nodes (12): dependencies, zod, exports, zod, main, name, private, scripts (+4 more)

### Community 16 - "onboarding/SKILL.md"
Cohesion: 0.19
Nodes (5): graphify, graphify, PROJECT OVERVIEW, Step 2 — Coding Conventions, Step 3 — Finish

### Community 17 - "catalog.service.ts"
Cohesion: 0.17
Nodes (7): COMMANDS_TIMEOUT_MS, MCP_STATUS_TIMEOUT_MS, CommandList, CommandListSchema, McpStatusList, McpStatusListSchema, AsyncUtil

### Community 18 - "Developer"
Cohesion: 0.18
Nodes (11): Additional Skill References, Constraints, Delegation Prompt Template, Developer, Failure Modes, Inputs, Outputs, Position in the Workflow (+3 more)

### Community 19 - "AAA — Arrange, Act, Assert"
Cohesion: 0.18
Nodes (8): AAA — Arrange, Act, Assert, Common Violations, Rules, Shared Arrange, Test Naming, The Pattern, Step 5 — Load Guides, Step 8 — Apply AAA Testing Review

### Community 21 - "server-event.ts"
Cohesion: 0.08
Nodes (31): AssistantTextEvent, AssistantTextEventSchema, AuthErrorEvent, AuthErrorEventSchema, CommandsEventSchema, HelloEventSchema, PeerMessageEventSchema, PermissionRequestEvent (+23 more)

### Community 22 - "MessageList.tsx"
Cohesion: 0.18
Nodes (16): AuthErrorNotice(), AuthErrorNoticeProps, ExternalLink(), ExternalLinkProps, ToolCard(), PermissionCard(), ChatItemView(), ChatItemViewProps (+8 more)

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

### Community 27 - "ref_zod"
Cohesion: 0.10
Nodes (20): McpStatusEvent, McpStatusEventSchema, RoomPermissionModeEvent, RoomPermissionModeEventSchema, SessionStartedEvent, SessionStartedEventSchema, SessionStateEventSchema, SessionsEvent (+12 more)

### Community 28 - "ClientEvent"
Cohesion: 0.14
Nodes (6): RoomController, SessionController, dispatch(), registerWsRoute(), ClientEvent, ErrorEvent

### Community 29 - "useChatResize.ts"
Cohesion: 0.19
Nodes (16): CHAT_WIDTH_STORAGE_KEY, DRAGGING_CLASS, MAX_REM, MIN_CANVAS_REM, MIN_REM, WidthBounds, WidthBoundsSchema, ChatResize (+8 more)

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

### Community 40 - "ChatInput.tsx"
Cohesion: 0.12
Nodes (14): AutocompletePopup(), AutocompletePopupProps, FolderPicker(), FolderPickerProps, ChatInput(), onKeyDown(), submit(), ChatInputProps (+6 more)

### Community 41 - "Title: Plan — Chat header shows only MCP; all room actions in the sidebar"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Functional Requirements, Risks & Assumptions, Status, Task List, Title: Plan — Chat header shows only MCP; all room actions in the sidebar

### Community 42 - "EventBusService"
Cohesion: 0.12
Nodes (3): RoomRepository, SessionStoreRepository, EventBusService

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
Cohesion: 0.12
Nodes (23): parseClientEvent(), ParseFailure, ParseResult, parseWith(), readEventType(), safeJsonParse(), parseServerEvent(), Approach Summary / Goal (+15 more)

### Community 48 - "Files in Scope"
Cohesion: 0.10
Nodes (16): parseRoomRow(), RoomRow, InputQueue, ArchivedRoom, Files in Scope, Files in Scope, Approach Summary / Goal, Code style per layer (+8 more)

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

### Community 69 - "Title: Plan — UI revamp with React-Bootstrap and Bootstrap Icons"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Plan add-on (approved) — Main actions icon-only, Risks & Assumptions, Status, Task List (+1 more)

### Community 70 - "settings.json"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, $schema

### Community 71 - "Step 3 — User Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels / Aborts, Requests Changes, Step 3 — User Approval Gate

### Community 72 - "Step 7 — Summary Report to User"
Cohesion: 0.50
Nodes (3): Step 7 — Summary Report to User, Summary Report Template, Usage Notes

### Community 73 - "ui.config.ts"
Cohesion: 0.12
Nodes (16): ConnectionBadgeProps, PeerMessageCardProps, ToolCardProps, ToolStatus, CONNECTION_STATUS_BG, ModeOption, PEER_CARD_TEXT, PERMISSION_MODE_BY_VALUE (+8 more)

### Community 74 - "HistoryEntry"
Cohesion: 0.13
Nodes (11): FolderGroup, HistoryUtil, HistoryEntry, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 75 - "S6 — Resume an old session"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S6 — Resume an old session (+2 more)

### Community 76 - "shared/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.base.json

### Community 77 - "chat-item.dto.ts"
Cohesion: 0.14
Nodes (12): SubagentCardProps, SUBAGENT_STATUS_BG, ChatItem, ChatItemSchema, SubagentItem, SubagentItemSchema, SubagentTool, SubagentToolSchema (+4 more)

### Community 78 - "subagent-sprite.ts"
Cohesion: 0.11
Nodes (20): GameCanvas(), RenamePlaceSchema, RenameTarget, RenameTargetSchema, ScreenRect, ScreenRectSchema, TilePos, loadSheets() (+12 more)

### Community 79 - "RoomActionsMenu"
Cohesion: 0.09
Nodes (33): CloseConfirmDialog(), CloseConfirmDialogProps, Confirming, RoomAction, RoomActionsMenu(), request(), send(), RoomActionsMenuProps (+25 more)

### Community 80 - "Title: Plan — Live result card title from the sub-agent description"
Cohesion: 0.11
Nodes (13): TaskNotification, TaskNotificationStatus, TaskNotificationUtil, Task List, Failures, TC-07 — Live result shows a card, Approach Summary / Goal, Functional Requirements (+5 more)

### Community 81 - "Title: Plan — S7 Stop and close"
Cohesion: 0.16
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 82 - "Title: Plan — Clean up files not needed by the app"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 84 - "Task List"
Cohesion: 0.15
Nodes (13): ReportStatus, ReportStatusUtil, ReportStatusValue, Task List, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements (+5 more)

### Community 85 - "Title: Web Test Plan — Re-run sub-agent result card fixes"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Re-run sub-agent result card fixes

### Community 86 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bootstrap, bootstrap-icons, @claude-office/shared, pixi.js, react, react-bootstrap, react-dom (+4 more)

### Community 87 - "Claude Office: a pixel 2D office UI for Claude Code — Overview"
Cohesion: 0.33
Nodes (6): Claude Office: a pixel 2D office UI for Claude Code — Overview, Deferred to Later, Delivery Order, Open Questions, Stories, Summary

### Community 88 - "Title: Web Test Report — Re-run live sub-agent result card"
Cohesion: 0.29
Nodes (6): Blocked / Skipped, Console and Network Problems, Next Steps, Result Summary, Test Results, Title: Web Test Report — Re-run live sub-agent result card

### Community 89 - "resume-result.dto.ts"
Cohesion: 0.24
Nodes (7): FolderErrorCode, FolderErrorCodeSchema, ResumeErrorCode, ResumeErrorCodeSchema, ResumeResultSchema, StartResult, StartResultSchema

### Community 90 - "Title: Plan — Autocomplete for `/` commands and `@` files in the chat box"
Cohesion: 0.12
Nodes (14): CommandsEvent, CommandsListEvent, FilesEvent, FilesEventSchema, FileEntrySchema, Approach Summary / Goal, Files in Scope, Functional Requirements (+6 more)

### Community 91 - "autocomplete-token.dto.ts"
Cohesion: 0.06
Nodes (38): CommandRepository, AUTOCOMPLETE_MAX_ROWS, AUTOCOMPLETE_POPUP_ID, AUTOCOMPLETE_STALE_MS, AutocompleteRows, AutocompleteRowsSchema, AutocompleteToken, AutocompleteTokenSchema (+30 more)

### Community 92 - "RoomView"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 93 - "GitRepository"
Cohesion: 0.08
Nodes (24): GH_TIMEOUT_MS, GIT_HOST_PROVIDERS, GIT_TIMEOUT_MS, GLAB_TIMEOUT_MS, GitRepository, PrCommand, PrInfo, GitProvider (+16 more)

### Community 94 - "McpStatusPanel.tsx"
Cohesion: 0.19
Nodes (11): McpRow(), McpStatusPanelProps, PanelBody(), MCP_STATUS_BG, MCP_STATUS_LABEL, MCP_STATUS_ORDER, McpRoomStatus, McpRoomStatusSchema (+3 more)

### Community 95 - ".mapPeerText"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — Fix sub-agent result card (task notifications and bold status)

### Community 98 - "permission-answer.ts"
Cohesion: 0.50
Nodes (3): PermissionAnswerEvent, PermissionAnswerEventSchema, PermissionDecisionSchema

### Community 99 - "RoomView"
Cohesion: 0.17
Nodes (3): getTile(), RoomView, Point

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

### Community 109 - "Title: Web Test Plan — Live result card (after ws-client fix)"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Live result card (after ws-client fix)

### Community 110 - "subagent-finished.ts"
Cohesion: 0.40
Nodes (4): SubagentFinishedEvent, SubagentFinishedEventSchema, SubagentStatus, SubagentStatusSchema

### Community 111 - "Spike S1: Claude Agent SDK findings"
Cohesion: 0.22
Nodes (8): How to re-run, Impact on S3 / S5 / S9, Q1 Login, Q2 Sub-agent messages, Q3 Permission callback, Setup used, Spike S1: Claude Agent SDK findings, Summary

### Community 112 - "PeerMessageCard"
Cohesion: 0.15
Nodes (13): peerDetail(), PeerMessageCard(), MessageList(), selectRoomItems(), Approach Summary / Goal, Goal, Open Questions / Blockers, Preconditions (+5 more)

### Community 113 - ".notifyChanged"
Cohesion: 0.28
Nodes (3): ResumeResult, Files in Scope, Task List

### Community 114 - "Title: Plan — Resizable chat panel"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 115 - "main.tsx"
Cohesion: 0.14
Nodes (3): container, bootstrap, react-dom

### Community 116 - "Title: Plan — S1 Spike: check the Agent SDK"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 117 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/node, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 118 - "ChatPanel.tsx"
Cohesion: 0.08
Nodes (35): ChatPanel(), McpStatusPanel(), Row(), RowProps, SessionInfoPanel(), SessionInfoPanelProps, selectSubagent(), SubagentDetails() (+27 more)

### Community 119 - "Title: Web Test Report — Sub-agent details in the MCP panel style"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Sub-agent details in the MCP panel style

### Community 120 - "Phase 1 — Take Input"
Cohesion: 0.40
Nodes (4): 1a. Find the input source, 1b. Find the input type, 1c. Show what you got, Phase 1 — Take Input

### Community 121 - "Session"
Cohesion: 0.19
Nodes (13): Session, SessionInfoService, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+5 more)

### Community 122 - "RoomEvent"
Cohesion: 0.24
Nodes (6): MapperState, SubagentState, SdkEventMapperService, RoomEvent, Files in Scope, Task List

### Community 123 - "ServerEvent"
Cohesion: 0.24
Nodes (10): ServerEvent, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 124 - "RTK Setup"
Cohesion: 0.29
Nodes (6): Add to Claude Code, Check savings, Common commands, Install, Notes, RTK Setup

### Community 125 - "Step 5 — Run Tests in the Browser"
Cohesion: 0.33
Nodes (5): 1. Start the browser, 2. Run each test case, 3. Browser safety rules, 4. Finish, Step 5 — Run Tests in the Browser

### Community 126 - "session-notice.ts"
Cohesion: 0.20
Nodes (7): HistoryEvent, HistoryEventSchema, SessionNoticeEvent, SessionNoticeEventSchema, HistoryEntrySchema, SessionNoticeKind, SessionNoticeKindSchema

### Community 127 - "Project Onboarding"
Cohesion: 0.40
Nodes (5): How to Use This Skill, Onboarding Workflow, Override Notice, Project Onboarding, Purpose

### Community 128 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, typecheck

### Community 129 - "RoomSummary"
Cohesion: 0.15
Nodes (12): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Server, Shared (+4 more)

### Community 130 - "Step 3 — Test Plan"
Cohesion: 0.50
Nodes (4): Planning Rules, Step 3 — Test Plan, Test Plan Template, Usage Notes

### Community 131 - "Title: Plan — Match the result card style to the sub-agent and tool cards"
Cohesion: 0.18
Nodes (11): SubagentCard(), Task List, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 132 - "web-test/SKILL.md"
Cohesion: 0.24
Nodes (7): Approved, Cancels, Requests Changes, Step 4 — Approval Gate, Constraints, Step-by-Step Instructions, Web Test

### Community 133 - "Title: Plan — Sub-agent result card"
Cohesion: 0.22
Nodes (8): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Sub-agent result card

### Community 134 - "Title: Web Test Report — Live result card (after ws-client fix)"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Evidence, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Live result card (after ws-client fix)

### Community 135 - "Title: Plan — Fix the squeezed prompt box in sub-agent details"
Cohesion: 0.33
Nodes (5): Approach Summary / Goal, Files in Scope, Risks & Assumptions, Task List, Title: Plan — Fix the squeezed prompt box in sub-agent details

### Community 136 - "Title: Plan — Production build and start scripts"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 137 - "step-6-test-report.md"
Cohesion: 0.50
Nodes (3): Step 6 — Test Report, Test Report Template, Usage Notes

### Community 138 - "Data Handling"
Cohesion: 0.29
Nodes (7): Data Handling, Insecure Deserialization (CWE-502), Path Traversal (CWE-22), Sensitive Data Exposure (CWE-200, CWE-312, CWE-798), SSRF (CWE-918), Transport & Storage, XXE (CWE-611)

### Community 139 - "Authentication & Access Control"
Cohesion: 0.33
Nodes (6): Authentication & Access Control, Broken Authorization / IDOR / BOLA (CWE-284, CWE-639), CSRF (CWE-352), JWT Weaknesses, Mass Assignment (CWE-915), Session & Privilege

### Community 140 - "Title: Plan — S5 Permission prompts in the UI"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 141 - "Title: Plan — Add space between the Prompt box and "Tool calls""
Cohesion: 0.40
Nodes (4): Approach Summary / Goal, Files in Scope, Task List, Title: Plan — Add space between the Prompt box and "Tool calls"

### Community 142 - "CLAUDE"
Cohesion: 0.50
Nodes (4): AGENT RULES, CLAUDE, CODING CONVENTIONS, PROJECT OVERVIEW

### Community 144 - "Title: Plan — Use the Claude session title as the default room name"
Cohesion: 0.20
Nodes (7): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — Use the Claude session title as the default room name

### Community 145 - "useChatStore.ts"
Cohesion: 0.31
Nodes (9): appendAssistantText(), applyRoomEvent(), ChatByRoom, ChatState, EMPTY_ITEMS, setPermissionStatus(), TASK_STATUS_TO_SUBAGENT, updateSubagent() (+1 more)

### Community 146 - "PermissionCard.tsx"
Cohesion: 0.25
Nodes (7): PermissionCardProps, PERMISSION_STATUS_BG, PERMISSION_STATUS_LABELS, PermissionItem, PermissionItemSchema, PermissionStatus, PermissionStatusSchema

### Community 147 - "Title: Plan — Live sub-agent result card from the sub-agent transcript"
Cohesion: 0.16
Nodes (9): SubagentTranscriptRepository, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+1 more)

### Community 148 - "src/index.ts"
Cohesion: 0.07
Nodes (32): HISTORY_TEXT_MAX, ROOM_EVENT_BUFFER_MAX, STOP_TIMEOUT_MS, SUBAGENT_TOOL_EVENTS_MAX, TASK_TITLE_MAX, TOOL_RESULT_MAX_CHARS, TRANSCRIPT_READ_DELAY_MS, TRANSCRIPT_READ_RETRIES (+24 more)

### Community 149 - "Title: Plan — Session info overlay panel (replace the strip)"
Cohesion: 0.17
Nodes (9): TokenFormatUtil, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+1 more)

### Community 150 - "Step 1 — Check Browser Permission"
Cohesion: 0.40
Nodes (4): 1. Check that the user allows the browser, 2. Check that a browser tool is available, 3. Get the target, Step 1 — Check Browser Permission

### Community 151 - "Coding Conventions"
Cohesion: 0.22
Nodes (9): Code order in a file, Coding Conventions, Folder structure, Imports, Naming, Other rules, Server layers, Style (Prettier + ESLint) (+1 more)

### Community 152 - "Title: Web Test Plan — Live result card title (debug log run)"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Live result card title (debug log run)

### Community 154 - "Title: Web Test Report — Live result card title (debug log run)"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-07 — Live result shows a card with the right title, Test Results, Title: Web Test Report — Live result card title (debug log run)

### Community 156 - "Step 5 — Sub-Agent Result Return"
Cohesion: 0.67
Nodes (3): Step 5 — Sub-Agent Result Return, Sub-Agent Result Template, Usage Notes

### Community 157 - "Title: Web Test Report — Web app after the layered refactor"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Web app after the layered refactor

### Community 158 - "Title: Web Test Plan — Web app after the layered refactor"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Web app after the layered refactor

### Community 159 - "ws-client.service.ts"
Cohesion: 0.19
Nodes (15): IconButton(), IconButtonProps, ArchivedDialog(), HeaderActions(), HistoryDialog(), buildWsUrl(), INITIAL_BACKOFF_MS, MAX_BACKOFF_MS (+7 more)

### Community 160 - "Title: Web Test Report — Sub-agent result card"
Cohesion: 0.20
Nodes (9): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-03 — Status badge matches the report, TC-07 — Live hand-back shows a card, Test Results (+1 more)

### Community 161 - "Title: Plan — Remove Rename from the chat header menu"
Cohesion: 0.25
Nodes (8): RenamePlace, Approach Summary / Goal, Files in Scope, Functional Requirements, Risks & Assumptions, Status, Task List, Title: Plan — Remove Rename from the chat header menu

### Community 162 - "Title: Web Test Report — Re-run sub-agent result card fixes"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-07 — Live result shows a card, Test Results, Title: Web Test Report — Re-run sub-agent result card fixes

### Community 163 - "Title: Plan: close other panels when sub-agent details open"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Task List, Title: Plan: close other panels when sub-agent details open

### Community 164 - "Title: Web Test Plan — Re-run live sub-agent result card"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Re-run live sub-agent result card

### Community 166 - "Phase 6 — Create Tickets"
Cohesion: 0.22
Nodes (8): 6a. Choose where to create the tickets, 6b. Create story tickets, 6c. Create task tickets, 6d. Update the overview, 6e. Show a summary, MCP Reference, No MCP — use the browser, Phase 6 — Create Tickets

### Community 167 - "Phase 3 — Break Down Work"
Cohesion: 0.25
Nodes (8): 3a. Epic → User Stories, 3b. User Story → Tasks, Dependencies, How to split a big story, Output format, Phase 3 — Break Down Work, What counts as a user story, What is NOT a user story

### Community 168 - "Graphify Setup"
Cohesion: 0.25
Nodes (7): Add to Claude Code, Build the graph, Graphify Setup, Install, Keep it up to date (optional), Search the graph, What you need

### Community 169 - "Phase 5 — Generate Docs"
Cohesion: 0.25
Nodes (7): After writing, File path, Overview file, Overview template, Phase 5 — Generate Docs, Rules, Story doc template

### Community 170 - "folders.ts"
Cohesion: 0.40
Nodes (4): FoldersEvent, FoldersEventSchema, FolderEntry, FolderEntrySchema

### Community 171 - "archived.ts"
Cohesion: 0.50
Nodes (3): ArchivedEvent, ArchivedEventSchema, ArchivedRoomSchema

### Community 172 - "Step 2 — Brainstorming"
Cohesion: 0.40
Nodes (5): Brainstorming Dialogue, Check the Test Scope, Classify the Intent, Step 2 — Brainstorming, Usage Notes

### Community 174 - "Title: Plan — Session info panel: center rows, remove copy and progress bar"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Task List, Title: Plan — Session info panel: center rows, remove copy and progress bar

## Knowledge Gaps
- **18 isolated node(s):** `@claude-office/shared`, `zod`, `@types/better-sqlite3`, `@types/node`, `@types/ws` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1047 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Coding Conventions` connect `Coding Conventions` to `onboarding/SKILL.md`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `SessionService` (e.g. with `Task List` and `Files in Scope`) actually correct?**
  _`SessionService` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@claude-office/shared`, `zod`, `@types/better-sqlite3` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06417112299465241 - nodes in this community are weakly interconnected._
- **Why does `Session` connect `Session` to `PermissionService`, `ws.route.ts`, `EventBusService`, `Files in Scope`, `.notifyChanged`, `src/index.ts`, `.errorName`, `Coding Conventions`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Session` (e.g. with `Server layers` and `Files in Scope`) actually correct?**
  _`Session` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06848357791754019 - nodes in this community are weakly interconnected._