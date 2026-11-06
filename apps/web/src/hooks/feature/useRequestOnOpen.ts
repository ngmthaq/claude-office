import { useEffect } from 'react';

/** Runs `request` when `ready` turns true or `request` changes. Callers must memoize `request`. */
export function useRequestOnOpen(ready: boolean, request: () => void): void {
  useEffect(() => {
    if (!ready) return;
    request();
  }, [ready, request]);
}
