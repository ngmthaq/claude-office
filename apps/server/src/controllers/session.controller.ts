import type { FastifyBaseLogger } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { SessionService } from '@/services/session.service.ts';
import { ErrorUtil } from '@/utils/error.util.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  start(socket: WebSocket, event: Extract<ClientEvent, { type: 'session_start' }>): void {
    const result = this.sessionService.start(event.folder);
    if (!result.ok) {
      WsSendUtil.send(
        socket,
        WsSendUtil.errorEvent('folder_invalid', `Cannot use folder (${result.code}).`),
      );
      return;
    }
    WsSendUtil.send(socket, { type: 'session_started', room: result.room });
  }

  send(_socket: WebSocket, event: Extract<ClientEvent, { type: 'session_send' }>): void {
    this.sessionService.send(event.roomId, event.text, event.attachments);
  }

  stop(_socket: WebSocket, event: Extract<ClientEvent, { type: 'session_stop' }>): void {
    this.sessionService.stop(event.roomId);
  }

  close(_socket: WebSocket, event: Extract<ClientEvent, { type: 'session_close' }>): void {
    this.sessionService.close(event.roomId);
  }

  resume(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'session_resume' }>,
    log: FastifyBaseLogger,
  ): void {
    this.sessionService
      .resume(event.sessionId)
      .then((result) => {
        if (result.ok) WsSendUtil.trySend(socket, { type: 'session_started', room: result.room });
        else {
          WsSendUtil.trySend(
            socket,
            WsSendUtil.errorEvent('resume_failed', `Cannot resume (${result.code}).`),
          );
        }
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'session resume failed');
        WsSendUtil.trySend(
          socket,
          WsSendUtil.errorEvent('resume_failed', 'Cannot resume (failed).'),
        );
      });
  }

  open(
    socket: WebSocket,
    event: Extract<ClientEvent, { type: 'session_open' }>,
    log: FastifyBaseLogger,
  ): void {
    this.sessionService
      .history(event.roomId)
      .then((events) => {
        if (!events) {
          WsSendUtil.trySend(socket, WsSendUtil.errorEvent('room_not_found', 'Room not found.'));
        } else {
          WsSendUtil.trySend(socket, { type: 'session_history', roomId: event.roomId, events });
        }
      })
      .catch((error: unknown) => {
        log.error({ err: ErrorUtil.errorName(error) }, 'session open failed');
        WsSendUtil.trySend(socket, WsSendUtil.errorEvent('internal_error', 'Internal error'));
      });
  }
}
