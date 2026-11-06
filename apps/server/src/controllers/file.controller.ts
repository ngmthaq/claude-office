import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { FileRepository } from '@/repositories/file.repository.ts';
import type { FolderRepository } from '@/repositories/folder.repository.ts';
import type { SessionService } from '@/services/session.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class FileController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly folderRepository: FolderRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  list(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'files_list' }>,
    log: FastifyBaseLogger,
  ): void {
    const folder = this.sessionService.roomFolder(event.roomId);
    if (folder === undefined) {
      WsSendUtil.send(socket, WsSendUtil.errorEvent('room_not_found', 'Room not found.'));
      return;
    }
    const resolved = this.folderRepository.resolveFolder(folder);
    if (!resolved.ok) {
      WsSendUtil.send(
        socket,
        WsSendUtil.errorEvent('folder_invalid', `Cannot open folder (${resolved.code}).`),
      );
      return;
    }
    this.fileRepository
      .listFiles(resolved.value)
      .then((listing) => {
        log.info({ count: listing.files.length, truncated: listing.truncated }, 'files listed');
        WsSendUtil.trySend(socket, { type: 'files', roomId: event.roomId, ...listing });
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'files list failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('files_failed', 'Cannot load files.'));
      });
  }
}
