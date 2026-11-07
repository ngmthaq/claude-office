import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BIN_NAME, DATA_DIR, PACKAGE_NAME, PACKAGE_VERSION } from '@/configs/cli.config.ts';
import { NpmUtil } from '@/utils/npm.util.ts';
import { ServerProcessUtil } from '@/utils/server-process.util.ts';

const readVersion = (packageDir: string): string =>
  (JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')) as { version: string })
    .version;

export const upgradeCommand = async (): Promise<number> => {
  const npmCode = await NpmUtil.run(['install', '-g', `${PACKAGE_NAME}@latest`]);
  if (npmCode !== 0) {
    console.error(`Global install failed (npm exit code ${npmCode}).`);
    return 1;
  }

  const globalRoot = await NpmUtil.globalRoot();
  const packageDir = globalRoot === null ? null : join(globalRoot, PACKAGE_NAME);
  if (packageDir === null || !existsSync(join(packageDir, 'package.json'))) {
    console.error(
      `Could not find the installed ${PACKAGE_NAME}. Run "${BIN_NAME} open" to finish the database setup.`,
    );
    return 1;
  }

  // New migrations ship with the new version, so run that version's migrate script, not ours.
  const serverDir = join(packageDir, 'dist', 'server');
  mkdirSync(DATA_DIR, { recursive: true });
  const migrateCode = await ServerProcessUtil.waitForExit(
    ServerProcessUtil.start(join(serverDir, 'migrate.js'), {
      CLAUDE_OFFICE_MIGRATIONS_DIR: join(serverDir, 'migrations'),
    }),
  );
  if (migrateCode !== 0) {
    console.error(
      `Database migration failed. Fix the error above, then run "${BIN_NAME} upgrade" again.`,
    );
    return 1;
  }

  console.log(`Upgraded ${PACKAGE_NAME}: ${PACKAGE_VERSION} -> ${readVersion(packageDir)}`);
  console.log(`Restart any running "${BIN_NAME} open" to use the new version.`);
  return 0;
};
