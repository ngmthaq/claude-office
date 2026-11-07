import { spawn, type ChildProcess } from 'node:child_process';
import {
  DATA_DIR,
  MIGRATIONS_DIR,
  READY_POLL_MS,
  READY_TIMEOUT_MS,
  WEB_DIST_DIR,
} from '@/configs/cli.config.ts';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ServerProcessUtil {
  static start = (file: string, extraEnv: Record<string, string> = {}): ChildProcess =>
    spawn(process.execPath, [file], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        CLAUDE_OFFICE_DATA_DIR: DATA_DIR,
        CLAUDE_OFFICE_WEB_DIST_DIR: WEB_DIST_DIR,
        CLAUDE_OFFICE_MIGRATIONS_DIR: MIGRATIONS_DIR,
        ...extraEnv,
      },
    });

  static waitForExit = (child: ChildProcess): Promise<number> =>
    new Promise((resolve) => {
      if (child.exitCode !== null) return resolve(child.exitCode);
      child.once('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
    });

  /** Resolves true when the server answers, false on timeout or when the child exits first. */
  static waitUntilReady = async (url: string, child: ChildProcess): Promise<boolean> => {
    const deadline = Date.now() + READY_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (child.exitCode !== null || child.signalCode !== null) return false;
      try {
        if ((await fetch(url)).ok) return true;
      } catch {
        // not listening yet
      }
      await new Promise((resolve) => setTimeout(resolve, READY_POLL_MS));
    }
    return false;
  };
}
