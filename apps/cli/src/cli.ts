import { BIN_NAME, DEFAULT_PORT, MIN_NODE_MAJOR, PACKAGE_NAME } from '@/configs/cli.config.ts';
import { installCommand } from '@/commands/install.command.ts';
import { openCommand } from '@/commands/open.command.ts';
import { uninstallCommand } from '@/commands/uninstall.command.ts';
import { NodeVersionUtil } from '@/utils/node-version.util.ts';

const USAGE = `Usage: ${BIN_NAME} <command>

Commands:
  install             Create the data folder, set up the database, and install ${PACKAGE_NAME} globally
  uninstall [--yes]   Remove the global package (asks before deleting the data folder; --yes skips the question)
  open [PORT]         Start Claude Office and open it in the browser (default port ${DEFAULT_PORT})
  help                Show this message`;

const run = async (command: string | undefined, args: string[]): Promise<number> => {
  switch (command) {
    case 'install':
      return installCommand();
    case 'uninstall':
      return uninstallCommand(args);
    case 'open':
      return openCommand(args);
    case 'help':
      console.log(USAGE);
      return 0;
    default:
      if (command !== undefined) console.error(`Unknown command "${command}".\n`);
      console.error(USAGE);
      return 1;
  }
};

if (!NodeVersionUtil.isSupported()) {
  console.error(
    `${PACKAGE_NAME} needs Node ${MIN_NODE_MAJOR} or newer. You have ${process.version}.`,
  );
  process.exit(1);
}

const [command, ...args] = process.argv.slice(2);
process.exit(await run(command, args));
