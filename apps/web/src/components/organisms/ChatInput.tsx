import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRef, useState, type KeyboardEvent } from 'react';
import type { PermissionMode } from '@claude-office/shared';
import { IconButton } from '@/components/atoms/IconButton';
import { AutocompletePopup } from '@/components/molecules/AutocompletePopup';
import { PERMISSION_MODE_BY_VALUE, PERMISSION_MODE_OPTIONS } from '@/configs/ui.config';
import { useChatAutocomplete } from '@/hooks/feature/useChatAutocomplete';
import { useConnectionStore } from '@/hooks/store/useConnectionStore';
import { useSessionsStore } from '@/hooks/store/useSessionsStore';
import { wsClientService } from '@/services/ws-client.service';
import { AutocompleteUtil } from '@/utils/autocomplete.util';

type ChatInputProps = {
  roomId: string;
  busy: boolean;
  subagentsActive: boolean;
  closed: boolean;
};

export function ChatInput({ roomId, busy, subagentsActive, closed }: ChatInputProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const connected = useConnectionStore((state) => state.status === 'connected');
  const disabled = busy || !connected;
  const permissionMode = useSessionsStore(
    (state) => state.rooms.find((room) => room.id === roomId)?.permissionMode ?? 'default',
  );

  const { popupId, open, rows, hasRows, status, activeIndex, pick, handleKeyDown } =
    useChatAutocomplete({
      roomId,
      text,
      cursor,
      disabled,
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

  function submit(): void {
    const trimmed = text.trim();
    if (disabled || trimmed === '') return;
    wsClientService.send({ type: 'session_send', roomId, text: trimmed });
    setText('');
    setCursor(0);
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
          aria-controls={open ? popupId : undefined}
          aria-activedescendant={
            open && hasRows ? AutocompleteUtil.optionId(popupId, activeIndex) : undefined
          }
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
                onClick={() => wsClientService.send({ type: 'session_stop', roomId })}
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
