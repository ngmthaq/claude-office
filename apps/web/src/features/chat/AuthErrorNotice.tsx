type AuthErrorNoticeProps = { message: string };

export function AuthErrorNotice({ message }: AuthErrorNoticeProps) {
  return (
    <div className="notice notice--auth" role="alert">
      <strong>Not logged in</strong>
      <p>{message}</p>
      <ol>
        <li>
          Install Claude Code (<code>npm install -g @anthropic-ai/claude-code</code>), run{' '}
          <code>claude</code>, and log in.
        </li>
        <li>
          Or set <code>ANTHROPIC_API_KEY</code> before starting the app.
        </li>
        <li>Then send your message again.</li>
      </ol>
    </div>
  );
}
