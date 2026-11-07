import { spawn } from 'node:child_process';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BrowserUtil {
  /** Returns false when the browser could not be started. */
  static open = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      const [command, args] = BrowserUtil.commandFor(url);
      const child = spawn(command, args, { stdio: 'ignore', detached: true });
      child.once('error', () => resolve(false));
      child.once('spawn', () => {
        child.unref();
        resolve(true);
      });
    });

  private static commandFor = (url: string): [string, string[]] => {
    if (process.platform === 'darwin') return ['open', [url]];
    if (process.platform === 'win32') return ['cmd', ['/c', 'start', '""', url]];
    return ['xdg-open', [url]];
  };
}
