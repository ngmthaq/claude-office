import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { CatalogService } from '@/services/catalog.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class CommandController {
  constructor(private readonly catalogService: CatalogService) {}

  list(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'commands_list' }>,
    log: FastifyBaseLogger,
  ): void {
    this.catalogService
      .listCommands(event.roomId)
      .then((list) => {
        if (!list) {
          WsSendUtil.trySend(socket, WsSendUtil.errorEvent('room_not_found', 'Room not found.'));
        } else {
          WsSendUtil.trySend(socket, { type: 'commands', roomId: event.roomId, ...list });
        }
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'commands list failed');
        WsSendUtil.trySend(
          socket,
          WsSendUtil.errorEvent('commands_failed', 'Cannot load commands.'),
        );
      });
  }
}
