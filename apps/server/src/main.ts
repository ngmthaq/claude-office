import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { HOST, PORT } from './config.ts';
import { openDatabase } from './db/database.ts';
import { runMigrations } from './db/migrate.ts';
import { RoomsRepo } from './db/rooms-repo.ts';
import { SessionManager } from './sessions/session-manager.ts';
import { registerWsRoute } from './ws/ws-route.ts';

const app = Fastify({ logger: true });

async function main(): Promise<void> {
  const db = openDatabase();
  const applied = runMigrations(db);
  app.log.info({ applied }, 'migrations applied');

  await app.register(websocket);
  const sessions = new SessionManager(new RoomsRepo(db), app.log);
  sessions.loadClosedRooms();
  await app.register(registerWsRoute, { sessions });
  app.addHook('onClose', () => {
    sessions.closeAll();
    db.close();
  });
  await app.listen({ host: HOST, port: PORT });
}

main().catch((error: unknown) => {
  app.log.error({ err: error }, 'server failed to start');
  process.exit(1);
});
