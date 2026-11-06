import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { CatalogService } from '@/services/catalog.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class McpController {
  constructor(private readonly catalogService: CatalogService) {}

  list(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'mcp_list' }>,
    log: FastifyBaseLogger,
  ): void {
    this.catalogService
      .listMcpServers(event.roomId)
      .then((list) => {
        if (!list) {
          WsSendUtil.trySend(socket, WsSendUtil.errorEvent('room_not_found', 'Room not found.'));
        } else {
          WsSendUtil.trySend(socket, { type: 'mcp_status', roomId: event.roomId, ...list });
        }
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'mcp status failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('mcp_failed', 'Cannot load MCP servers.'));
      });
  }
}
