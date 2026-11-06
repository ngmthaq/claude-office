import { useEffect, useRef } from 'react';
import type { AutocompleteRows } from '@/features/chat/autocomplete';

type AutocompletePopupProps = {
  id: string;
  rows: AutocompleteRows;
  status: 'loading' | 'ready' | 'error';
  activeIndex: number;
  onPick: (index: number) => void;
};

export function optionId(popupId: string, index: number): string {
  return `${popupId}-opt-${index}`;
}

export function AutocompletePopup({
  id,
  rows,
  status,
  activeIndex,
  onPick,
}: AutocompletePopupProps) {
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, rows]);

  const empty = rows.items.length === 0;
  const message =
    empty && status === 'loading'
      ? 'Loading...'
      : empty && status === 'error'
        ? 'Could not load'
        : empty
          ? 'No matches'
          : null;

  return (
    <div className="autocomplete" id={id} role="listbox">
      {message !== null && <div className="autocomplete__status">{message}</div>}
      {rows.trigger === '/'
        ? rows.items.map((command, index) => (
            <div
              key={command.name}
              id={optionId(id, index)}
              ref={index === activeIndex ? activeRef : undefined}
              role="option"
              aria-selected={index === activeIndex}
              className="autocomplete__row"
              onMouseDown={(event) => {
                event.preventDefault();
                onPick(index);
              }}
            >
              <span className="autocomplete__name">/{command.name}</span>
              {command.argumentHint !== '' && (
                <span className="autocomplete__muted">{command.argumentHint}</span>
              )}
              <span className="autocomplete__muted autocomplete__desc">{command.description}</span>
            </div>
          ))
        : rows.items.map((file, index) => (
            <div
              key={file.path}
              id={optionId(id, index)}
              ref={index === activeIndex ? activeRef : undefined}
              role="option"
              aria-selected={index === activeIndex}
              className="autocomplete__row"
              onMouseDown={(event) => {
                event.preventDefault();
                onPick(index);
              }}
            >
              <span className="autocomplete__name">
                {file.path}
                {file.kind === 'dir' ? '/' : ''}
              </span>
            </div>
          ))}
    </div>
  );
}
