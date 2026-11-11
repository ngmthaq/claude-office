import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import type { BackgroundTask } from '@claude-office/shared';
import { ElapsedUtil } from '@/utils/elapsed.util';

type BackgroundTasksPillProps = {
  tasks: BackgroundTask[];
  onOpenSubagent: (subagentId: string) => void;
};

const KIND_ICON: Record<BackgroundTask['kind'], string> = {
  agent: 'bi-robot',
  command: 'bi-terminal',
  other: 'bi-gear',
};

const KIND_LABEL: Record<BackgroundTask['kind'], string> = {
  agent: 'Sub-agent',
  command: 'Command',
  other: 'Task',
};

const TICK_MS = 1000;

export function BackgroundTasksPill({ tasks, onOpenSubagent }: BackgroundTasksPillProps) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!open) return undefined;
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [open]);

  const handleToggle = (next: boolean) => {
    if (next) setNow(Date.now());
    setOpen(next);
  };

  if (tasks.length === 0) return null;

  const label = `${tasks.length} background ${tasks.length === 1 ? 'task' : 'tasks'} running`;
  const shown = open && tasks.length > 0;

  const popover = (
    <Popover id="background-tasks-popover" className="bg-tasks-popover">
      <Popover.Header as="div" className="bg-tasks-popover__header">
        <span>Background tasks</span>
        <Badge pill bg="info" text="dark">
          {tasks.length}
        </Badge>
      </Popover.Header>
      <ul className="bg-tasks-popover__list">
        {tasks.map((task) => {
          const text = task.description || 'Background task';
          const subagentId = task.kind === 'agent' ? task.subagentId : null;
          const content = (
            <>
              <span
                className={`bg-tasks-row__icon bg-tasks-row__icon--${task.kind}`}
                aria-hidden="true"
              >
                <i className={`bi ${KIND_ICON[task.kind]}`} />
              </span>
              <span className="bg-tasks-row__text">
                <span className="bg-tasks-row__title d-block" title={text}>
                  {text}
                </span>
                <span className="bg-tasks-row__kind">{KIND_LABEL[task.kind]}</span>
              </span>
              <span className="bg-tasks-row__end">
                {ElapsedUtil.short(now - task.startedAt)}
                {subagentId !== null && <i className="bi bi-chevron-right" aria-hidden="true" />}
              </span>
            </>
          );
          return (
            <li key={task.id}>
              {subagentId === null ? (
                <div className="bg-tasks-row">{content}</div>
              ) : (
                <button
                  type="button"
                  className="bg-tasks-row"
                  aria-label={`Open details: ${text}`}
                  onClick={() => {
                    setOpen(false);
                    onOpenSubagent(subagentId);
                  }}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Popover>
  );

  return (
    <div className="px-3 pb-1">
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="top-start"
        show={shown}
        onToggle={handleToggle}
        overlay={popover}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2"
          title={label}
          aria-label={label}
          aria-expanded={shown}
        >
          <span className="bg-tasks-pill__dot" aria-hidden="true" />
          {label}
          <i className={`bi ${shown ? 'bi-chevron-down' : 'bi-chevron-up'}`} aria-hidden="true" />
        </button>
      </OverlayTrigger>
    </div>
  );
}
