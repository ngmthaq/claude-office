import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import type { PermissionMode } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { AttachmentList } from '@/components/molecules/AttachmentList';
import { AutocompletePopup } from '@/components/molecules/AutocompletePopup';
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_SEND_TIMEOUT_MS,
  ATTACHMENT_TEXT,
  PERMISSION_MODE_BY_VALUE,
  PERMISSION_MODE_OPTIONS,
} from '@/configs/ui.config';
import { useChatAutocomplete } from '@/hooks/feature/useChatAutocomplete';
import type { ChatAttachments } from '@/hooks/feature/useChatAttachments';
import { selectRoomItems, useChatStore } from '@/hooks/store/useChatStore';
import { useConnectionStore } from '@/hooks/store/useConnectionStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';
import { AutocompleteUtil } from '@/utils/autocomplete.util';

type ChatInputProps = {
  roomId: string;
  busy: boolean;
  subagentsActive: boolean;
  closed: boolean;
  attachments: ChatAttachments;
};

export function ChatInput({ roomId, busy, subagentsActive, closed, attachments }: ChatInputProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const [sendError, setSendError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const baselineRef = useRef<Set<string>>(new Set());
  const items = useChatStore(selectRoomItems(roomId));
  const { drafts, uploads, reading, sending, setSending, clear } = attachments;
  const connected = useConnectionStore((state) => state.status === 'connected');
  const disabled = busy || !connected;
  const locked = disabled || sending;
  const permissionMode = useSessionsStore(
    (state) => state.rooms.find((room) => room.id === roomId)?.permissionMode ?? 'default',
  );

  const { popupId, open, rows, hasRows, status, activeIndex, pick, handleKeyDown } =
    useChatAutocomplete({
      roomId,
      text,
      cursor,
      disabled: locked,
      textareaRef,
      onTextChange: (nextText, nextCursor) => {
        setText(nextText);
        setCursor(nextCursor);
      },
    });

  const currentMode = PERMISSION_MODE_BY_VALUE[permissionMode];

  function changeMode(mode: PermissionMode): void {
    if (mode === permissionMode) return;
    wsClientService.send({ type: 'room_permission_mode', roomId, mode });
  }

  useEffect(() => {
    if (!sending) return;
    if (!connected) {
      setSending(false);
      return;
    }
    const outcome = items.find(
      (item) =>
        (item.kind === 'user' || item.kind === 'error') &&
        !baselineRef.current.has(`${item.kind}-${item.id}`),
    );
    if (outcome === undefined) return;
    if (outcome.kind === 'user') {
      setText('');
      setCursor(0);
      clear();
    }
    setSending(false);
  }, [items, sending, connected, setSending, clear]);

  useEffect(() => {
    if (!sending) return;
    const timer = setTimeout(() => {
      setSending(false);
      setSendError(true);
    }, ATTACHMENT_SEND_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [sending, setSending]);

  const trimmed = text.trim();
  const canSend = !locked && !reading && (trimmed !== '' || uploads.length > 0);

  function submit(): void {
    if (!canSend) return;
    if (uploads.length === 0) {
      wsClientService.send({ type: 'session_send', roomId, text: trimmed });
      setText('');
      setCursor(0);
      return;
    }
    setSendError(false);
    baselineRef.current = new Set(items.map((item) => `${item.kind}-${item.id}`));
    setSending(true);
    wsClientService.send({ type: 'session_send', roomId, text: trimmed, attachments: uploads });
  }

  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>): void {
    const { files, types } = event.clipboardData;
    if (files.length === 0) return;
    const hasRichText =
      types.includes('text/html') && event.clipboardData.getData('text/plain').trim() !== '';
    if (hasRichText) return;
    event.preventDefault();
    attachments.add(Array.from(files));
  }

  function onPickFiles(input: HTMLInputElement): void {
    attachments.add(Array.from(input.files ?? []));
    input.value = '';
  }

  function syncCursor(target: { selectionStart: number | null }): void {
    setCursor(target.selectionStart ?? 0);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.nativeEvent.isComposing) return;
    if (handleKeyDown(event)) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="chat-input">
      {open && rows !== null && (
        <AutocompletePopup
          id={popupId}
          rows={rows}
          status={status}
          activeIndex={activeIndex}
          onPick={pick}
        />
      )}
      <AttachmentList items={drafts} onRemove={sending ? undefined : attachments.remove} />
      {sendError && !sending && (
        <div className="text-danger small" role="alert">
          {ATTACHMENT_TEXT.sendFailed}
        </div>
      )}
      <div className="chat-input-row">
        <Form.Control
          as="textarea"
          ref={textareaRef}
          value={text}
          rows={2}
          disabled={locked}
          placeholder={
            busy
              ? 'Claude is working...'
              : closed
                ? 'Session closed. Send a message to wake it.'
                : 'Message Claude (Enter to send)'
          }
          aria-controls={open ? popupId : undefined}
          aria-activedescendant={
            open && hasRows ? AutocompleteUtil.optionId(popupId, activeIndex) : undefined
          }
          onChange={(event) => {
            setText(event.target.value);
            syncCursor(event.target);
          }}
          onPaste={onPaste}
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
                disabled={!canSend}
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
                onClick={() => wsClientService.send({ type: 'session_stop', roomId })}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept={ATTACHMENT_ACCEPT}
              onChange={(event) => onPickFiles(event.currentTarget)}
            />
            <IconButton
              icon="paperclip"
              label={ATTACHMENT_TEXT.add}
              size={undefined}
              disabled={sending}
              onClick={() => fileInputRef.current?.click()}
            />
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
              {PERMISSION_MODE_OPTIONS.map((option) => (
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
