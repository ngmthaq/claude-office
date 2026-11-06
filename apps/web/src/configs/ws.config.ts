export const INITIAL_BACKOFF_MS = 1000;
export const MAX_BACKOFF_MS = 10_000;

export const buildWsUrl = (): string => {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${location.host}/ws`;
};
