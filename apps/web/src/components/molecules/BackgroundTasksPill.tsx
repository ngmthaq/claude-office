import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import type { BackgroundTask } from '@claude-office/shared';
import { ElapsedUtil } from '@/utils/elapsed.util';

type BackgroundTasksPillProps = {
  tasks: BackgroundTask[];
  onOpenSubagent: (subagentId: string) => void;
};

const KIND_ICON: Record<BackgroundTask['kind'], string> = {
  agent: 'bi-person',
  command: 'bi-terminal',
  other: 'bi-gear',
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

  const popover = (
    <Popover id="background-tasks-popover">
      <Popover.Body className="p-2">
        <ul className="list-unstyled mb-0">
          {tasks.map((task) => {
            const text = task.description || 'Background task';
            const elapsed = ElapsedUtil.short(now - task.startedAt);
            const row = (
              <>
                <i className={`bi ${KIND_ICON[task.kind]} me-2`} aria-hidden="true" />
                <span className="me-3">{text}</span>
                <span className="text-muted ms-auto">{elapsed}</span>
              </>
            );
            const subagentId = task.kind === 'agent' ? task.subagentId : null;
            return (
              <li key={task.id}>
                {subagentId === null ? (
                  <div className="d-flex align-items-center py-1">{row}</div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link text-start text-decoration-none p-0 py-1 w-100 d-flex align-items-center"
                    onClick={() => {
                      setOpen(false);
                      onOpenSubagent(subagentId);
                    }}
                  >
                    {row}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="px-3 pb-1">
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="top-start"
        show={open && tasks.length > 0}
        onToggle={handleToggle}
        overlay={popover}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary rounded-pill"
          title={label}
          aria-label={label}
        >
          <i className="bi bi-hourglass-split me-1" aria-hidden="true" />
          {label}
        </button>
      </OverlayTrigger>
    </div>
  );
}
