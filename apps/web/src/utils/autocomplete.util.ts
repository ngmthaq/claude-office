import type { FileEntry, SlashCommandEntry } from '@claude-office/shared';
import { AUTOCOMPLETE_MAX_ROWS } from '@/configs/autocomplete.config';
import type { AutocompleteRows, AutocompleteToken } from '@/dtos/autocomplete-token.dto';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AutocompleteUtil {
  static findToken(text: string, cursor: number): AutocompleteToken | null {
    let start = cursor;
    while (start > 0 && !/\s/.test(text[start - 1] ?? '')) start -= 1;
    const trigger = text[start];
    if (trigger !== '/' && trigger !== '@') return null;
    if (trigger === '/' && start !== 0) return null;
    let end = cursor;
    while (end < text.length && !/\s/.test(text[end] ?? '')) end += 1;
    return { trigger, query: text.slice(start + 1, cursor), start, end };
  }

  static tokenKey(token: AutocompleteToken | null): string {
    return token === null ? '' : `${token.trigger}${token.start}:${token.query}`;
  }

  static rankCommands(list: SlashCommandEntry[], query: string): SlashCommandEntry[] {
    const needle = query.toLowerCase();
    const prefix: SlashCommandEntry[] = [];
    const contains: SlashCommandEntry[] = [];
    for (const entry of list) {
      const name = entry.name.toLowerCase();
      if (name.startsWith(needle)) prefix.push(entry);
      else if (name.includes(needle)) contains.push(entry);
    }
    return [...prefix, ...contains].slice(0, AUTOCOMPLETE_MAX_ROWS);
  }

  static rankFiles(list: FileEntry[], query: string): FileEntry[] {
    const needle = query.toLowerCase();
    const prefix: FileEntry[] = [];
    const contains: FileEntry[] = [];
    for (const entry of list) {
      const path = entry.path.toLowerCase();
      const base = path.slice(path.lastIndexOf('/') + 1);
      if (path.startsWith(needle) || base.startsWith(needle)) prefix.push(entry);
      else if (path.includes(needle)) contains.push(entry);
    }
    return [...prefix, ...contains].slice(0, AUTOCOMPLETE_MAX_ROWS);
  }

  static rowInsertText(rows: AutocompleteRows, index: number): string | null {
    if (rows.trigger === '/') {
      const command = rows.items[index];
      return command ? `/${command.name} ` : null;
    }
    const file = rows.items[index];
    if (!file) return null;
    return file.kind === 'dir' ? `@${file.path}/` : `@${file.path} `;
  }

  static applyPick(
    text: string,
    token: AutocompleteToken,
    insert: string,
  ): { text: string; cursor: number } {
    return {
      text: text.slice(0, token.start) + insert + text.slice(token.end),
      cursor: token.start + insert.length,
    };
  }

  static optionId(popupId: string, index: number): string {
    return `${popupId}-opt-${index}`;
  }
}
