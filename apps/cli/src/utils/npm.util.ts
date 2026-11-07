import { spawn } from 'node:child_process';

const SPAWN_SHELL = process.platform === 'win32';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NpmUtil {
  /** Runs npm with fixed arguments and resolves with its exit code. */
  static run = (args: string[]): Promise<number> =>
    new Promise((resolve) => {
      const child = spawn('npm', args, { stdio: 'inherit', shell: SPAWN_SHELL });
      child.once('error', () => resolve(1));
      child.once('close', (code) => resolve(code ?? 1));
    });

  /** Returns the global node_modules folder, or null when npm cannot tell. */
  static globalRoot = (): Promise<string | null> =>
    new Promise((resolve) => {
      const child = spawn('npm', ['root', '-g'], {
        stdio: ['ignore', 'pipe', 'inherit'],
        shell: SPAWN_SHELL,
      });
      let output = '';
      child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()));
      child.once('error', () => resolve(null));
      child.once('close', (code) => resolve(code === 0 && output.trim() ? output.trim() : null));
    });
}
