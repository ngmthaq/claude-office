import { useEffect } from 'react';
import type { HistoryEntry } from '@claude-office/shared';
import { sendClientEvent } from '@/features/connection/ws-client';
import { useHistoryStore } from '@/features/history/use-history-store';
import { useSessionsStore } from '@/features/sessions/use-sessions-store';

type FolderGroup = { folder: string; latest: number; entries: HistoryEntry[] };

export function HistoryDialog() {
  const open = useHistoryStore((state) => state.open);
  const loading = useHistoryStore((state) => state.loading);
  const error = useHistoryStore((state) => state.error);
  const entries = useHistoryStore((state) => state.entries);
  const resumingId = useHistoryStore((state) => state.resumingId);
  const close = useHistoryStore((state) => state.close);
  const startResume = useHistoryStore((state) => state.startResume);
  const select = useSessionsStore((state) => state.select);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  if (!open) return null;

  const groups = groupByFolder(entries);

  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <h2 id="history-title">History</h2>
        <p className="muted">Past Claude sessions, grouped by project folder.</p>
        {error && <p className="form-error">{error}</p>}
        <div className="history-list">
          {loading && <p className="muted">Loading…</p>}
          {!loading && !error && groups.length === 0 && <p className="muted">No past sessions.</p>}
          {groups.map((group) => (
            <section key={group.folder} className="history-group">
              <h3 className="history-group__title" title={group.folder}>
                {lastSegment(group.folder)}
              </h3>
              <ul className="history-group__list">
                {group.entries.map((entry) => (
                  <li key={entry.sessionId} className="history-row">
                    <div className="history-row__text">
                      <span className="history-row__title" title={entry.title}>
                        {entry.title}
                      </span>
                      <span className="muted history-row__meta">
                        {new Date(entry.lastModified).toLocaleString()}
                      </span>
                      {entry.firstPrompt && entry.firstPrompt !== entry.title && (
                        <span className="muted history-row__prompt" title={entry.firstPrompt}>
                          {entry.firstPrompt}
                        </span>
                      )}
                    </div>
                    {entry.openRoomId !== null ? (
                      <button
                        type="button"
                        onClick={() => {
                          select(entry.openRoomId);
                          close();
                        }}
                      >
                        Open
                      </button>
                    ) : !entry.canResume ? (
                      <span className="muted">Folder not available</span>
                    ) : (
                      <button
                        type="button"
                        className="primary"
                        disabled={resumingId === entry.sessionId}
                        onClick={() => {
                          startResume(entry.sessionId);
                          sendClientEvent({ type: 'session_resume', sessionId: entry.sessionId });
                        }}
                      >
                        {resumingId === entry.sessionId ? 'Resuming…' : 'Resume'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="dialog__actions">
          <button type="button" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function groupByFolder(entries: HistoryEntry[]): FolderGroup[] {
  const byFolder = new Map<string, FolderGroup>();
  for (const entry of entries) {
    const time = toTime(entry.lastModified);
    const group = byFolder.get(entry.folder);
    if (group) {
      group.entries.push(entry);
      group.latest = Math.max(group.latest, time);
    } else {
      byFolder.set(entry.folder, { folder: entry.folder, latest: time, entries: [entry] });
    }
  }
  const groups = [...byFolder.values()];
  for (const group of groups) {
    group.entries.sort((a, b) => toTime(b.lastModified) - toTime(a.lastModified));
  }
  return groups.sort((a, b) => b.latest - a.latest);
}

function toTime(value: HistoryEntry['lastModified']): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function lastSegment(folder: string): string {
  const parts = folder.split(/[\\/]/).filter(Boolean);
  return parts[parts.length - 1] ?? folder;
}
