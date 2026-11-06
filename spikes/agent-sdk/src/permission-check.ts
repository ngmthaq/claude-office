import { createInterface } from 'node:readline';
import { query } from '@anthropic-ai/claude-agent-sdk';
import type { CanUseTool } from '@anthropic-ai/claude-agent-sdk';
import { createLogWriter } from './log-writer.js';

const REPO_ROOT = new URL('../../..', import.meta.url).pathname;
const log = createLogWriter('permission-check');
const lines = createInterface({ input: process.stdin })[Symbol.asyncIterator]();

const canUseTool: CanUseTool = async (toolName, input, options) => {
  const askedAt = Date.now();
  const { signal, ...rest } = options;
  const info = {
    toolName,
    input,
    options: { ...rest, signalAborted: signal.aborted, signalType: signal.constructor.name },
  };
  console.log('canUseTool called:', JSON.stringify(info));
  log.write({ event: 'canUseTool_called', at: askedAt, ...info });
  console.log('waiting for y/n on stdin...');

  const next = await lines.next();
  const answer = next.done ? '' : String(next.value).trim().toLowerCase();
  const waitedMs = Date.now() - askedAt;
  const allow = answer === 'y';
  console.log(`answer="${answer}" waitedMs=${waitedMs} -> ${allow ? 'allow' : 'deny'}`);
  log.write({ event: 'canUseTool_answered', answer, waitedMs, allow });

  if (allow) return { behavior: 'allow', updatedInput: input };
  return { behavior: 'deny', message: 'The user denied this command in the spike test.' };
};

async function main(): Promise<void> {
  const stream = query({
    // A write command: plain `echo` is auto-allowed as read-only and skips the callback.
    prompt:
      'Use the Bash tool to run exactly: touch spikes/agent-sdk/logs/permission-probe.txt ' +
      '&& echo done. Then tell me the output.',
    options: {
      cwd: REPO_ROOT,
      maxTurns: 4,
      tools: ['Bash'],
      permissionMode: 'default',
      canUseTool,
    },
  });

  for await (const message of stream) {
    log.write({ event: 'message', message });
    if (message.type === 'result') {
      console.log('result subtype:', message.subtype);
      console.log('reply:', 'result' in message ? message.result : '(none)');
    }
  }
  console.log('log:', log.path);
}

main().catch((error: unknown) => {
  console.error('FAILED:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
