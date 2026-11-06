import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import type { McpServerEntry, McpServerStatusValue } from '@claude-office/shared';
import { IconButton } from '@/components/IconButton';
import { useMcpStore, type McpRoomStatus } from '@/features/mcp/use-mcp-store';

type McpStatusPanelProps = { roomId: string; roomName: string };

const STATUS_BG: Record<McpServerStatusValue, string> = {
  connected: 'success',
  'needs-auth': 'warning',
  failed: 'danger',
  pending: 'secondary',
  disabled: 'secondary',
};

const STATUS_LABEL: Record<McpServerStatusValue, string> = {
  connected: 'connected',
  'needs-auth': 'needs login',
  failed: 'failed',
  pending: 'connecting',
  disabled: 'disabled',
};

const STATUS_ORDER: McpServerStatusValue[] = [
  'connected',
  'pending',
  'needs-auth',
  'failed',
  'disabled',
];

export function McpStatusPanel({ roomId, roomName }: McpStatusPanelProps) {
  const room = useMcpStore((state) => state.byRoom[roomId]);
  const closePanel = useMcpStore((state) => state.closePanel);
  const refresh = useMcpStore((state) => state.refresh);
  const loading = room === undefined || room.status === 'loading';

  return (
    <main className="chat-panel" aria-label="MCP servers">
      <div className="chat-panel__header">
        <IconButton icon="arrow-left" label="Back to chat" onClick={closePanel} />
        <div className="chat-panel__title fw-semibold text-truncate" title={roomName}>
          MCP servers · {roomName}
        </div>
        <div className="ms-auto d-flex align-items-center gap-2 flex-shrink-0">
          {loading && <Spinner animation="border" size="sm" role="status" />}
          <IconButton
            icon="arrow-clockwise"
            label="Refresh"
            disabled={loading}
            onClick={() => refresh(roomId)}
          />
        </div>
      </div>
      <div className="mcp-panel__body">
        <PanelBody room={room} />
      </div>
    </main>
  );
}

function PanelBody({ room }: { room: McpRoomStatus | undefined }) {
  if (room === undefined || (room.status === 'loading' && room.fetchedAt === null)) {
    return <p className="text-body-secondary">Loading MCP servers…</p>;
  }
  if (room.status === 'error') {
    return <Alert variant="danger">Cannot load MCP servers. Try again.</Alert>;
  }
  if (!room.live) {
    return (
      <p className="text-body-secondary">
        Claude is not running in this room. Send a message first, then refresh.
      </p>
    );
  }
  if (room.servers.length === 0) {
    return <p className="text-body-secondary">This session has no MCP servers.</p>;
  }
  const sorted = [...room.servers].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  );
  const needsLogin = room.servers.some((server) => server.status === 'needs-auth');
  return (
    <>
      <ul className="mcp-list list-unstyled mb-0">
        {sorted.map((server) => (
          <McpRow key={server.name} server={server} />
        ))}
      </ul>
      {needsLogin && (
        <p className="small text-body-secondary mb-0">
          To log in to a server, run <code>/mcp</code> in a terminal <code>claude</code> session.
          Log in to claude.ai connectors in your claude.ai settings.
        </p>
      )}
    </>
  );
}

function McpRow({ server }: { server: McpServerEntry }) {
  return (
    <li className="mcp-list__row">
      <div className="d-flex align-items-center gap-2">
        <span className="text-truncate fw-semibold" title={server.name}>
          {server.name}
        </span>
        <Badge bg={STATUS_BG[server.status]} className="ms-auto flex-shrink-0">
          {STATUS_LABEL[server.status]}
        </Badge>
      </div>
      <div className="small text-body-secondary">
        {server.source ?? 'unknown source'}
        {server.status === 'connected' && ` · ${server.toolCount} tools`}
      </div>
      {server.error !== null && (
        <div className="small text-danger mcp-list__error">{server.error}</div>
      )}
    </li>
  );
}
