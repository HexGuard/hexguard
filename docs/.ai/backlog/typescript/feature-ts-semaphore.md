---
id: feature-ts-semaphore
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-semaphore'
---

# @hexguard/ts-semaphore

## Summary

Async concurrency primitives — `Semaphore` (limit concurrent async ops), `Mutex` (exclusive lock), and `RateLimiter` (token bucket). Every app with concurrent API calls, file I/O, or resource pools needs concurrency control.

**Competition check:** `async-sema` (4M+ weekly) exists but is JS-only. This is typed TS with all three primitives.

## Proposed Public API

```typescript
export class Semaphore {
  constructor(permits: number);
  acquire(): Promise<() => void>;       // Returns release function
  tryAcquire(): (() => void) | null;    // Non-blocking
  readonly available: number;
}

export class Mutex {
  lock(): Promise<() => void>;          // Returns unlock function
  tryLock(): (() => void) | null;
  readonly locked: boolean;
}

export class RateLimiter {
  constructor(opts: { maxTokens: number; refillRate: number; refillIntervalMs: number });
  acquire(): Promise<void>;             // Waits for token
  tryAcquire(): boolean;
  readonly available: number;
}
```

## Implementation Plan

1. Create `ts/packages/ts-semaphore/`.
2. Implement all three primitives.
3. Add tests.
4. Publish to npm.
