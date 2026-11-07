import { rmSync } from 'node:fs';
import { DATA_DIR, PACKAGE_NAME } from '@/configs/cli.config.ts';
import { NpmUtil } from '@/utils/npm.util.ts';
import { PromptUtil } from '@/utils/prompt.util.ts';

const shouldDeleteData = async (skipQuestion: boolean): Promise<boolean> => {
  if (skipQuestion) return true;
  if (!process.stdin.isTTY) {
    console.log('No terminal to ask in. Keeping the data folder (use --yes to delete it).');
    return false;
  }
  return PromptUtil.confirm(`Delete data folder ${DATA_DIR}?`);
};

export const uninstallCommand = async (args: string[]): Promise<number> => {
  const deleteData = await shouldDeleteData(args.includes('--yes'));
  if (deleteData) rmSync(DATA_DIR, { recursive: true, force: true });

  const npmCode = await NpmUtil.run(['uninstall', '-g', PACKAGE_NAME]);
  if (npmCode !== 0) {
    console.error(`Global uninstall failed (npm exit code ${npmCode}).`);
    return 1;
  }

  console.log(`Removed: global package ${PACKAGE_NAME}`);
  console.log(deleteData ? `Removed: ${DATA_DIR}` : `Kept: ${DATA_DIR}`);
  return 0;
};
