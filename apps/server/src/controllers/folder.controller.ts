import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { FolderRepository } from '@/repositories/folder.repository.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class FolderController {
  constructor(private readonly folderRepository: FolderRepository) {}

  list(socket: WebSocket, event: Extract<ClientEvent, { type: 'folders_list' }>): void {
    const result = this.folderRepository.listFolders(event.path);
    if (!result.ok) {
      WsSendUtil.send(
        socket,
        WsSendUtil.errorEvent('folder_invalid', `Cannot open folder (${result.code}).`),
      );
      return;
    }
    WsSendUtil.send(socket, { type: 'folders', ...result.value });
  }
}
