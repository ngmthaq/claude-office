import type { FileEntry, SlashCommandEntry } from '@claude-office/shared';

export type Trigger = '/' | '@';

export type AutocompleteToken = {
  trigger: Trigger;
  query: string;
  start: number;
  end: number;
};

export type AutocompleteRows =
  { trigger: '/'; items: SlashCommandEntry[] } | { trigger: '@'; items: FileEntry[] };

const MAX_ROWS = 50;

export function findToken(text: string, cursor: number): AutocompleteToken | null {
  let start = cursor;
  while (start > 0 && !/\s/.test(text[start - 1] ?? '')) start -= 1;
  const trigger = text[start];
  if (trigger !== '/' && trigger !== '@') return null;
  if (trigger === '/' && start !== 0) return null;
  let end = cursor;
  while (end < text.length && !/\s/.test(text[end] ?? '')) end += 1;
  return { trigger, query: text.slice(start + 1, cursor), start, end };
}

export function tokenKey(token: AutocompleteToken | null): string {
  return token === null ? '' : `${token.trigger}${token.start}:${token.query}`;
}

export function rankCommands(list: SlashCommandEntry[], query: string): SlashCommandEntry[] {
  const needle = query.toLowerCase();
  const prefix: SlashCommandEntry[] = [];
  const contains: SlashCommandEntry[] = [];
  for (const entry of list) {
    const name = entry.name.toLowerCase();
    if (name.startsWith(needle)) prefix.push(entry);
    else if (name.includes(needle)) contains.push(entry);
  }
  return [...prefix, ...contains].slice(0, MAX_ROWS);
}

export function rankFiles(list: FileEntry[], query: string): FileEntry[] {
  const needle = query.toLowerCase();
  const prefix: FileEntry[] = [];
  const contains: FileEntry[] = [];
  for (const entry of list) {
    const path = entry.path.toLowerCase();
    const base = path.slice(path.lastIndexOf('/') + 1);
    if (path.startsWith(needle) || base.startsWith(needle)) prefix.push(entry);
    else if (path.includes(needle)) contains.push(entry);
  }
  return [...prefix, ...contains].slice(0, MAX_ROWS);
}

export function rowInsertText(rows: AutocompleteRows, index: number): string | null {
  if (rows.trigger === '/') {
    const command = rows.items[index];
    return command ? `/${command.name} ` : null;
  }
  const file = rows.items[index];
  if (!file) return null;
  return file.kind === 'dir' ? `@${file.path}/` : `@${file.path} `;
}

export function applyPick(
  text: string,
  token: AutocompleteToken,
  insert: string,
): { text: string; cursor: number } {
  return {
    text: text.slice(0, token.start) + insert + text.slice(token.end),
    cursor: token.start + insert.length,
  };
}
