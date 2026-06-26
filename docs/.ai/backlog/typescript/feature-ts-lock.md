---
id: feature-ts-lock
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-lock'
---

# @hexguard/ts-lock

## Summary

Web Locks API wrapper for cross-tab mutex coordination. Falls back to in-memory `Mutex` when unavailable (Node.js, SSR).

## Proposed Public API

```typescript
export function createLockManager(): {
  request<T>(name: string, callback: () => Promise<T>): Promise<T>;
  request<T>(name: string, opts: { mode: 'exclusive' | 'shared' }, callback: () => Promise<T>): Promise<T>;
  query(): Promise<{ held: LockInfo[]; pending: LockInfo[] }>;
};
```

## Implementation Plan

1. Create `ts/packages/ts-lock/`.
2. Implement `navigator.locks` wrapper with in-memory fallback.
3. Add tests.
4. Publish to npm.
