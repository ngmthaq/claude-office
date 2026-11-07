import type { GitProvider } from '@claude-office/shared';

export const GIT_TIMEOUT_MS = 2000;
export const GH_TIMEOUT_MS = 5000;
export const GLAB_TIMEOUT_MS = 5000;

export const GIT_HOST_PROVIDERS: readonly { hostPart: string; provider: GitProvider }[] = [
  { hostPart: 'github', provider: 'github' },
  { hostPart: 'gitlab', provider: 'gitlab' },
];
