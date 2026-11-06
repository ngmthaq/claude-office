import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { RoomService } from '@/services/room.service.ts';
import { WsSendUtil } from '@/utils/ws-send.util.ts';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  rename(_socket: WebSocket, event: Extract<ClientEvent, { type: 'room_rename' }>): void {
    this.roomService.rename(event.roomId, event.name);
  }

  permissionMode(
    _socket: WebSocket,
    event: Extract<ClientEvent, { type: 'room_permission_mode' }>,
  ): void {
    void this.roomService.setPermissionMode(event.roomId, event.mode);
  }

  archive(_socket: WebSocket, event: Extract<ClientEvent, { type: 'room_archive' }>): void {
    this.roomService.archive(event.roomId);
  }

  remove(_socket: WebSocket, event: Extract<ClientEvent, { type: 'room_remove' }>): void {
    this.roomService.remove(event.roomId);
  }

  restore(_socket: WebSocket, event: Extract<ClientEvent, { type: 'room_restore' }>): void {
    this.roomService.restore(event.roomId);
  }

  archivedList(socket: WebSocket): void {
    WsSendUtil.trySend(socket, { type: 'archived', rooms: this.roomService.listArchived() });
  }
}
