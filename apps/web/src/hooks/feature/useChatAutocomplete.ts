import { useEffect, useMemo, useState, type KeyboardEvent, type RefObject } from 'react';
import { AUTOCOMPLETE_POPUP_ID } from '@/configs/autocomplete.config';
import type { AutocompleteRows } from '@/dtos/autocomplete-token.dto';
import { useAutocompleteLists } from '@/hooks/feature/useAutocompleteLists';
import { useAutocompleteStore } from '@/hooks/store/useAutocompleteStore';
import { AutocompleteUtil } from '@/utils/autocomplete.util';

type ChatAutocompleteParams = {
  roomId: string;
  text: string;
  cursor: number;
  disabled: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onTextChange: (text: string, cursor: number) => void;
};

type ChatAutocomplete = {
  popupId: string;
  open: boolean;
  rows: AutocompleteRows | null;
  hasRows: boolean;
  status: 'loading' | 'ready' | 'error';
  activeIndex: number;
  pick: (index: number) => void;
  /** Returns true when the key was handled, so the caller must not handle it again. */
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => boolean;
};

export function useChatAutocomplete({
  roomId,
  text,
  cursor,
  disabled,
  textareaRef,
  onTextChange,
}: ChatAutocompleteParams): ChatAutocomplete {
  const [active, setActive] = useState({ key: '', index: 0 });
  const [dismissedKey, setDismissedKey] = useState('');

  const token = useMemo(() => AutocompleteUtil.findToken(text, cursor), [text, cursor]);
  const key = AutocompleteUtil.tokenKey(token);
  const open = !disabled && token !== null && key !== dismissedKey;
  const kind = token?.trigger === '/' ? 'commands' : 'files';
  const commandList = useAutocompleteStore((state) => state.rooms[roomId]?.commands);
  const fileList = useAutocompleteStore((state) => state.rooms[roomId]?.files);
  const list = kind === 'commands' ? commandList : fileList;
  const { ensureList } = useAutocompleteLists();

  const rows = useMemo<AutocompleteRows | null>(() => {
    if (!open || token === null) return null;
    return token.trigger === '/'
      ? {
          trigger: '/',
          items: AutocompleteUtil.rankCommands(commandList?.items ?? [], token.query),
        }
      : { trigger: '@', items: AutocompleteUtil.rankFiles(fileList?.items ?? [], token.query) };
  }, [open, token, commandList, fileList]);

  useEffect(() => {
    if (open) ensureList(roomId, kind);
  }, [open, roomId, kind, ensureList]);

  const activeIndex = active.key === key ? active.index : 0;
  const hasRows = rows !== null && rows.items.length > 0;

  function pick(index: number): void {
    if (rows === null || token === null) return;
    const insert = AutocompleteUtil.rowInsertText(rows, index);
    if (insert === null) return;
    const next = AutocompleteUtil.applyPick(text, token, insert);
    onTextChange(next.text, next.cursor);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(next.cursor, next.cursor);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
    if (!open || rows === null) return false;
    const count = rows.items.length;
    if (event.key === 'Escape') {
      event.preventDefault();
      setDismissedKey(key);
      return true;
    }
    if (hasRows && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive({ key, index: (activeIndex + step + count) % count });
      return true;
    }
    if (hasRows && (event.key === 'Enter' || event.key === 'Tab') && !event.shiftKey) {
      event.preventDefault();
      pick(Math.min(activeIndex, count - 1));
      return true;
    }
    return false;
  }

  return {
    popupId: AUTOCOMPLETE_POPUP_ID,
    open,
    rows,
    hasRows,
    status: list?.status ?? 'loading',
    activeIndex,
    pick,
    handleKeyDown,
  };
}
