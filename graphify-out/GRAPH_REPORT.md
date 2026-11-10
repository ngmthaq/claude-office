# Graph Report - claude-office  (2026-11-10)

## Corpus Check
- 438 files · ~155,989 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 12, (none) 5)

## Summary
- 3007 nodes · 5862 edges · 218 communities (203 shown, 15 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 599 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd66cc7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- attachment.service.ts
- Execution Workflow
- Files in Scope
- package.json
- main.ts
- Vulnerability Categories
- chat-item.dto.ts
- events/index.ts
- Tester
- agile-planning/SKILL.md
- server/package.json
- pull-request/SKILL.md
- compilerOptions
- cli/package.json
- shared/package.json
- AGENT_RULES.md
- useChatStore.ts
- Developer
- AAA — Arrange, Act, Assert
- SessionService
- server-event.ts
- UsageLimitService
- ui.config.ts
- pull-request-template.md
- Pull Request
- S2 — App foundation
- models/index.ts
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
- Title: Plan — Connect all rooms with a lobby
- main
- limits.config.ts
- OfficeScene
- Step 1 — Brainstorming (Root Agent)
- Step 6 — Reply to and Resolve Threads
- server/tsconfig.json
- Files in Scope
- version.js
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
- CodeViewerDialog.tsx
- Step 3 — Fetch the Code Diff
- Step 2 — Find the Target PR
- Title: Plan — Sub-agent result card
- settings.json
- Step 3 — User Approval Gate
- .history
- Session
- CameraController
- S6 — Resume an old session
- shared/tsconfig.json
- cli.config.ts
- Title: Plan — Stack Send, Stop, and mode buttons in one column
- IconButton
- Title: Plan — Live result card title from the sub-agent description
- Title: Plan — Sub-agent name labels on the top layer, and shorter labels
- Title: Plan — Clean up files not needed by the app
- AgentSprite
- Title: Plan: change usage badge text order and add spacing
- Title: Web Test Plan — Re-run sub-agent result card fixes
- dependencies
- Claude Office: a pixel 2D office UI for Claude Code — Overview
- MessageList.tsx
- resume-result.dto.ts
- Title: Plan — Autocomplete for `/` commands and `@` files in the chat box
- ChatInput.tsx
- session.service.ts
- FileRepository
- Title: Plan — Move the attach button below Send and Stop
- Title: Plan — Header uses the Claude Code orange as its accent
- McpStatusPanel.tsx
- .mapPeerText
- RoomView
- Title: Plan — S3 Start a session and chat
- Vulnerable Package Watchlist
- SECURITY_SCANNER/ENTRY_POINT.md
- SdkEventContentUtil
- ServerEvent
- Title: Plan — S7 Stop and close
- AttachmentUtil
- Secret Patterns
- Title: Web Test Plan — Sub-agent details in the MCP panel style
- Title: Web Test Plan — Live result card (after ws-client fix)
- Title: Plan: close other panels when sub-agent details open
- Title: Plan — Bigger code viewer modal with a fixed-width sidebar
- Title: Web Test Report — AskUserQuestion card
- Title: Plan — Replace Kenney art with 2dpig Pixel Office
- Title: Plan — Resizable chat panel
- main.tsx
- Title: Plan — S1 Spike: check the Agent SDK
- onboarding/SKILL.md
- SubagentTranscriptRepository
- Title: Web Test Report — Sub-agent details in the MCP panel style
- CodeEditorView.tsx
- GitRepository
- RoomEvent
- Coding Conventions
- code-viewer.controller.ts
- Files in Scope
- Title: Plan — AskUserQuestion stepper card
- AttachmentService
- .doResume
- RoomSummary
- web-test/SKILL.md
- ws-client.service.ts
- Title: Plan — Publish claude-office as the `@ngmthaq20/claude-office` npm CLI
- web/package.json
- Title: Web Test Report — Live result card (after ws-client fix)
- Title: Plan — Fix the squeezed prompt box in sub-agent details
- Title: Plan — Production build and start scripts
- Title: Plan — Attach files to a chat message (no history)
- Data Handling
- Graphify Setup
- Title: Plan — S5 Permission prompts in the UI
- Title: Plan — Add space between the Prompt box and "Tool calls"
- Title: Plan — Draw empty slots as vacant offices
- ask-user-question.dto.ts
- TranscriptSystemRowsRepository
- react
- ChatPanel.tsx
- Title: Plan — S5 Permission prompts in the UI
- Title: Plan — Remove right corridor, fill room gaps, speed up sub-agents
- autocomplete-token.dto.ts
- Title: Plan — Fix code viewer diff layout and diff editor unmount error
- Step 1 — Project Overview
- Title: Web Test Plan — Live result card title (debug log run)
- src/index.ts
- Title: Web Test Report — Live result card title (debug log run)
- Title: Web Test Plan — AskUserQuestion stepper card
- RTK Setup
- Title: Web Test Report — Web app after the layered refactor
- OfficePage.tsx
- commands.ts
- Title: Web Test Report — Sub-agent result card
- Title: Web Test Plan — Web app after the layered refactor
- Title: Web Test Report — Re-run sub-agent result card fixes
- PermissionCard.tsx
- Title: Web Test Plan — Re-run live sub-agent result card
- HistoryRepository
- Title: Web Test Plan — Sub-agent label size, bubble layer, and stacked Send/Stop
- Title: Plan — Smaller sub-agent name and message bubbles on top
- ChatPanel
- room-view.ts
- Title: Web Test Report — Sub-agent label size, bubble layer, and stacked Send/Stop
- Title: Web Test Plan — AskUserQuestion card
- Title: Web Test Plan — Read-only code viewer
- Title: Web Test Plan — Re-check sub-agent labels on the top layer
- Title: Plan — Session info panel: center rows, remove copy and progress bar
- Title: Web Test Report — Read-only code viewer
- Project Onboarding
- Title: Web Test Report — Re-check sub-agent labels on the top layer
- Title: Web Test Report — AskUserQuestion stepper card
- Title: Web Test Plan — Header orange accent and text CTAs in modals and cards
- Title: Web Test Report — Header orange accent and text CTAs in modals and cards
- Title: Plan — S2 App foundation
- Step 1 — Check Browser Permission
- cli/tsconfig.json
- Step 2 — Brainstorming
- @ngmthaq20/claude-office
- Step 5 — Run Tests in the Browser
- session-notice.ts
- Title: Plan — Fallback card history fix (read cards from the transcript file)
- subagent-finished.ts
- devDependencies
- AskUserQuestionCard
- Spike S1: Claude Agent SDK findings
- KISS.md
- Step 7 — Summary Report to User
- PermissionService
- SEPARATION_OF_CONCERNS.md
- step-6-test-report.md
- Step 5 — Sub-Agent Result Return
- ErrorBoundary
- Title: Plan — Use the Claude session title as the default room name
- events/usage-limit.ts
- DRY.md
- Title: Web Test Plan — Attach files to a chat message
- Title: Web Test Report — Attach files to a chat message
- Files in Scope
- .setPermissionMode
- Title: Web Test Report — Re-run live sub-agent result card
- AI / LLM Security
- Report Format
- Authentication & Access Control
- ref_zod
- Security Scanner
- permission-answer.ts
- Step 10 — Offer to Post Review (File + Line Comments)
- archived.ts
- scripts
- pong.ts

## God Nodes (most connected - your core abstractions)
1. `SessionService` - 46 edges
2. `Session` - 43 edges
3. `RoomEvent` - 42 edges
4. `RoomView` - 38 edges
5. `ChatPanel()` - 37 edges
6. `main()` - 36 edges
7. `ClientEvent` - 34 edges
8. `SdkEventMapperService` - 32 edges
9. `react` - 31 edges
10. `EventBusService` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Files in Scope` --references--> `ResumeErrorCode`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/dtos/resume-result.dto.ts
- `Code style per layer` --references--> `parseRoomRow()`  [INFERRED]
  plans/2026-11-06-14-13-38-server-layered-structure.md → apps/server/src/dtos/room-row.dto.ts
- `Server layers` --references--> `Session`  [INFERRED]
  .claude/references/CODING_CONVENTIONS.md → apps/server/src/repositories/session-store.repository.ts
- `Files in Scope` --references--> `SessionService`  [INFERRED]
  plans/2026-11-06-16-18-06-live-subagent-result-card-from-transcript.md → apps/server/src/services/session.service.ts
- `Non-Functional Requirements` --references--> `ExternalLink()`  [INFERRED]
  plans/2026-11-06-15-50-17-subagent-result-card.md → apps/web/src/components/atoms/ExternalLink.tsx

## Import Cycles
- None detected.

## Communities (218 total, 15 thin omitted)

### Community 0 - "attachment.service.ts"
Cohesion: 0.09
Nodes (23): ATTACHED_FILE_TAG, Checked, ContentBlock, PrepareResult, ATTACHMENT_RESIZE, AttachmentDraft, AttachmentDraftSchema, ChatAttachments (+15 more)

### Community 1 - "Execution Workflow"
Cohesion: 0.18
Nodes (11): Execution Workflow, Step 10 — Propose Patches, Step 1 — Find the Scope and Look Around, Step 2 — Dependency Audit (SCA), Step 3 — Secrets & Exposure Scan, Step 4 — Static Analysis (SAST), Step 5 — Vulnerability Deep Scan, Step 6 — AI / LLM Security (+3 more)

### Community 3 - "Files in Scope"
Cohesion: 0.13
Nodes (10): RoomController, parseRoomRow(), RawRoomRow, RoomRow, RoomRowSchema, RoomRepository, RoomService, ArchivedRoom (+2 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (40): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, globals, husky, prettier, typescript (+32 more)

### Community 5 - "main.ts"
Cohesion: 0.09
Nodes (25): ALLOWED_ORIGINS, DATA_DIR, findServerRoot(), HOME_DIR, HOST, IS_PRODUCTION, LOG_LEVEL, LOG_LEVELS (+17 more)

### Community 6 - "Vulnerability Categories"
Cohesion: 0.20
Nodes (9): Business Logic, Command Injection (CWE-78), Cross-Site Scripting — XSS (CWE-79), Cryptography, Injection, Input Validation, Other Injection Sinks, SQL Injection (CWE-89) (+1 more)

### Community 7 - "chat-item.dto.ts"
Cohesion: 0.12
Nodes (13): ToolCardProps, ToolStatus, TOOL_STATUS_BG, ChatItem, ChatItemSchema, SubagentItemSchema, SubagentTool, SubagentToolSchema (+5 more)

### Community 8 - "events/index.ts"
Cohesion: 0.06
Nodes (36): ArchivedListEvent, ArchivedListEventSchema, ClientEventSchema, CodeFileGetEvent, CodeFileGetEventSchema, CodeTreeListEvent, CodeTreeListEventSchema, ErrorEventSchema (+28 more)

### Community 9 - "Tester"
Cohesion: 0.12
Nodes (16): Additional Skill References, Code-First, Constraints, Delegation Prompt Template, Failure Modes, Inputs, Note for Code-First and Test-First, Outputs (+8 more)

### Community 10 - "agile-planning/SKILL.md"
Cohesion: 0.05
Nodes (38): 1a. Find the input source, 1b. Find the input type, 1c. Show what you got, Phase 1 — Take Input, 2a. Ask clarifying questions first, 2b. Look at the codebase (read-only), 2c. Write the analysis, Phase 2 — Brainstorm (+30 more)

### Community 11 - "server/package.json"
Cohesion: 0.06
Nodes (35): dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, @claude-office/shared, fastify, @fastify/static, @fastify/websocket, zod (+27 more)

### Community 12 - "pull-request/SKILL.md"
Cohesion: 0.13
Nodes (7): Step 3 — Choose the Target Branch, Step 4 — Collect Context, Step 5 — Fill the Template, Step 7 — Summary Report, Suggested format, Step 4 — Check That the Code Matches the Requirements, Step 9 — Write the Review Report

### Community 13 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, esModuleInterop, isolatedModules, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+5 more)

### Community 14 - "cli/package.json"
Cohesion: 0.05
Nodes (36): bin, claude-office, dependencies, @anthropic-ai/claude-agent-sdk, better-sqlite3, fastify, @fastify/static, @fastify/websocket (+28 more)

### Community 15 - "shared/package.json"
Cohesion: 0.15
Nodes (12): dependencies, zod, exports, zod, main, name, private, scripts (+4 more)

### Community 16 - "AGENT_RULES.md"
Cohesion: 0.17
Nodes (9): AGENT RULES, CLAUDE, CODING CONVENTIONS, graphify, graphify, PROJECT OVERVIEW, AGENT RULES, DO (+1 more)

### Community 17 - "useChatStore.ts"
Cohesion: 0.17
Nodes (13): InternalEventsRowProps, INTERNAL_EVENTS_TEXT, INTERNAL_ITEMS_KEEP_MAX, appendAssistantText(), appendInternalEvents(), applyRoomEvent(), ChatByRoom, ChatState (+5 more)

### Community 18 - "Developer"
Cohesion: 0.18
Nodes (11): Additional Skill References, Constraints, Delegation Prompt Template, Developer, Failure Modes, Inputs, Outputs, Position in the Workflow (+3 more)

### Community 19 - "AAA — Arrange, Act, Assert"
Cohesion: 0.18
Nodes (8): AAA — Arrange, Act, Assert, Common Violations, Rules, Shared Arrange, Test Naming, The Pattern, Step 5 — Load Guides, Step 8 — Apply AAA Testing Review

### Community 20 - "SessionService"
Cohesion: 0.24
Nodes (3): Session, LoadSkipped, SessionService

### Community 21 - "server-event.ts"
Cohesion: 0.07
Nodes (36): AssistantTextEvent, AssistantTextEventSchema, AuthErrorEvent, AuthErrorEventSchema, CodeTreeEventSchema, FilesEventSchema, HelloEvent, HelloEventSchema (+28 more)

### Community 22 - "UsageLimitService"
Cohesion: 0.15
Nodes (13): UsageLimitBadge(), UsageLimitBadgeProps, USAGE_LIMIT_TEXT, CountdownUtil, UsageLimit, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements (+5 more)

### Community 23 - "ui.config.ts"
Cohesion: 0.08
Nodes (26): ConnectionBadgeProps, peerDetail(), PeerMessageCardProps, SubagentCardProps, ATTACHMENT_ACCEPT, ATTACHMENT_SEND_TIMEOUT_MS, CONNECTION_STATUS_BG, MCP_STATUS_BG (+18 more)

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
Cohesion: 0.11
Nodes (15): McpStatusList, McpStatusListSchema, McpStatusEvent, McpStatusEventSchema, RoomPermissionModeEvent, RoomPermissionModeEventSchema, SessionStateEvent, SessionStateEventSchema (+7 more)

### Community 28 - "ClientEvent"
Cohesion: 0.15
Nodes (7): CodeViewerController, SessionController, GitStatusEntry, dispatch(), registerWsRoute(), ClientEvent, ErrorEvent

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

### Community 40 - "Title: Plan — Connect all rooms with a lobby"
Cohesion: 0.17
Nodes (10): LobbyView, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 41 - "main"
Cohesion: 0.09
Nodes (13): CommandController, HistoryController, McpController, main(), registerWebApp(), OriginCheckMiddleware, SubagentTranscriptRepository, CatalogService (+5 more)

### Community 42 - "limits.config.ts"
Cohesion: 0.08
Nodes (30): ATTACHED_FILE_TAG_PREFIX, COMMANDS_TIMEOUT_MS, HISTORY_TEXT_MAX, INTERNAL_DETAIL_MAX, INTERNAL_EVENTS_KEEP_MAX, MCP_STATUS_TIMEOUT_MS, STOP_TIMEOUT_MS, SUBAGENT_TOOL_EVENTS_MAX (+22 more)

### Community 43 - "OfficeScene"
Cohesion: 0.14
Nodes (8): RenamePlaceSchema, RenameTarget, RenameTargetSchema, ScreenRect, ScreenRectSchema, View, WorldRect, OfficeScene

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
Cohesion: 0.19
Nodes (17): parseClientEvent(), ParseFailure, ParseResult, parseWith(), readEventType(), safeJsonParse(), parseServerEvent(), Functional Requirements (+9 more)

### Community 48 - "version.js"
Cohesion: 0.15
Nodes (26): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+18 more)

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

### Community 66 - "CodeViewerDialog.tsx"
Cohesion: 0.18
Nodes (12): CodeEditorView, CodeViewerDialog(), Placeholder(), UNAVAILABLE_TEXT, CODE_VIEWER_TEXT, useCodeViewerRefresh(), CodeViewerMode, CodeViewerState (+4 more)

### Community 67 - "Step 3 — Fetch the Code Diff"
Cohesion: 0.40
Nodes (4): Step 3 — Fetch the Code Diff, Using MCP, Using the browser, Using the CLI

### Community 68 - "Step 2 — Find the Target PR"
Cohesion: 0.40
Nodes (5): Step 2 — Find the Target PR, Using MCP, Using the browser, Using the CLI, What to get from the PR

### Community 69 - "Title: Plan — Sub-agent result card"
Cohesion: 0.20
Nodes (8): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Sub-agent result card

### Community 70 - "settings.json"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, $schema

### Community 71 - "Step 3 — User Approval Gate"
Cohesion: 0.50
Nodes (4): Approved, Cancels / Aborts, Requests Changes, Step 3 — User Approval Gate

### Community 72 - ".history"
Cohesion: 0.18
Nodes (10): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+2 more)

### Community 74 - "CameraController"
Cohesion: 0.15
Nodes (10): CameraController, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 75 - "S6 — Resume an old session"
Cohesion: 0.20
Nodes (10): Acceptance Criteria, Estimate, Functional Requirements, Goal, Non-Functional Requirements, Out of Scope, Requirements, S6 — Resume an old session (+2 more)

### Community 76 - "shared/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.base.json

### Community 77 - "cli.config.ts"
Cohesion: 0.08
Nodes (31): [command, ...args], run(), installCommand(), openCommand(), shouldDeleteData(), uninstallCommand(), readVersion(), upgradeCommand() (+23 more)

### Community 78 - "Title: Plan — Stack Send, Stop, and mode buttons in one column"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 79 - "IconButton"
Cohesion: 0.11
Nodes (19): IconButton(), Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Plan add-on 2 (approved) — Header actions + Esc fix, Plan add-on (approved) — Main actions icon-only, Risks & Assumptions (+11 more)

### Community 80 - "Title: Plan — Live result card title from the sub-agent description"
Cohesion: 0.11
Nodes (15): SubagentState, TaskNotification, TaskNotificationStatus, TaskNotificationUtil, Task List, Failures, TC-07 — Live result shows a card, Approach Summary / Goal (+7 more)

### Community 81 - "Title: Plan — Sub-agent name labels on the top layer, and shorter labels"
Cohesion: 0.20
Nodes (8): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Sub-agent name labels on the top layer, and shorter labels

### Community 82 - "Title: Plan — Clean up files not needed by the app"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 83 - "AgentSprite"
Cohesion: 0.14
Nodes (3): AgentSprite, SubagentSprite, Approach Summary / Goal

### Community 84 - "Title: Plan: change usage badge text order and add spacing"
Cohesion: 0.40
Nodes (4): Changes, Files in Scope, Task List, Title: Plan: change usage badge text order and add spacing

### Community 85 - "Title: Web Test Plan — Re-run sub-agent result card fixes"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Re-run sub-agent result card fixes

### Community 86 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bootstrap, bootstrap-icons, @claude-office/shared, monaco-editor, @monaco-editor/react, pixi.js, react (+6 more)

### Community 87 - "Claude Office: a pixel 2D office UI for Claude Code — Overview"
Cohesion: 0.33
Nodes (6): Claude Office: a pixel 2D office UI for Claude Code — Overview, Deferred to Later, Delivery Order, Open Questions, Stories, Summary

### Community 88 - "MessageList.tsx"
Cohesion: 0.06
Nodes (50): AuthErrorNotice(), AuthErrorNoticeProps, ExternalLink(), ExternalLinkProps, InternalEventsRow(), PeerMessageCard(), SubagentCard(), SystemEventCard() (+42 more)

### Community 89 - "resume-result.dto.ts"
Cohesion: 0.14
Nodes (12): FolderErrorCode, FolderErrorCodeSchema, ResumeErrorCode, ResumeErrorCodeSchema, ResumeResultSchema, StartResult, StartResultSchema, SessionStartedEvent (+4 more)

### Community 90 - "Title: Plan — Autocomplete for `/` commands and `@` files in the chat box"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — Autocomplete for `/` commands and `@` files in the chat box

### Community 91 - "ChatInput.tsx"
Cohesion: 0.12
Nodes (15): AttachmentChip(), AttachmentChipProps, ICON_BY_KIND, AttachmentList(), AttachmentListItem, AttachmentListProps, AutocompletePopup(), AutocompletePopupProps (+7 more)

### Community 92 - "session.service.ts"
Cohesion: 0.13
Nodes (14): ROOM_EVENT_BUFFER_MAX, ASK_IN_CHAT_MESSAGE, ASK_IN_CHAT_TOOLS, PERMISSION_DENY_MESSAGE, QUESTION_SKIPPED_MESSAGE, SDK_EXTRA_ARGS, SETTING_SOURCES, SessionStoreRepository (+6 more)

### Community 93 - "FileRepository"
Cohesion: 0.19
Nodes (4): FileController, FileRepository, FolderRepository, Non-Functional Requirements

### Community 94 - "Title: Plan — Move the attach button below Send and Stop"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 95 - "Title: Plan — Header uses the Claude Code orange as its accent"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 96 - "McpStatusPanel.tsx"
Cohesion: 0.21
Nodes (13): IconButtonProps, McpRow(), McpStatusPanel(), McpStatusPanelProps, PanelBody(), McpRoomStatus, McpRoomStatusSchema, McpStatus (+5 more)

### Community 98 - ".mapPeerText"
Cohesion: 0.11
Nodes (17): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+9 more)

### Community 100 - "Title: Plan — S3 Start a session and chat"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S3 Start a session and chat

### Community 101 - "Vulnerable Package Watchlist"
Cohesion: 0.22
Nodes (9): Cargo, Go Modules, Maven / Gradle, npm, pip, Reporting Format, RubyGems, Triage Rules (+1 more)

### Community 104 - "ServerEvent"
Cohesion: 0.24
Nodes (10): ServerEvent, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 105 - "Title: Plan — S7 Stop and close"
Cohesion: 0.16
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 106 - "AttachmentUtil"
Cohesion: 0.33
Nodes (3): useChatAttachments(), AttachmentUtil, AttachmentKind

### Community 107 - "Secret Patterns"
Cohesion: 0.40
Nodes (5): Detected Patterns, How to Fix, Running the Scanner, Secret Patterns, What the Script Cannot Find — Check by Hand

### Community 108 - "Title: Web Test Plan — Sub-agent details in the MCP panel style"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Sub-agent details in the MCP panel style

### Community 109 - "Title: Web Test Plan — Live result card (after ws-client fix)"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Live result card (after ws-client fix)

### Community 110 - "Title: Plan: close other panels when sub-agent details open"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Task List, Title: Plan: close other panels when sub-agent details open

### Community 111 - "Title: Plan — Bigger code viewer modal with a fixed-width sidebar"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 112 - "Title: Web Test Report — AskUserQuestion card"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — AskUserQuestion card

### Community 113 - "Title: Plan — Replace Kenney art with 2dpig Pixel Office"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 114 - "Title: Plan — Resizable chat panel"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 116 - "Title: Plan — S1 Spike: check the Agent SDK"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 117 - "onboarding/SKILL.md"
Cohesion: 0.28
Nodes (3): PROJECT OVERVIEW, Step 2 — Coding Conventions, Step 3 — Finish

### Community 118 - "SubagentTranscriptRepository"
Cohesion: 0.13
Nodes (12): ReportStatus, ReportStatusUtil, ReportStatusValue, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers (+4 more)

### Community 119 - "Title: Web Test Report — Sub-agent details in the MCP panel style"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Sub-agent details in the MCP panel style

### Community 120 - "CodeEditorView.tsx"
Cohesion: 0.21
Nodes (8): CodeEditorViewProps, DiffEditorInstance, ReadOnlyDiffProps, setupMonaco(), CodeLanguageUtil, LANGUAGE_BY_EXTENSION, monaco-editor, @monaco-editor/react

### Community 121 - "GitRepository"
Cohesion: 0.09
Nodes (18): GitRepository, GitProvider, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+10 more)

### Community 122 - "RoomEvent"
Cohesion: 0.24
Nodes (4): MapperState, SdkEventMapperService, RoomEvent, Task List

### Community 123 - "Coding Conventions"
Cohesion: 0.22
Nodes (9): Code order in a file, Coding Conventions, Folder structure, Imports, Naming, Other rules, Server layers, Style (Prettier + ESLint) (+1 more)

### Community 124 - "code-viewer.controller.ts"
Cohesion: 0.12
Nodes (18): GH_TIMEOUT_MS, GIT_HOST_PROVIDERS, GIT_TIMEOUT_MS, GLAB_TIMEOUT_MS, CODE_VIEWER_MAX_FILE_BYTES, HeadResult, FileListing, FileUnavailable (+10 more)

### Community 125 - "Files in Scope"
Cohesion: 0.10
Nodes (11): PendingPermission, Files in Scope, Functional Requirements, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 126 - "Title: Plan — AskUserQuestion stepper card"
Cohesion: 0.21
Nodes (10): AskUserQuestionUtil, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+2 more)

### Community 128 - ".doResume"
Cohesion: 0.24
Nodes (3): ResumeResult, Files in Scope, Task List

### Community 129 - "RoomSummary"
Cohesion: 0.10
Nodes (21): RoomSummary, Approach Summary / Goal, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+13 more)

### Community 130 - "web-test/SKILL.md"
Cohesion: 0.16
Nodes (11): Planning Rules, Step 3 — Test Plan, Test Plan Template, Usage Notes, Approved, Cancels, Requests Changes, Step 4 — Approval Gate (+3 more)

### Community 131 - "ws-client.service.ts"
Cohesion: 0.09
Nodes (26): FolderPicker(), FolderPickerProps, ArchivedDialog(), HeaderActions(), HistoryDialog(), NewSessionDialog(), buildWsUrl(), INITIAL_BACKOFF_MS (+18 more)

### Community 132 - "Title: Plan — Publish claude-office as the `@ngmthaq20/claude-office` npm CLI"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 133 - "web/package.json"
Cohesion: 0.13
Nodes (13): @claude-office/shared, @types/node, zod, name, private, type, version, bootstrap-icons (+5 more)

### Community 134 - "Title: Web Test Report — Live result card (after ws-client fix)"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Evidence, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Live result card (after ws-client fix)

### Community 135 - "Title: Plan — Fix the squeezed prompt box in sub-agent details"
Cohesion: 0.33
Nodes (5): Approach Summary / Goal, Files in Scope, Risks & Assumptions, Task List, Title: Plan — Fix the squeezed prompt box in sub-agent details

### Community 136 - "Title: Plan — Production build and start scripts"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 137 - "Title: Plan — Attach files to a chat message (no history)"
Cohesion: 0.10
Nodes (16): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — Attach files to a chat message (no history) (+8 more)

### Community 138 - "Data Handling"
Cohesion: 0.29
Nodes (7): Data Handling, Insecure Deserialization (CWE-502), Path Traversal (CWE-22), Sensitive Data Exposure (CWE-200, CWE-312, CWE-798), SSRF (CWE-918), Transport & Storage, XXE (CWE-611)

### Community 139 - "Graphify Setup"
Cohesion: 0.25
Nodes (7): Add to Claude Code, Build the graph, Graphify Setup, Install, Keep it up to date (optional), Search the graph, What you need

### Community 140 - "Title: Plan — S5 Permission prompts in the UI"
Cohesion: 0.18
Nodes (11): PermissionCard(), Approach Summary / Goal, Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 141 - "Title: Plan — Add space between the Prompt box and "Tool calls""
Cohesion: 0.40
Nodes (4): Approach Summary / Goal, Files in Scope, Task List, Title: Plan — Add space between the Prompt box and "Tool calls"

### Community 142 - "Title: Plan — Draw empty slots as vacant offices"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 143 - "ask-user-question.dto.ts"
Cohesion: 0.31
Nodes (6): AskUserQuestionCardProps, EMPTY_SELECTION, AskUserQuestionInputSchema, AskUserQuestionSchema, AskUserQuestionSelection, AskUserQuestionSelectionSchema

### Community 145 - "react"
Cohesion: 0.11
Nodes (24): CloseConfirmDialog(), CloseConfirmDialogProps, Confirming, RoomAction, RoomActionsMenu(), request(), send(), RoomActionsMenuProps (+16 more)

### Community 146 - "ChatPanel.tsx"
Cohesion: 0.08
Nodes (25): Row(), RowProps, SessionInfoPanel(), SessionInfoPanelProps, SESSION_INFO_TEXT, useEscapeClose(), SessionInfoState, useSessionInfoStore (+17 more)

### Community 147 - "Title: Plan — S5 Permission prompts in the UI"
Cohesion: 0.22
Nodes (8): Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List, Title: Plan — S5 Permission prompts in the UI

### Community 148 - "Title: Plan — Remove right corridor, fill room gaps, speed up sub-agents"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 149 - "autocomplete-token.dto.ts"
Cohesion: 0.06
Nodes (37): CommandRepository, AUTOCOMPLETE_MAX_ROWS, AUTOCOMPLETE_POPUP_ID, AUTOCOMPLETE_STALE_MS, AutocompleteRows, AutocompleteRowsSchema, AutocompleteToken, AutocompleteTokenSchema (+29 more)

### Community 150 - "Title: Plan — Fix code viewer diff layout and diff editor unmount error"
Cohesion: 0.18
Nodes (11): CodeEditorView(), ReadOnlyDiff(), Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions (+3 more)

### Community 151 - "Step 1 — Project Overview"
Cohesion: 0.20
Nodes (10): 1.1 — Project Name and Description, 1.2 — Programming Languages and Frameworks, 1.3 — Package Manager, 1.4 — Key Libraries, 1.5 — Database, 1.6 — Doc Directory, 1.7 — Testing Workflow, 1.8 — Playwright Check (+2 more)

### Community 152 - "Title: Web Test Plan — Live result card title (debug log run)"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Live result card title (debug log run)

### Community 153 - "src/index.ts"
Cohesion: 0.28
Nodes (6): FolderController, PermissionController, SystemController, WsRouteOptions, ErrorUtil, WsSendUtil

### Community 154 - "Title: Web Test Report — Live result card title (debug log run)"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-07 — Live result shows a card with the right title, Test Results, Title: Web Test Report — Live result card title (debug log run)

### Community 155 - "Title: Web Test Plan — AskUserQuestion stepper card"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — AskUserQuestion stepper card

### Community 156 - "RTK Setup"
Cohesion: 0.29
Nodes (6): Add to Claude Code, Check savings, Common commands, Install, Notes, RTK Setup

### Community 157 - "Title: Web Test Report — Web app after the layered refactor"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — Web app after the layered refactor

### Community 158 - "OfficePage.tsx"
Cohesion: 0.19
Nodes (11): ChatResizeHandle(), ChatResizeHandleProps, ConnectionBadge(), GameCanvas(), OfficePage(), AppLayout(), AppLayoutProps, loadSheets() (+3 more)

### Community 159 - "commands.ts"
Cohesion: 0.15
Nodes (9): CommandList, CommandListSchema, CommandsEvent, CommandsEventSchema, CommandsListEvent, CommandsListEventSchema, FilesEvent, SlashCommandEntrySchema (+1 more)

### Community 160 - "Title: Web Test Report — Sub-agent result card"
Cohesion: 0.20
Nodes (9): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-03 — Status badge matches the report, TC-07 — Live hand-back shows a card, Test Results (+1 more)

### Community 161 - "Title: Web Test Plan — Web app after the layered refactor"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Web app after the layered refactor

### Community 162 - "Title: Web Test Report — Re-run sub-agent result card fixes"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-07 — Live result shows a card, Test Results, Title: Web Test Report — Re-run sub-agent result card fixes

### Community 163 - "PermissionCard.tsx"
Cohesion: 0.25
Nodes (7): PermissionCardProps, PERMISSION_STATUS_BG, PERMISSION_STATUS_LABELS, PermissionItem, PermissionItemSchema, PermissionStatus, PermissionStatusSchema

### Community 164 - "Title: Web Test Plan — Re-run live sub-agent result card"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Re-run live sub-agent result card

### Community 165 - "HistoryRepository"
Cohesion: 0.20
Nodes (3): HistoryRepository, InternalEventsEvent, Task List

### Community 166 - "Title: Web Test Plan — Sub-agent label size, bubble layer, and stacked Send/Stop"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Sub-agent label size, bubble layer, and stacked Send/Stop

### Community 167 - "Title: Plan — Smaller sub-agent name and message bubbles on top"
Cohesion: 0.20
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 168 - "ChatPanel"
Cohesion: 0.08
Nodes (28): ChatPanel(), hasFiles(), onDragEnter(), onDragLeave(), onDragOver(), onDrop(), RenamePlace, Approach Summary / Goal (+20 more)

### Community 169 - "room-view.ts"
Cohesion: 0.26
Nodes (9): FRAMES, getSprite(), spriteCache, SpriteName, Phase, Point, SubagentEnd, SessionState (+1 more)

### Community 170 - "Title: Web Test Report — Sub-agent label size, bubble layer, and stacked Send/Stop"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-04 — Sub-agent bubbles and labels above furniture, Test Results, Title: Web Test Report — Sub-agent label size, bubble layer, and stacked Send/Stop

### Community 171 - "Title: Web Test Plan — AskUserQuestion card"
Cohesion: 0.22
Nodes (9): AskUserQuestion, Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases (+1 more)

### Community 172 - "Title: Web Test Plan — Read-only code viewer"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Read-only code viewer

### Community 173 - "Title: Web Test Plan — Re-check sub-agent labels on the top layer"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Re-check sub-agent labels on the top layer

### Community 174 - "Title: Plan — Session info panel: center rows, remove copy and progress bar"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Task List, Title: Plan — Session info panel: center rows, remove copy and progress bar

### Community 175 - "Title: Web Test Report — Read-only code viewer"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, TC-03 — Modified file opens as a diff, Test Results, Title: Web Test Report — Read-only code viewer

### Community 176 - "Project Onboarding"
Cohesion: 0.40
Nodes (5): How to Use This Skill, Onboarding Workflow, Override Notice, Project Onboarding, Purpose

### Community 177 - "Title: Web Test Report — Re-check sub-agent labels on the top layer"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Notes, Result Summary, Test Results, Title: Web Test Report — Re-check sub-agent labels on the top layer

### Community 178 - "Title: Web Test Report — AskUserQuestion stepper card"
Cohesion: 0.25
Nodes (7): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Test Results, Title: Web Test Report — AskUserQuestion stepper card

### Community 179 - "Title: Web Test Plan — Header orange accent and text CTAs in modals and cards"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Header orange accent and text CTAs in modals and cards

### Community 180 - "Title: Web Test Report — Header orange accent and text CTAs in modals and cards"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Notes, Result Summary, Test Results, Title: Web Test Report — Header orange accent and text CTAs in modals and cards

### Community 181 - "Title: Plan — S2 App foundation"
Cohesion: 0.25
Nodes (7): Approach Summary / Goal, Files in Scope, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — S2 App foundation

### Community 182 - "Step 1 — Check Browser Permission"
Cohesion: 0.40
Nodes (4): 1. Check that the user allows the browser, 2. Check that a browser tool is available, 3. Get the target, Step 1 — Check Browser Permission

### Community 183 - "cli/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, paths, types, extends, include, ../../tsconfig.base.json

### Community 184 - "Step 2 — Brainstorming"
Cohesion: 0.40
Nodes (5): Brainstorming Dialogue, Check the Test Scope, Classify the Intent, Step 2 — Brainstorming, Usage Notes

### Community 185 - "@ngmthaq20/claude-office"
Cohesion: 0.33
Nodes (5): Data folder, @ngmthaq20/claude-office, Publish, Requirements, Usage

### Community 186 - "Step 5 — Run Tests in the Browser"
Cohesion: 0.40
Nodes (4): 1. Start the browser, 2. Run each test case, 4. Finish, Step 5 — Run Tests in the Browser

### Community 187 - "session-notice.ts"
Cohesion: 0.40
Nodes (4): SessionNoticeEvent, SessionNoticeEventSchema, SessionNoticeKind, SessionNoticeKindSchema

### Community 188 - "Title: Plan — Fallback card history fix (read cards from the transcript file)"
Cohesion: 0.22
Nodes (8): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — Fallback card history fix (read cards from the transcript file)

### Community 189 - "subagent-finished.ts"
Cohesion: 0.40
Nodes (4): SubagentFinishedEvent, SubagentFinishedEventSchema, SubagentStatus, SubagentStatusSchema

### Community 190 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/node, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 191 - "AskUserQuestionCard"
Cohesion: 0.53
Nodes (5): AskUserQuestionCard(), goTo(), renderStepper(), selectionAt(), update()

### Community 192 - "Spike S1: Claude Agent SDK findings"
Cohesion: 0.22
Nodes (8): How to re-run, Impact on S3 / S5 / S9, Q1 Login, Q2 Sub-agent messages, Q3 Permission callback, Setup used, Spike S1: Claude Agent SDK findings, Summary

### Community 194 - "Step 7 — Summary Report to User"
Cohesion: 0.50
Nodes (3): Step 7 — Summary Report to User, Summary Report Template, Usage Notes

### Community 197 - "step-6-test-report.md"
Cohesion: 0.50
Nodes (3): Step 6 — Test Report, Test Report Template, Usage Notes

### Community 198 - "Step 5 — Sub-Agent Result Return"
Cohesion: 0.67
Nodes (3): Step 5 — Sub-Agent Result Return, Sub-Agent Result Template, Usage Notes

### Community 199 - "ErrorBoundary"
Cohesion: 0.25
Nodes (4): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, Task List

### Community 200 - "Title: Plan — Use the Claude session title as the default room name"
Cohesion: 0.29
Nodes (6): Approach Summary / Goal, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Title: Plan — Use the Claude session title as the default room name

### Community 201 - "events/usage-limit.ts"
Cohesion: 0.50
Nodes (3): UsageLimitEvent, UsageLimitEventSchema, UsageLimitSchema

### Community 204 - "Title: Web Test Plan — Attach files to a chat message"
Cohesion: 0.22
Nodes (8): Goal, Open Questions / Blockers, Preconditions, Risks & Assumptions, Scope, Status, Test Cases, Title: Web Test Plan — Attach files to a chat message

### Community 205 - "Title: Web Test Report — Attach files to a chat message"
Cohesion: 0.22
Nodes (8): Blocked / Skipped, Console and Network Problems, Failures, Next Steps, Result Summary, Run Notes, Test Results, Title: Web Test Report — Attach files to a chat message

### Community 206 - "Files in Scope"
Cohesion: 0.15
Nodes (9): InputQueue, Approach Summary / Goal, Code style per layer, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status (+1 more)

### Community 209 - ".setPermissionMode"
Cohesion: 0.16
Nodes (9): Approach Summary / Goal, Files in Scope, Functional Requirements, Non-Functional Requirements, Open Questions / Blockers, Risks & Assumptions, Status, Task List (+1 more)

### Community 210 - "Title: Web Test Report — Re-run live sub-agent result card"
Cohesion: 0.29
Nodes (6): Blocked / Skipped, Console and Network Problems, Next Steps, Result Summary, Test Results, Title: Web Test Report — Re-run live sub-agent result card

### Community 211 - "AI / LLM Security"
Cohesion: 0.33
Nodes (6): AI / LLM Security, Data Leakage via Prompts, Indirect Prompt Injection (RAG / Agentic), Insecure Tool Use, Model & Infrastructure Basics, Prompt Injection (CWE-1336)

### Community 212 - "Report Format"
Cohesion: 0.33
Nodes (6): 1. Scan Summary, 2. Finding Cards, 3. Dependency Audit, 4. Secrets Scan, 5. Proposed Patches, Report Format

### Community 213 - "Authentication & Access Control"
Cohesion: 0.33
Nodes (6): Authentication & Access Control, Broken Authorization / IDOR / BOLA (CWE-284, CWE-639), CSRF (CWE-352), JWT Weaknesses, Mass Assignment (CWE-915), Session & Privilege

### Community 214 - "ref_zod"
Cohesion: 0.18
Nodes (9): CodeFileEventSchema, FoldersEvent, FoldersEventSchema, HistoryEvent, HistoryEventSchema, FileEntrySchema, FolderEntrySchema, GitFileStatusSchema (+1 more)

### Community 215 - "Security Scanner"
Cohesion: 0.40
Nodes (5): Reference Files, Rules, Security Scanner, Severity Guide, When to Use

### Community 216 - "permission-answer.ts"
Cohesion: 0.50
Nodes (3): PermissionAnswerEvent, PermissionAnswerEventSchema, PermissionDecisionSchema

### Community 218 - "Step 10 — Offer to Post Review (File + Line Comments)"
Cohesion: 0.40
Nodes (4): Posting via browser, Posting via CLI, Posting via MCP, Step 10 — Offer to Post Review (File + Line Comments)

### Community 219 - "archived.ts"
Cohesion: 0.50
Nodes (3): ArchivedEvent, ArchivedEventSchema, ArchivedRoomSchema

### Community 221 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, typecheck

## Knowledge Gaps
- **36 isolated node(s):** `@anthropic-ai/claude-agent-sdk`, `@fastify/static`, `@fastify/websocket`, `better-sqlite3`, `fastify` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Coding Conventions` connect `Coding Conventions` to `onboarding/SKILL.md`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `SessionService` (e.g. with `Task List` and `Files in Scope`) actually correct?**
  _`SessionService` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@anthropic-ai/claude-agent-sdk`, `@fastify/static`, `@fastify/websocket` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `attachment.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08677098150782361 - nodes in this community are weakly interconnected._
- **Why does `Session` connect `SessionService` to `.doResume`, `PermissionService`, `.history`, `Session`, `.setPermissionMode`, `Coding Conventions`, `session.service.ts`, `Files in Scope`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Session` (e.g. with `Server layers` and `Files in Scope`) actually correct?**
  _`Session` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `Files in Scope` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._