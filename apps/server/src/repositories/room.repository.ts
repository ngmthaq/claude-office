import type { PermissionMode } from '@claude-office/shared';
import type Database from 'better-sqlite3';
import { parseRoomRow, type RawRoomRow, type RoomRow } from '@/dtos/room-row.dto.ts';

const COLUMNS = 'id, session_id, folder, created_at, name, archived_at, permission_mode';

export class RoomRepository {
  private readonly insertStmt;
  private readonly setSessionStmt;
  private readonly getStmt;
  private readonly listWithSessionStmt;
  private readonly setNameStmt;
  private readonly setArchivedStmt;
  private readonly deleteStmt;
  private readonly setPermissionModeStmt;
  private readonly listArchivedStmt;
  private readonly newestBySessionStmt;

  constructor(db: Database.Database) {
    this.insertStmt = db.prepare(
      'INSERT INTO rooms (id, session_id, folder, created_at) VALUES (?, ?, ?, ?)',
    );
    this.setSessionStmt = db.prepare('UPDATE rooms SET session_id = ? WHERE id = ?');
    this.getStmt = db.prepare<[string], RawRoomRow>(`SELECT ${COLUMNS} FROM rooms WHERE id = ?`);
    this.listWithSessionStmt = db.prepare<[], RawRoomRow>(
      `SELECT ${COLUMNS} FROM rooms WHERE session_id IS NOT NULL ORDER BY created_at DESC`,
    );
    this.setNameStmt = db.prepare('UPDATE rooms SET name = ? WHERE id = ?');
    this.setArchivedStmt = db.prepare('UPDATE rooms SET archived_at = ? WHERE id = ?');
    this.deleteStmt = db.prepare('DELETE FROM rooms WHERE id = ?');
    this.setPermissionModeStmt = db.prepare('UPDATE rooms SET permission_mode = ? WHERE id = ?');
    this.listArchivedStmt = db.prepare<[], RawRoomRow>(
      `SELECT ${COLUMNS} FROM rooms WHERE archived_at IS NOT NULL ORDER BY archived_at DESC`,
    );
    this.newestBySessionStmt = db.prepare<[string], RawRoomRow>(
      `SELECT ${COLUMNS} FROM rooms WHERE session_id = ? ORDER BY created_at DESC LIMIT 1`,
    );
  }

  insert(id: string, folder: string, createdAt: number, sessionId: string | null = null): void {
    this.insertStmt.run(id, sessionId, folder, createdAt);
  }

  setSessionId(id: string, sessionId: string): void {
    this.setSessionStmt.run(sessionId, id);
  }

  setName(id: string, name: string | null): void {
    this.setNameStmt.run(name, id);
  }

  setArchived(id: string, archivedAt: number | null): void {
    this.setArchivedStmt.run(archivedAt, id);
  }

  delete(id: string): void {
    this.deleteStmt.run(id);
  }

  setPermissionMode(id: string, mode: PermissionMode): void {
    this.setPermissionModeStmt.run(mode, id);
  }

  listArchived(): RoomRow[] {
    return this.listArchivedStmt.all().map(parseRoomRow);
  }

  getNewestBySessionId(sessionId: string): RoomRow | undefined {
    const row = this.newestBySessionStmt.get(sessionId);
    return row ? parseRoomRow(row) : undefined;
  }

  get(id: string): RoomRow | undefined {
    const row = this.getStmt.get(id);
    return row ? parseRoomRow(row) : undefined;
  }

  listWithSession(): RoomRow[] {
    return this.listWithSessionStmt.all().map(parseRoomRow);
  }
}
