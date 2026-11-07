import type { FastifyBaseLogger, FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';
import { parseClientEvent, type ClientEvent } from '@claude-office/shared';
import { SERVER_VERSION } from '@/configs/app.config.ts';
import type { CommandController } from '@/controllers/command.controller.ts';
import type { FileController } from '@/controllers/file.controller.ts';
import type { FolderController } from '@/controllers/folder.controller.ts';
import type { HistoryController } from '@/controllers/history.controller.ts';
import type { McpController } from '@/controllers/mcp.controller.ts';
import type { PermissionController } from '@/controllers/permission.controller.ts';
import type { RoomController } from '@/controllers/room.controller.ts';
import type { SessionController } from '@/controllers/session.controller.ts';
import type { SystemController } from '@/controllers/system.controller.ts';
import type { OriginCheckMiddleware } from '@/middlewares/origin-check.middleware.ts';
import type { EventBusService } from '@/services/event-bus.service.ts';
import type { RoomService } from '@/services/room.service.ts';
import type { UsageLimitService } from '@/services/usage-limit.service.ts';
import type { SessionService } from '@/services/session.service.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export type WsRouteOptions = {
  originCheckMiddleware: OriginCheckMiddleware;
  eventBusService: EventBusService;
  sessionService: SessionService;
  roomService: RoomService;
  usageLimitService: UsageLimitService;
  systemController: SystemController;
  sessionController: SessionController;
  roomController: RoomController;
  permissionController: PermissionController;
  folderController: FolderController;
  fileController: FileController;
  commandController: CommandController;
  mcpController: McpController;
  historyController: HistoryController;
};

export async function registerWsRoute(
  app: FastifyInstance,
  options: WsRouteOptions,
): Promise<void> {
  const { originCheckMiddleware, eventBusService, sessionService, roomService, usageLimitService } =
    options;
  const sockets = new Set<WebSocket>();

  eventBusService.onRoomEvent((event) => WsSendUtil.broadcast(sockets, event));
  eventBusService.onSessionState((event) => WsSendUtil.broadcast(sockets, event));
  eventBusService.onRoomsChanged(() =>
    WsSendUtil.broadcast(sockets, { type: 'sessions', rooms: sessionService.list() }),
  );
  eventBusService.onArchivedChanged(() =>
    WsSendUtil.broadcast(sockets, { type: 'archived', rooms: roomService.listArchived() }),
  );

  eventBusService.onUsageLimitChanged(() => {
    const limit = usageLimitService.current();
    if (limit) WsSendUtil.broadcast(sockets, { type: 'usage_limit', limit });
  });

  app.get(
    '/ws',
    { websocket: true, onRequest: originCheckMiddleware.handle },
    (socket, request) => {
      const log = request.log;
      sockets.add(socket);
      try {
        WsSendUtil.send(socket, { type: 'hello', serverVersion: SERVER_VERSION, time: Date.now() });
        WsSendUtil.send(socket, { type: 'sessions', rooms: sessionService.list() });
        const limit = usageLimitService.current();
        if (limit) WsSendUtil.send(socket, { type: 'usage_limit', limit });
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
            WsSendUtil.send(socket, WsSendUtil.errorEvent('invalid_message', 'Invalid message'));
            return;
          }
          dispatch(socket, parsed.data, options, log);
        } catch (error) {
          log.error({ err: error }, 'client message handler failed');
          WsSendUtil.trySend(socket, WsSendUtil.errorEvent('internal_error', 'Internal error'));
        }
      });

      socket.on('close', () => {
        sockets.delete(socket);
      });

      socket.on('error', (error) => {
        log.error({ err: error }, 'socket error');
      });
    },
  );
}

function dispatch(
  socket: WebSocket,
  event: ClientEvent,
  options: WsRouteOptions,
  log: FastifyBaseLogger,
): void {
  switch (event.type) {
    case 'ping':
      return options.systemController.ping(socket);
    case 'folders_list':
      return options.folderController.list(socket, event);
    case 'commands_list':
      return options.commandController.list(socket, event, log);
    case 'mcp_list':
      return options.mcpController.list(socket, event, log);
    case 'files_list':
      return options.fileController.list(socket, event, log);
    case 'session_start':
      return options.sessionController.start(socket, event);
    case 'session_send':
      return options.sessionController.send(socket, event);
    case 'permission_answer':
      return options.permissionController.answer(socket, event);
    case 'history_list':
      return options.historyController.list(socket, event, log);
    case 'session_resume':
      return options.sessionController.resume(socket, event, log);
    case 'session_stop':
      return options.sessionController.stop(socket, event);
    case 'session_close':
      return options.sessionController.close(socket, event);
    case 'room_rename':
      return options.roomController.rename(socket, event);
    case 'room_permission_mode':
      return options.roomController.permissionMode(socket, event);
    case 'room_archive':
      return options.roomController.archive(socket, event);
    case 'room_remove':
      return options.roomController.remove(socket, event);
    case 'room_restore':
      return options.roomController.restore(socket, event);
    case 'archived_list':
      return options.roomController.archivedList(socket);
    case 'session_open':
      return options.sessionController.open(socket, event, log);
  }
}
