import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const { dependencies } = JSON.parse(readFileSync('package.json', 'utf8'));
const external = Object.entries(dependencies)
  .filter(([, version]) => !version.startsWith('workspace:'))
  .map(([name]) => name);

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/main.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node24',
  tsconfig: 'tsconfig.json',
  external,
  logLevel: 'info',
});
