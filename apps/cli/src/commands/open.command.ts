import { mkdirSync } from 'node:fs';
import { BIN_NAME, DATA_DIR, DEFAULT_PORT, HOST, SERVER_MAIN_FILE } from '@/configs/cli.config.ts';
import { BrowserUtil } from '@/utils/browser.util.ts';
import { PortUtil } from '@/utils/port.util.ts';
import { ServerProcessUtil } from '@/utils/server-process.util.ts';

export const openCommand = async (args: string[]): Promise<number> => {
  const port = args[0] === undefined ? DEFAULT_PORT : PortUtil.parse(args[0]);
  if (port === null) {
    console.error(`Invalid port "${args[0]}". Use a whole number from 1 to 65535.`);
    console.error(`Example: ${BIN_NAME} open 4317`);
    return 1;
  }
  if (!(await PortUtil.isFree(port))) {
    console.error(`Port ${port} is already in use. Pick another port: ${BIN_NAME} open <PORT>`);
    return 1;
  }

  mkdirSync(DATA_DIR, { recursive: true });
  const url = `http://${HOST}:${port}`;
  const child = ServerProcessUtil.start(SERVER_MAIN_FILE, { PORT: String(port) });
  const exited = ServerProcessUtil.waitForExit(child);

  let stopping = false;
  const stop = (): void => {
    stopping = true;
    child.kill('SIGTERM');
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  if (await ServerProcessUtil.waitUntilReady(url, child)) {
    console.log(`Claude Office is running at ${url} (Ctrl+C to stop)`);
    if (!(await BrowserUtil.open(url))) {
      console.warn(`Could not open the browser. Open this address yourself: ${url}`);
    }
  } else if (!stopping) {
    console.error(`The server did not become ready at ${url}.`);
    child.kill('SIGTERM');
    await exited;
    return 1;
  }

  const code = await exited;
  return stopping ? 0 : code;
};
