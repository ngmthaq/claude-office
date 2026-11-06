import type { WebSocket } from 'ws';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class SystemController {
  ping(socket: WebSocket): void {
    WsSendUtil.send(socket, { type: 'pong', time: Date.now() });
  }
}
