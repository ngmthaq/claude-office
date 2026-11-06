import type { ToolResult } from '@/features/chat/use-chat-store';

type ToolCardProps = {
  name: string;
  input: unknown;
  result: ToolResult | null;
  stopped?: boolean;
};

export function ToolCard({ name, input, result, stopped }: ToolCardProps) {
  const status =
    result === null ? (stopped ? 'stopped' : 'running') : result.isError ? 'error' : 'done';

  return (
    <details className={`tool-card tool-card--${status}`}>
      <summary>
        <span className="tool-card__name">{name}</span>
        <span className="tool-card__status">{status}</span>
      </summary>
      <div className="tool-card__body">
        <h4>Input</h4>
        <pre>{JSON.stringify(input, null, 2) ?? ''}</pre>
        {result !== null && (
          <>
            <h4>Result</h4>
            <pre>{result.content}</pre>
          </>
        )}
      </div>
    </details>
  );
}
