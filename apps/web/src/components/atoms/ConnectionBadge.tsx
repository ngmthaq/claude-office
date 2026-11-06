import Badge from 'react-bootstrap/Badge';
import { CONNECTION_STATUS_BG } from '@/configs/ui.config';
import type { ConnectionStatus } from '@/dtos/connection-status.dto';

type ConnectionBadgeProps = { status: ConnectionStatus };

export function ConnectionBadge({ status }: ConnectionBadgeProps) {
  return (
    <Badge pill bg={CONNECTION_STATUS_BG[status]}>
      {status}
    </Badge>
  );
}
