import { useState, type KeyboardEvent } from 'react';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import { sendClientEvent } from '@/features/connection/ws-client';

type ChatInputProps = {
  roomId: string;
  busy: boolean;
  subagentsActive: boolean;
  closed: boolean;
};

export function ChatInput({ roomId, busy, subagentsActive, closed }: ChatInputProps) {
  const [text, setText] = useState('');
  const connected = useConnectionStore((state) => state.status === 'connected');
  const disabled = busy || !connected;

  function submit(): void {
    const trimmed = text.trim();
    if (disabled || trimmed === '') return;
    sendClientEvent({ type: 'session_send', roomId, text: trimmed });
    setText('');
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="chat-input">
      <textarea
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
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
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
