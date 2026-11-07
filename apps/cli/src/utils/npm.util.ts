import { spawn } from 'node:child_process';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NpmUtil {
  /** Runs npm with fixed arguments and resolves with its exit code. */
  static run = (args: string[]): Promise<number> =>
    new Promise((resolve) => {
      const child = spawn('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
      child.once('error', () => resolve(1));
      child.once('close', (code) => resolve(code ?? 1));
    });
}
