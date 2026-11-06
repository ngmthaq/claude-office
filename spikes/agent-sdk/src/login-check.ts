import { query } from '@anthropic-ai/claude-agent-sdk';
import { createLogWriter } from './log-writer.js';

const REPO_ROOT = new URL('../../..', import.meta.url).pathname;
const log = createLogWriter('login-check');

async function main(): Promise<void> {
  const stream = query({
    prompt: 'Reply with exactly one short sentence saying hello. Do not use any tools.',
    options: { cwd: REPO_ROOT, maxTurns: 1, tools: [] },
  });

  for await (const message of stream) {
    log.write(message);
    if (message.type === 'system' && message.subtype === 'init') {
      console.log('session_id:', message.session_id);
      console.log('model:', message.model);
      console.log('apiKeySource:', message.apiKeySource);
    } else if (message.type === 'result') {
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
