import { useEffect, useRef } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import type { AutocompleteRows } from '@/dtos/autocomplete-token.dto';
import { AutocompleteUtil } from '@/utils/autocomplete.util';

type AutocompletePopupProps = {
  id: string;
  rows: AutocompleteRows;
  status: 'loading' | 'ready' | 'error';
  activeIndex: number;
  onPick: (index: number) => void;
};

export function AutocompletePopup({
  id,
  rows,
  status,
  activeIndex,
  onPick,
}: AutocompletePopupProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

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
    <ListGroup className="autocomplete shadow" id={id} role="listbox">
      {message !== null && (
        <ListGroup.Item className="autocomplete__status text-body-secondary">
          {message}
        </ListGroup.Item>
      )}
      {rows.trigger === '/'
        ? rows.items.map((command, index) => (
            <ListGroup.Item
              as="button"
              type="button"
              action
              active={index === activeIndex}
              key={command.name}
              id={AutocompleteUtil.optionId(id, index)}
              ref={index === activeIndex ? activeRef : undefined}
              role="option"
              aria-selected={index === activeIndex}
              className="autocomplete__row"
              tabIndex={-1}
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
            </ListGroup.Item>
          ))
        : rows.items.map((file, index) => (
            <ListGroup.Item
              as="button"
              type="button"
              action
              active={index === activeIndex}
              key={file.path}
              id={AutocompleteUtil.optionId(id, index)}
              ref={index === activeIndex ? activeRef : undefined}
              role="option"
              aria-selected={index === activeIndex}
              className="autocomplete__row"
              tabIndex={-1}
              onMouseDown={(event) => {
                event.preventDefault();
                onPick(index);
              }}
            >
              <span className="autocomplete__name">
                {file.path}
                {file.kind === 'dir' ? '/' : ''}
              </span>
            </ListGroup.Item>
          ))}
    </ListGroup>
  );
}
