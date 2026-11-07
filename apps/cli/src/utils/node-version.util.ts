import { MIN_NODE_MAJOR } from '@/configs/cli.config.ts';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NodeVersionUtil {
  static isSupported = (): boolean => Number(process.versions.node.split('.')[0]) >= MIN_NODE_MAJOR;
}
