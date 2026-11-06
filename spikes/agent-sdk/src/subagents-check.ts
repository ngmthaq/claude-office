import { query } from '@anthropic-ai/claude-agent-sdk';
import { createLogWriter } from './log-writer.js';

type SubagentTrace = {
  toolName: string;
  startedAt?: number;
  endedAt?: number;
  childMessages: number;
  childParentIds: Set<string>;
  taskEvents: string[];
};

const REPO_ROOT = new URL('../../..', import.meta.url).pathname;
const SUBAGENT_TOOLS = new Set(['Task', 'Agent']);
const PROMPT =
  'In ONE turn, start exactly 2 sub-agents in parallel (two tool calls in the same message). ' +
  'Sub-agent A: count the .md files in the plans/ folder and report the number. ' +
  'Sub-agent B: list the file names in the .claude/agents/ folder. ' +
  'Then give me a one-line summary of both answers.';

const log = createLogWriter('subagents-check');
const traces = new Map<string, SubagentTrace>();
const startTime = Date.now();

async function main(): Promise<void> {
  const stream = query({
    prompt: PROMPT,
    options: {
      cwd: REPO_ROOT,
      maxTurns: 6,
      allowedTools: ['Read', 'Glob', 'Grep', 'LS', 'Task', 'Agent'],
      permissionMode: 'dontAsk',
    },
  });

  for await (const message of stream) {
    log.write({ at: Date.now(), message });
    trackMessage(message as unknown as Record<string, unknown>);
  }
  printSummary();
}

function trackMessage(message: Record<string, unknown>): void {
  const now = Date.now();
  const parentId = message.parent_tool_use_id;
  if (typeof parentId === 'string') {
    const trace = traces.get(parentId);
    if (trace) {
      trace.childMessages += 1;
      trace.childParentIds.add(parentId);
    }
  }

  if (message.type === 'system' && typeof message.tool_use_id === 'string') {
    traces.get(message.tool_use_id)?.taskEvents.push(`${String(message.subtype)}@${now}`);
  }

  const content = (message.message as { content?: unknown } | undefined)?.content;
  if (!Array.isArray(content)) return;
  for (const block of content as Record<string, unknown>[]) {
    if (message.type === 'assistant' && block.type === 'tool_use' && parentId === null) {
      const name = String(block.name);
      if (!SUBAGENT_TOOLS.has(name)) continue;
      traces.set(String(block.id), {
        toolName: name,
        startedAt: now,
        childMessages: 0,
        childParentIds: new Set(),
        taskEvents: [],
      });
    } else if (message.type === 'user' && block.type === 'tool_result') {
      const trace = traces.get(String(block.tool_use_id));
      if (trace) trace.endedAt = now;
    }
  }
}

function printSummary(): void {
  const rows = [...traces.entries()];
  for (const [id, t] of rows) {
    console.log({
      toolName: t.toolName,
      tool_use_id: id,
      startMs: (t.startedAt ?? 0) - startTime,
      endMs: (t.endedAt ?? 0) - startTime,
      childMessages: t.childMessages,
      parent_tool_use_id_on_children: [...t.childParentIds],
      taskEvents: t.taskEvents,
    });
  }
  const [a, b] = rows.map(([, t]) => t);
  if (a && b) {
    const overlap =
      (a.startedAt ?? 0) < (b.endedAt ?? 0) && (b.startedAt ?? 0) < (a.endedAt ?? 0);
    console.log('overlapped in time:', overlap);
  } else {
    console.log('overlapped in time: n/a (found', rows.length, 'sub-agent calls)');
  }
  console.log('log:', log.path);
}

main().catch((error: unknown) => {
  console.error('FAILED:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
