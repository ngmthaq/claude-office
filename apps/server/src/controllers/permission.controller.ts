import type { WebSocket } from 'ws';
import type { ClientEvent } from '@claude-office/shared';
import type { PermissionService } from '@/services/permission.service.ts';

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  answer(_socket: WebSocket, event: Extract<ClientEvent, { type: 'permission_answer' }>): void {
    this.permissionService.answerPermission(event.roomId, event.requestId, event.decision);
  }
}
