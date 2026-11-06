import { useConnectionStore } from '@/features/connection/use-connection-store';

export function ConnectionBadge() {
  const status = useConnectionStore((state) => state.status);
  return <span className={`connection-badge connection-badge--${status}`}>{status}</span>;
}
