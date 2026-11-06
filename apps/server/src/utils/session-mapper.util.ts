import type { RoomEvent } from '@claude-office/shared';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SessionMapperUtil {
  static errorEvent(roomId: string, code: string, message: string): RoomEvent {
    return { type: 'session_error', roomId, code, message };
  }
}
