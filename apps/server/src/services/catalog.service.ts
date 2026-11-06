import type { FastifyBaseLogger } from 'fastify';
import { COMMANDS_TIMEOUT_MS, MCP_STATUS_TIMEOUT_MS } from '@/configs/limits.config.ts';
import type { CommandList } from '@/dtos/command-list.dto.ts';
import type { McpStatusList } from '@/dtos/mcp-status-list.dto.ts';
import type { CommandRepository } from '@/repositories/command.repository.ts';
import type { SessionStoreRepository } from '@/repositories/session-store.repository.ts';
import { AsyncUtil } from '@/utils/async.util.ts';
import { ErrorUtil } from '@/utils/error.util.ts';

export class CatalogService {
  constructor(
    private readonly sessionStoreRepository: SessionStoreRepository,
    private readonly commandRepository: CommandRepository,
    private readonly log: FastifyBaseLogger,
  ) {}

  async listCommands(roomId: string): Promise<CommandList | undefined> {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) return undefined;
    const hidden = session.terminalCommands;
    const live = session.query;
    if (live) {
      try {
        const sdk = await AsyncUtil.withTimeout(live.supportedCommands(), COMMANDS_TIMEOUT_MS);
        const commands = sdk
          .filter((command) => !hidden.has(command.name))
          .map((command) => ({
            name: command.name,
            description: command.description ?? '',
            argumentHint: command.argumentHint ?? '',
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { source: 'sdk', commands };
      } catch (error) {
        this.log.info({ roomId, err: ErrorUtil.errorName(error) }, 'sdk commands unavailable');
      }
    }
    return {
      source: 'disk',
      commands: await this.commandRepository.scanDiskCommands(session.folder),
    };
  }

  async listMcpServers(roomId: string): Promise<McpStatusList | undefined> {
    const session = this.sessionStoreRepository.get(roomId);
    if (!session) return undefined;
    if (!session.query) return { live: false, servers: [] };
    const list = await AsyncUtil.withTimeout(
      session.query.mcpServerStatus(),
      MCP_STATUS_TIMEOUT_MS,
    );
    const servers = list
      .map((server) => ({
        name: server.name,
        status: server.status,
        source: server.source ?? server.scope ?? null,
        error: server.error ?? null,
        toolCount: server.tools?.length ?? 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.log.info({ roomId, count: servers.length }, 'mcp status listed');
    return { live: true, servers };
  }
}
