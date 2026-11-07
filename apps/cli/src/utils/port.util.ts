import { createServer } from 'node:net';
import { HOST } from '@/configs/cli.config.ts';

const MIN_PORT = 1;
const MAX_PORT = 65535;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PortUtil {
  static parse = (value: string): number | null => {
    if (!/^\d+$/.test(value)) return null;
    const port = Number(value);
    return port >= MIN_PORT && port <= MAX_PORT ? port : null;
  };

  static isFree = (port: number): Promise<boolean> =>
    new Promise((resolve) => {
      const probe = createServer();
      probe.once('error', () => resolve(false));
      probe.listen(port, HOST, () => probe.close(() => resolve(true)));
    });
}
