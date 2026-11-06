import type { HistoryEntry } from '@claude-office/shared';

export type FolderGroup = { folder: string; latest: number; entries: HistoryEntry[] };

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HistoryUtil {
  static groupByFolder(entries: HistoryEntry[]): FolderGroup[] {
    const byFolder = new Map<string, FolderGroup>();
    for (const entry of entries) {
      const time = HistoryUtil.toTime(entry.lastModified);
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
      group.entries.sort(
        (a, b) => HistoryUtil.toTime(b.lastModified) - HistoryUtil.toTime(a.lastModified),
      );
    }
    return groups.sort((a, b) => b.latest - a.latest);
  }

  static toTime(value: HistoryEntry['lastModified']): number {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  static lastSegment(folder: string): string {
    const parts = folder.split(/[\\/]/).filter(Boolean);
    return parts[parts.length - 1] ?? folder;
  }
}
