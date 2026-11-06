import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { HOST, PORT } from '@/configs/app.config.ts';
import { openDatabase, runMigrations } from '@/configs/database.config.ts';
import { CommandController } from '@/controllers/command.controller.ts';
import { FileController } from '@/controllers/file.controller.ts';
import { FolderController } from '@/controllers/folder.controller.ts';
import { HistoryController } from '@/controllers/history.controller.ts';
import { McpController } from '@/controllers/mcp.controller.ts';
import { PermissionController } from '@/controllers/permission.controller.ts';
import { RoomController } from '@/controllers/room.controller.ts';
import { SessionController } from '@/controllers/session.controller.ts';
import { SystemController } from '@/controllers/system.controller.ts';
import { OriginCheckMiddleware } from '@/middlewares/origin-check.middleware.ts';
import { CommandRepository } from '@/repositories/command.repository.ts';
import { FileRepository } from '@/repositories/file.repository.ts';
import { FolderRepository } from '@/repositories/folder.repository.ts';
import { HistoryRepository } from '@/repositories/history.repository.ts';
import { RoomRepository } from '@/repositories/room.repository.ts';
import { SessionStoreRepository } from '@/repositories/session-store.repository.ts';
import { registerWsRoute } from '@/routes/ws.route.ts';
import { CatalogService } from '@/services/catalog.service.ts';
import { EventBusService } from '@/services/event-bus.service.ts';
import { PermissionService } from '@/services/permission.service.ts';
import { RoomService } from '@/services/room.service.ts';
import { SdkEventMapperService } from '@/services/sdk-event-mapper.service.ts';
import { SessionService } from '@/services/session.service.ts';

const app = Fastify({ logger: true });

async function main(): Promise<void> {
  const db = openDatabase();
  const applied = runMigrations(db);
  app.log.info({ applied }, 'migrations applied');
  await app.register(websocket);

  const roomRepository = new RoomRepository(db);
  const sessionStoreRepository = new SessionStoreRepository();
  const folderRepository = new FolderRepository();
  const fileRepository = new FileRepository();
  const commandRepository = new CommandRepository();
  const historyRepository = new HistoryRepository(folderRepository);
  const sdkEventMapperService = new SdkEventMapperService();
  const eventBusService = new EventBusService();
  const permissionService = new PermissionService(sessionStoreRepository, eventBusService, app.log);
  const sessionService = new SessionService(
    roomRepository,
    sessionStoreRepository,
    historyRepository,
    folderRepository,
    sdkEventMapperService,
    eventBusService,
    permissionService,
    app.log,
  );
  const roomService = new RoomService(
    roomRepository,
    sessionStoreRepository,
    eventBusService,
    sessionService,
    app.log,
  );
  const catalogService = new CatalogService(sessionStoreRepository, commandRepository, app.log);
  sessionService.loadClosedRooms();

  await app.register(registerWsRoute, {
    originCheckMiddleware: new OriginCheckMiddleware(),
    eventBusService,
    sessionService,
    roomService,
    systemController: new SystemController(),
    sessionController: new SessionController(sessionService),
    roomController: new RoomController(roomService),
    permissionController: new PermissionController(permissionService),
    folderController: new FolderController(folderRepository),
    fileController: new FileController(sessionService, folderRepository, fileRepository),
    commandController: new CommandController(catalogService),
    mcpController: new McpController(catalogService),
    historyController: new HistoryController(sessionService),
  });
  app.addHook('onClose', () => {
    sessionService.closeAll();
    db.close();
  });
  await app.listen({ host: HOST, port: PORT });
}

main().catch((error: unknown) => {
  app.log.error({ err: error }, 'server failed to start');
  process.exit(1);
});
