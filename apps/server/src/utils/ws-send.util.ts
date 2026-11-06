import type { WebSocket } from 'ws';
import type { ErrorEvent, ServerEvent } from '@claude-office/shared';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WsSendUtil {
  static send(socket: WebSocket, event: ServerEvent): void {
    socket.send(JSON.stringify(event));
  }

  static trySend(socket: WebSocket, event: ServerEvent): void {
    try {
      WsSendUtil.send(socket, event);
    } catch {
      // The socket is already closed; nothing else to tell the client.
    }
  }

  static broadcast(sockets: Set<WebSocket>, event: ServerEvent): void {
    for (const socket of sockets) WsSendUtil.trySend(socket, event);
  }

  static errorEvent(code: string, message: string): ErrorEvent {
    return { type: 'error', code, message };
  }
}
