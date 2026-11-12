import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const { version } = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as { version: string };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('../../assets', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] },
    proxy: {
      '/ws': { target: 'ws://127.0.0.1:4317', ws: true },
    },
  },
});
