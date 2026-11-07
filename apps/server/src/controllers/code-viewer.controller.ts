import { posix } from 'node:path';
import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent, FileEntry, GitFileStatus } from '@claude-office/shared';
import { FileRepository } from '@/repositories/file.repository.ts';
import type { FileUnavailable } from '@/repositories/file.repository.ts';
import type { FolderRepository } from '@/repositories/folder.repository.ts';
import type { GitRepository, GitStatusEntry } from '@/repositories/git.repository.ts';
import type { SessionService } from '@/services/session.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

type HeadResult = { text: string | null; unavailable: FileUnavailable | null };

export class CodeViewerController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly folderRepository: FolderRepository,
    private readonly fileRepository: FileRepository,
    private readonly gitRepository: GitRepository,
  ) {}

  tree(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'code_tree_list' }>,
    log: FastifyBaseLogger,
  ): void {
    const folder = this.resolveFolder(socket, event.roomId);
    if (folder === null) return;
    Promise.all([
      this.fileRepository.listFiles(folder, { fresh: true }),
      this.gitRepository.statusEntries(folder),
    ])
      .then(([listing, statuses]) => {
        const files = this.withDeleted(listing.files, statuses ?? []);
        log.info({ count: files.length, git: statuses !== null }, 'code tree listed');
        WsSendUtil.trySend(socket, {
          type: 'code_tree',
          roomId: event.roomId,
          files,
          truncated: listing.truncated,
          isGitRepo: statuses !== null,
          statuses: statuses ?? [],
        });
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'code tree failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('code_tree_failed', 'Cannot load files.'));
      });
  }

  file(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'code_file_get' }>,
    log: FastifyBaseLogger,
  ): void {
    const folder = this.resolveFolder(socket, event.roomId);
    if (folder === null) return;
    this.loadFile(folder, event.path)
      .then((result) => {
        log.info({ status: result.status, unavailable: result.unavailable }, 'code file read');
        WsSendUtil.trySend(socket, {
          type: 'code_file',
          roomId: event.roomId,
          path: event.path,
          ...result,
        });
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'code file failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('code_file_failed', 'Cannot load file.'));
      });
  }

  private resolveFolder(socket: WebSocket, roomId: string): string | null {
    const folder = this.sessionService.roomFolder(roomId);
    if (folder === undefined) {
      WsSendUtil.send(socket, WsSendUtil.errorEvent('room_not_found', 'Room not found.'));
      return null;
    }
    const resolved = this.folderRepository.resolveFolder(folder);
    if (!resolved.ok) {
      WsSendUtil.send(
        socket,
        WsSendUtil.errorEvent('folder_invalid', `Cannot open folder (${resolved.code}).`),
      );
      return null;
    }
    return resolved.value;
  }

  private async loadFile(
    folder: string,
    path: string,
  ): Promise<{
    status: GitFileStatus | null;
    head: string | null;
    current: string | null;
    unavailable: FileUnavailable | null;
  }> {
    const statuses = (await this.gitRepository.statusEntries(folder)) ?? [];
    const entry = statuses.find((item) => item.path === path);
    const status = entry?.status ?? null;
    const head = await this.loadHead(folder, entry);
    let current: string | null = null;
    let unavailable = head.unavailable;
    if (status !== 'D') {
      const read = await this.fileRepository.readText(folder, path);
      if (read.ok) current = read.text;
      else unavailable ??= read.reason;
    }
    return { status, head: head.text, current, unavailable };
  }

  private async loadHead(folder: string, entry: GitStatusEntry | undefined): Promise<HeadResult> {
    const none: HeadResult = { text: null, unavailable: null };
    if (entry === undefined || entry.status === 'U' || entry.status === 'A') return none;
    const headPath = entry.status === 'R' ? entry.oldPath : entry.path;
    if (headPath === undefined) return none;
    const head = await this.gitRepository.headContent(folder, headPath);
    if (!head.ok)
      return { text: null, unavailable: head.reason === 'too_large' ? 'too_large' : null };
    const decoded = FileRepository.decode(head.data);
    return decoded.ok
      ? { text: decoded.text, unavailable: null }
      : { text: null, unavailable: decoded.reason };
  }

  private withDeleted(files: FileEntry[], statuses: GitStatusEntry[]): FileEntry[] {
    const known = new Set(files.map((file) => file.path));
    const added: FileEntry[] = [];
    for (const { path, status } of statuses) {
      if (status !== 'D' || known.has(path)) continue;
      known.add(path);
      added.push({ path, kind: 'file' });
      for (let dir = posix.dirname(path); dir !== '.'; dir = posix.dirname(dir)) {
        if (known.has(dir)) break;
        known.add(dir);
        added.push({ path: dir, kind: 'dir' });
      }
    }
    if (added.length === 0) return files;
    return [...files, ...added].sort((a, b) => a.path.localeCompare(b.path));
  }
}
