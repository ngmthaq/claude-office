import type { FastifyBaseLogger, FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';
import {
  parseClientEvent,
  type ClientEvent,
  type ErrorEvent,
  type ServerEvent,
} from '@claude-office/shared';
import { SERVER_VERSION } from '../config.ts';
import { listFolders } from '../sessions/folder-browser.ts';
import type { SessionManager } from '../sessions/session-manager.ts';
import { originCheck } from './origin-check.ts';

export type WsRouteOptions = {
  sessions: SessionManager;
};

export async function registerWsRoute(
  app: FastifyInstance,
  options: WsRouteOptions,
): Promise<void> {
  const { sessions } = options;
  const sockets = new Set<WebSocket>();

  sessions.onRoomEvent((event) => broadcast(sockets, event));
  sessions.onSessionState((event) => broadcast(sockets, event));
  sessions.onRoomsChanged(() => broadcast(sockets, { type: 'sessions', rooms: sessions.list() }));
  sessions.onArchivedChanged(() =>
    broadcast(sockets, { type: 'archived', rooms: sessions.listArchived() }),
  );

  app.get('/ws', { websocket: true, onRequest: originCheck }, (socket, request) => {
    const log = request.log;
    sockets.add(socket);
    try {
      send(socket, { type: 'hello', serverVersion: SERVER_VERSION, time: Date.now() });
      send(socket, { type: 'sessions', rooms: sessions.list() });
    } catch (error) {
      log.error({ err: error }, 'failed to send hello');
    }

    socket.on('message', (data: Buffer) => {
      try {
        const parsed = parseClientEvent(data.toString());
        if (!parsed.success) {
          log.warn(
            { eventType: parsed.eventType, issuePaths: parsed.issuePaths },
            'invalid client message',
          );
          send(socket, errorEvent('invalid_message', 'Invalid message'));
          return;
        }
        handleClientEvent(socket, parsed.data, sessions, log);
      } catch (error) {
        log.error({ err: error }, 'client message handler failed');
        trySend(socket, errorEvent('internal_error', 'Internal error'));
      }
    });

    socket.on('close', () => {
      sockets.delete(socket);
    });

    socket.on('error', (error) => {
      log.error({ err: error }, 'socket error');
    });
  });
}

function handleClientEvent(
  socket: WebSocket,
  event: ClientEvent,
  sessions: SessionManager,
  log: FastifyBaseLogger,
): void {
  switch (event.type) {
    case 'ping':
      send(socket, { type: 'pong', time: Date.now() });
      return;
    case 'folders_list': {
      const result = listFolders(event.path);
      if (!result.ok) {
        send(socket, errorEvent('folder_invalid', `Cannot open folder (${result.code}).`));
        return;
      }
      send(socket, { type: 'folders', ...result.value });
      return;
    }
    case 'session_start': {
      const result = sessions.start(event.folder);
      if (!result.ok) {
        send(socket, errorEvent('folder_invalid', `Cannot use folder (${result.code}).`));
        return;
      }
      send(socket, { type: 'session_started', room: result.room });
      return;
    }
    case 'session_send':
      sessions.send(event.roomId, event.text);
      return;
    case 'permission_answer':
      sessions.answerPermission(event.roomId, event.requestId, event.decision);
      return;
    case 'history_list':
      sessions
        .listHistory()
        .then((entries) => trySend(socket, { type: 'history', entries }))
        .catch((error: unknown) => {
          log.error({ err: errorName(error) }, 'history list failed');
          trySend(socket, errorEvent('history_failed', 'Cannot load history.'));
        });
      return;
    case 'session_resume':
      sessions
        .resume(event.sessionId)
        .then((result) => {
          if (result.ok) trySend(socket, { type: 'session_started', room: result.room });
          else trySend(socket, errorEvent('resume_failed', `Cannot resume (${result.code}).`));
        })
        .catch((error: unknown) => {
          log.error({ err: errorName(error) }, 'session resume failed');
          trySend(socket, errorEvent('resume_failed', 'Cannot resume (failed).'));
        });
      return;
    case 'session_stop':
      sessions.stop(event.roomId);
      return;
    case 'session_close':
      sessions.close(event.roomId);
      return;
    case 'room_rename':
      sessions.rename(event.roomId, event.name);
      return;
    case 'room_archive':
      sessions.archive(event.roomId);
      return;
    case 'room_restore':
      sessions.restore(event.roomId);
      return;
    case 'archived_list':
      trySend(socket, { type: 'archived', rooms: sessions.listArchived() });
      return;
    case 'session_open':
      sessions
        .history(event.roomId)
        .then((events) => {
          if (!events) trySend(socket, errorEvent('room_not_found', 'Room not found.'));
          else trySend(socket, { type: 'session_history', roomId: event.roomId, events });
        })
        .catch((error: unknown) => {
          log.error({ err: errorName(error) }, 'session open failed');
          trySend(socket, errorEvent('internal_error', 'Internal error'));
        });
      return;
  }
}

function broadcast(sockets: Set<WebSocket>, event: ServerEvent): void {
  for (const socket of sockets) trySend(socket, event);
}

function send(socket: WebSocket, event: ServerEvent): void {
  socket.send(JSON.stringify(event));
}

function trySend(socket: WebSocket, event: ServerEvent): void {
  try {
    send(socket, event);
  } catch {
    // The socket is already closed; nothing else to tell the client.
  }
}

function errorEvent(code: string, message: string): ErrorEvent {
  return { type: 'error', code, message };
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'unknown';
}
