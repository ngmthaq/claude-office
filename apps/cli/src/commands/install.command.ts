import { mkdirSync } from 'node:fs';
import {
  BIN_NAME,
  DATA_DIR,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  SERVER_MIGRATE_FILE,
} from '@/configs/cli.config.ts';
import { NpmUtil } from '@/utils/npm.util.ts';
import { ServerProcessUtil } from '@/utils/server-process.util.ts';

export const installCommand = async (): Promise<number> => {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Data folder ready: ${DATA_DIR}`);

  const migrateCode = await ServerProcessUtil.waitForExit(
    ServerProcessUtil.start(SERVER_MIGRATE_FILE),
  );
  if (migrateCode !== 0) {
    console.error('Database setup failed.');
    return 1;
  }

  const npmCode = await NpmUtil.run(['install', '-g', `${PACKAGE_NAME}@${PACKAGE_VERSION}`]);
  if (npmCode !== 0) {
    console.error(`Global install failed (npm exit code ${npmCode}).`);
    return 1;
  }

  console.log(`Installed ${PACKAGE_NAME}@${PACKAGE_VERSION}. Next step: ${BIN_NAME} open`);
  return 0;
};
