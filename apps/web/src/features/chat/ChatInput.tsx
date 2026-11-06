import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import { sendClientEvent } from '@/features/connection/ws-client';
import { AutocompletePopup, optionId } from '@/features/chat/AutocompletePopup';
import {
  applyPick,
  findToken,
  rankCommands,
  rankFiles,
  rowInsertText,
  tokenKey,
  type AutocompleteRows,
} from '@/features/chat/autocomplete';
import { useAutocompleteStore } from '@/features/chat/use-autocomplete-store';

type ChatInputProps = {
  roomId: string;
  busy: boolean;
  subagentsActive: boolean;
  closed: boolean;
};

const POPUP_ID = 'chat-autocomplete';

export function ChatInput({ roomId, busy, subagentsActive, closed }: ChatInputProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const [active, setActive] = useState({ key: '', index: 0 });
  const [dismissedKey, setDismissedKey] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const connected = useConnectionStore((state) => state.status === 'connected');
  const disabled = busy || !connected;

  const token = useMemo(() => findToken(text, cursor), [text, cursor]);
  const key = tokenKey(token);
  const open = !disabled && token !== null && key !== dismissedKey;
  const kind = token?.trigger === '/' ? 'commands' : 'files';
  const commandList = useAutocompleteStore((state) => state.rooms[roomId]?.commands);
  const fileList = useAutocompleteStore((state) => state.rooms[roomId]?.files);
  const list = kind === 'commands' ? commandList : fileList;
  const ensureList = useAutocompleteStore((state) => state.ensureList);

  const rows = useMemo<AutocompleteRows | null>(() => {
    if (!open || token === null) return null;
    return token.trigger === '/'
      ? { trigger: '/', items: rankCommands(commandList?.items ?? [], token.query) }
      : { trigger: '@', items: rankFiles(fileList?.items ?? [], token.query) };
  }, [open, token, commandList, fileList]);

  useEffect(() => {
    if (open) ensureList(roomId, kind);
  }, [open, roomId, kind, ensureList]);

  const activeIndex = active.key === key ? active.index : 0;
  const hasRows = rows !== null && rows.items.length > 0;

  function submit(): void {
    const trimmed = text.trim();
    if (disabled || trimmed === '') return;
    sendClientEvent({ type: 'session_send', roomId, text: trimmed });
    setText('');
    setCursor(0);
  }

  function pick(index: number): void {
    if (rows === null || token === null) return;
    const insert = rowInsertText(rows, index);
    if (insert === null) return;
    const next = applyPick(text, token, insert);
    setText(next.text);
    setCursor(next.cursor);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(next.cursor, next.cursor);
    });
  }

  function syncCursor(target: HTMLTextAreaElement): void {
    setCursor(target.selectionStart);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.nativeEvent.isComposing) return;
    if (open && rows !== null) {
      const count = rows.items.length;
      if (event.key === 'Escape') {
        event.preventDefault();
        setDismissedKey(key);
        return;
      }
      if (hasRows && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive({ key, index: (activeIndex + step + count) % count });
        return;
      }
      if (hasRows && (event.key === 'Enter' || event.key === 'Tab') && !event.shiftKey) {
        event.preventDefault();
        pick(Math.min(activeIndex, count - 1));
        return;
      }
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="chat-input">
      {open && rows !== null && (
        <AutocompletePopup
          id={POPUP_ID}
          rows={rows}
          status={list?.status ?? 'loading'}
          activeIndex={activeIndex}
          onPick={pick}
        />
      )}
      <textarea
        ref={textareaRef}
        value={text}
        rows={2}
        disabled={disabled}
        placeholder={
          busy
            ? 'Claude is working...'
            : closed
              ? 'Session closed. Send a message to wake it.'
              : 'Message Claude (Enter to send)'
        }
        aria-controls={open ? POPUP_ID : undefined}
        aria-activedescendant={open && hasRows ? optionId(POPUP_ID, activeIndex) : undefined}
        onChange={(event) => {
          setText(event.target.value);
          syncCursor(event.target);
        }}
        onKeyDown={onKeyDown}
        onKeyUp={(event) => syncCursor(event.currentTarget)}
        onClick={(event) => syncCursor(event.currentTarget)}
        onSelect={(event) => syncCursor(event.currentTarget)}
      />
      {!busy && (
        <button
          type="button"
          className="primary"
          disabled={disabled || text.trim() === ''}
          onClick={submit}
        >
          Send
        </button>
      )}
      {(busy || subagentsActive) && (
        <button
          type="button"
          className="danger"
          disabled={!connected}
          onClick={() => sendClientEvent({ type: 'session_stop', roomId })}
        >
          Stop
        </button>
      )}
    </div>
  );
}
