# Title: Plan — Read-only code viewer for a room

- Classification: feature
- Description: Add a large modal with a full file tree (with git status marks) and a read-only Monaco editor that shows a side-by-side diff (HEAD vs working file) or the plain file.

---

## Approach Summary / Goal

- A new icon button in the chat header opens a large modal for the room's folder.
- The left side is the full folder tree. Changed files show a git mark (M / A / U / D / R). Deleted files stay in the tree with a strike-through.
- The right side is a Monaco editor, always read-only. Changed files open in diff mode (HEAD vs working file). A toggle switches to file mode (current file with syntax colors). Unchanged files open in file mode.
- The server sends the tree, git status, and file contents over two new WebSocket events. Monaco is bundled locally and loaded only when the modal opens.
- **Goal:** quickly look at what changed in a room's folder without leaving Claude Office.

## Functional Requirements

1. The chat header has a new "Code viewer" icon button. It opens a large modal for the selected room.
2. The modal sidebar shows every file in the room folder as a tree (folders can open and close).
3. Each changed file shows a git mark: `M` modified, `A` added (staged new), `U` untracked, `D` deleted, `R` renamed. Folders with changed files inside show a small dot.
4. Deleted files appear in the tree with a strike-through and `D`.
5. Clicking a file opens it in the editor. The editor is read-only (no typing, no save).
6. For a changed file, the default view is a side-by-side diff: HEAD version (left) vs working file (right).
   - Untracked / added file: left side is empty.
   - Deleted file: right side is empty.
7. A toggle switches between **Diff** and **File** mode. File mode shows the current file with syntax colors. For an unchanged file, only File mode is shown. For a deleted file, only Diff mode is shown.
8. Files over 1 MB or binary files show a "Cannot preview" message instead of content.
9. If the folder is not a git repo, the tree shows no marks and all files open in File mode.
10. A Refresh button reloads the tree, git marks, and the open file.
11. While the modal is open, the tree and the open file reload by themselves when the room goes from `working` to another state (Claude finished a turn).
12. Esc or the close button closes the modal.

## Non-Functional Requirements

- **Security:**
  - The server only reads files inside the room folder. It rejects absolute paths, `..`, and symlinks that point outside the folder (check with `realpath`).
  - Git runs with `execFile` (no shell) and fixed arguments. The path goes after `--`.
  - Nothing is written to disk. No file content is logged.
- **Offline:** Monaco and its workers are bundled with Vite. The app makes no CDN calls.
- **Speed:**
  - Monaco loads lazily (`React.lazy`) only when the modal opens. The main bundle does not grow much.
  - Git and file reads use time limits like the existing `GitRepository` (`GIT_TIMEOUT_MS`).
  - The editor tree request skips the 30 s cache of `FileRepository.listFiles` so Refresh shows fresh data.
- **Code style:** follow `.claude/references/CODING_CONVENTIONS.md` (layers, file names, Zod event schemas in `packages/shared`).

## Files in Scope

**Shared (`packages/shared/src/`)**
- New: `models/git-file-status.ts` — Zod enum for `M | A | U | D | R`.
- New: `events/code-tree-list.ts` (client → server: `roomId`).
- New: `events/code-tree.ts` (server → client: `roomId`, `files: FileEntry[]`, `truncated`, `isGitRepo`, `statuses: { path, status }[]`).
- New: `events/code-file-get.ts` (client → server: `roomId`, `path`).
- New: `events/code-file.ts` (server → client: `roomId`, `path`, `status`, `head: string | null`, `current: string | null`, `unavailable: null | 'too_large' | 'binary' | 'not_found'`).
- Change: `events/client-event.ts`, `events/server-event.ts`, `events/index.ts`, `index.ts` — register the new events/models.

**Server (`apps/server/src/`)**
- Change: `repositories/git.repository.ts` — add `statusEntries(folder)` (`git status --porcelain=v1 -z --untracked-files=all`) and `headContent(folder, path)` (`git show HEAD:<path>`).
- Change: `repositories/file.repository.ts` — add `listFiles(folder, { fresh: true })` option to skip cache, and `readText(folder, path)` with path checks, 1 MB limit, and binary check (NUL byte in the first 8 KB).
- Change: `configs/limits.config.ts` — add `CODE_VIEWER_MAX_FILE_BYTES = 1024 * 1024`.
- New: `controllers/code-viewer.controller.ts` — handles `code_tree_list` and `code_file_get`; merges deleted files into the tree.
- Change: `routes/ws.route.ts` and `main.ts` — route the two new events and build the controller.

**Web (`apps/web/`)**
- Change: `package.json` — add `monaco-editor` and `@monaco-editor/react`.
- New: `src/configs/monaco.config.ts` — `loader.config({ monaco })` and worker setup with Vite `?worker` imports.
- New: `src/hooks/store/useCodeViewerStore.ts` — open room id, tree, statuses, selected path, open file data, mode (`diff` / `file`), loading state.
- New: `src/hooks/feature/useCodeViewerRefresh.ts` — sends the requests; reloads when the room leaves `working`.
- Change: `src/services/ws-client.service.ts` — handle `code_tree` and `code_file`.
- New: `src/components/molecules/FileTree.tsx` — pure tree with git marks and open/close folders.
- New: `src/components/molecules/CodeEditorView.tsx` — pure Monaco wrapper (`DiffEditor` / `Editor`, `readOnly: true`, language from file extension).
- New: `src/components/organisms/CodeViewerDialog.tsx` — large modal; wires store, hook, tree, and editor (lazy-loaded); Diff/File toggle; Refresh button; "Cannot preview" message.
- Change: `src/components/organisms/ChatPanel.tsx` — add the header icon button and render the dialog.
- Change: `src/configs/ui.config.ts` — `CODE_VIEWER_TEXT` labels.
- New: `src/styles/code-viewer.css` (and import it where other styles are imported).
- Change: `src/utils/` — new `code-language.util.ts` (file extension → Monaco language id).

## Risks & Assumptions

- **Assumption:** Rename (`R`) shows the new path in the tree; the diff uses the old path for the HEAD side.
- **Assumption:** The tree uses the same file source as today (`git ls-files` incl. untracked, or folder walk when not a git repo), so ignored files (for example `node_modules`) do not appear. The 5000-entry limit stays; the modal shows a "list is cut" note when `truncated` is true.
- **Assumption:** Diff mode is the default only for changed files. Unchanged files open in File mode.
- **Risk:** Monaco adds a few MB to the build. It is lazy-loaded, so the first page load is not slower.
- **Risk:** Monaco worker setup with Vite 8 may need small config changes. The developer must check that `pnpm build` and `pnpm dev` both work.
- **Risk:** In a very large repo, `git status` may hit the time limit. The modal then shows no marks and an error note, not a crash.
- **Testing:** the project uses Skip-Testing, so there is no tester task. I will check the result by reading the code, and by running type check, lint, and build. Browser check (Playwright Check = Ask-User): I will ask you after the work is done.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | Add shared Zod schemas and types: `git-file-status` model, `code_tree_list`, `code_tree`, `code_file_get`, `code_file` events; register them in client/server event unions and `index.ts`. | developer | none | `pnpm -r typecheck` passes. Both unions include the new events. Schemas match the fields in "Files in Scope". | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | Server: add `GitRepository.statusEntries` and `headContent`; add `FileRepository` fresh option and `readText` with path checks, 1 MB limit, binary check; add limit constant. | developer | task 1 | Paths with `..`, absolute paths, and symlinks outside the folder are rejected. Files > 1 MB return `too_large`; files with a NUL byte return `binary`. Non-git folder returns no statuses without throwing. Git uses `execFile` with `--`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | Server: add `code-viewer.controller.ts`; route the two events in `ws.route.ts`; build it in `main.ts`. Deleted files are merged into the tree. Errors are logged (no content) and sent as `error` events. | developer | task 2 | Sending `code_tree_list` returns `code_tree` with files + statuses. Sending `code_file_get` returns `code_file` with the right `head` / `current` for M, A, U, D, R, and unchanged files. Unknown room returns `room_not_found`. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | DONE   | Web: add Monaco deps, `monaco.config.ts` (local bundle + workers), `code-language.util.ts`, and pure molecules `FileTree.tsx` and `CodeEditorView.tsx`. | developer | task 1 | `pnpm --filter web build` passes. No CDN URL in the build. Editor and diff editor are `readOnly`. Tree shows marks, strike-through for `D`, dot on folders with changes. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | DONE   | Web: add `useCodeViewerStore`, `useCodeViewerRefresh`, ws-client handlers, `CodeViewerDialog.tsx` (lazy editor, Diff/File toggle, Refresh, "Cannot preview", truncated note), header button in `ChatPanel.tsx`, `CODE_VIEWER_TEXT`, and `code-viewer.css`. | developer | tasks 3, 4 | Button opens the modal for the selected room. Clicking a file shows it. Toggle rules match FR 6–7. Refresh reloads tree + open file. Room going from `working` to another state reloads while open. Esc closes. `pnpm -r typecheck`, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
