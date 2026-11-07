import { chmodSync, cpSync, rmSync } from 'node:fs';
import { build } from 'esbuild';

const SERVER_DIST = '../server/dist';
const SERVER_MIGRATIONS = '../server/src/migrations';
const WEB_DIST = '../web/dist';

rmSync('dist', { recursive: true, force: true });

await build({
  entryPoints: ['src/cli.ts'],
  outfile: 'dist/cli.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node24',
  tsconfig: 'tsconfig.json',
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'info',
});
chmodSync('dist/cli.js', 0o755);

cpSync(SERVER_DIST, 'dist/server', { recursive: true });
cpSync(SERVER_MIGRATIONS, 'dist/server/migrations', { recursive: true });
cpSync(WEB_DIST, 'dist/web', { recursive: true });
