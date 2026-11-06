import Badge from 'react-bootstrap/Badge';
import { useConnectionStore } from '@/features/connection/use-connection-store';
import type { ConnectionStatus } from '@/features/connection/use-connection-store';

const STATUS_BG: Record<ConnectionStatus, string> = {
  connected: 'success',
  connecting: 'warning',
  disconnected: 'danger',
};

export function ConnectionBadge() {
  const status = useConnectionStore((state) => state.status);
  return (
    <Badge pill bg={STATUS_BG[status]}>
      {status}
    </Badge>
  );
}
