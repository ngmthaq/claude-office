import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { SessionService } from '@/services/session.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class HistoryController {
  constructor(private readonly sessionService: SessionService) {}

  list(
    socket: WebSocket,
    _event: Extract<ClientEvent, { type: 'history_list' }>,
    log: FastifyBaseLogger,
  ): void {
    this.sessionService
      .listHistory()
      .then((entries) => WsSendUtil.trySend(socket, { type: 'history', entries }))
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'history list failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('history_failed', 'Cannot load history.'));
      });
  }
}
