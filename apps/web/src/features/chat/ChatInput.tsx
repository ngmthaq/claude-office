import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import { IconButton } from '@/components/IconButton';
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
import { useSessionsStore } from '@/features/sessions/use-sessions-store';
import type { PermissionMode } from '@claude-office/shared';
import { useAutocompleteStore } from '@/features/chat/use-autocomplete-store';

type ChatInputProps = {
  roomId: string;
  busy: boolean;
  subagentsActive: boolean;
  closed: boolean;
};

const POPUP_ID = 'chat-autocomplete';

type ModeOption = { value: PermissionMode; label: string; icon: string };

const MODE_BY_VALUE: Record<PermissionMode, ModeOption> = {
  default: { value: 'default', label: 'Ask permission', icon: 'shield-check' },
  acceptEdits: { value: 'acceptEdits', label: 'Accept edits', icon: 'pencil-square' },
  auto: { value: 'auto', label: 'Auto', icon: 'magic' },
};

const MODE_OPTIONS = Object.values(MODE_BY_VALUE);

export function ChatInput({ roomId, busy, subagentsActive, closed }: ChatInputProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const [active, setActive] = useState({ key: '', index: 0 });
  const [dismissedKey, setDismissedKey] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const connected = useConnectionStore((state) => state.status === 'connected');
  const disabled = busy || !connected;
  const permissionMode = useSessionsStore(
    (state) => state.rooms.find((room) => room.id === roomId)?.permissionMode ?? 'default',
  );

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

  const currentMode = MODE_BY_VALUE[permissionMode];

  function changeMode(mode: PermissionMode): void {
    if (mode === permissionMode) return;
    sendClientEvent({ type: 'room_permission_mode', roomId, mode });
  }

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

  function syncCursor(target: { selectionStart: number | null }): void {
    setCursor(target.selectionStart ?? 0);
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
      <div className="chat-input-row">
        <Form.Control
          as="textarea"
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
        <div className="chat-input-actions">
          <div className="chat-input-buttons">
            {!busy && (
              <IconButton
                icon="send"
                label="Send message"
                variant="primary"
                size={undefined}
                disabled={disabled || text.trim() === ''}
                onClick={submit}
              />
            )}
            {(busy || subagentsActive) && (
              <IconButton
                icon="stop-fill"
                label="Stop"
                variant="danger"
                size={undefined}
                disabled={!connected}
                onClick={() => sendClientEvent({ type: 'session_stop', roomId })}
              />
            )}
          </div>
          <Dropdown drop="up" align="end">
            <OverlayTrigger placement="top" overlay={<Tooltip>{currentMode.label}</Tooltip>}>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="chat-input-mode"
                aria-label={`Permission mode: ${currentMode.label}`}
                disabled={!connected}
                style={connected ? undefined : { pointerEvents: 'none' }}
              >
                <i className={`bi bi-${currentMode.icon}`} aria-hidden="true" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu>
              {MODE_OPTIONS.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  active={option.value === permissionMode}
                  onClick={() => changeMode(option.value)}
                >
                  <i className={`bi bi-${option.icon} me-2`} aria-hidden="true" />
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
