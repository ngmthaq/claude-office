import Badge from 'react-bootstrap/Badge';

type BackgroundTasksBadgeProps = { count: number };

export function BackgroundTasksBadge({ count }: BackgroundTasksBadgeProps) {
  if (count <= 0) return null;
  const label = `${count} background ${count === 1 ? 'task' : 'tasks'} running`;
  return (
    <Badge
      pill
      bg="info"
      text="dark"
      className="d-inline-flex align-items-center gap-1 flex-shrink-0"
      title={label}
      aria-label={label}
    >
      <i className="bi bi-hourglass-split" aria-hidden="true" />
      {count}
    </Badge>
  );
}
