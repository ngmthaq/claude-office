import Alert from 'react-bootstrap/Alert';

type AuthErrorNoticeProps = { message: string };

export function AuthErrorNotice({ message }: AuthErrorNoticeProps) {
  return (
    <Alert variant="danger" className="notice notice--auth" role="alert">
      <Alert.Heading as="h6">
        <i className="bi bi-exclamation-triangle me-1" aria-hidden="true" />
        Not logged in
      </Alert.Heading>
      <p>{message}</p>
      <ol className="mb-0">
        <li>
          Install Claude Code (<code>npm install -g @anthropic-ai/claude-code</code>), run{' '}
          <code>claude</code>, and log in.
        </li>
        <li>
          Or set <code>ANTHROPIC_API_KEY</code> before starting the app.
        </li>
        <li>Then send your message again.</li>
      </ol>
    </Alert>
  );
}
