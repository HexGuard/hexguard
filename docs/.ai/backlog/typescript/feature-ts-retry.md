---
id: feature-ts-retry
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-retry'
---

# @hexguard/ts-retry

## Summary

Retry utility for TypeScript â€” retry a function with configurable strategies (exponential backoff, fixed delay, jitter, linear), max attempts, and timeout. Every network call, database query, and external API integration needs retry logic.

**Competition check:** `promise-retry`, `async-retry` exist but are single-function packages without typed strategies or abort support. This package provides composable retry strategies.

## Goals

1. Provide `retry(fn, strategy)` â€” retry with typed strategies.
2. Support strategies: `fixed(delay)`, `exponential(base)`, `linear(base)`, with optional `jitter`.
3. Support `maxAttempts`, `timeout`, `onRetry` callback.
4. Support `AbortSignal` for cancellation.
5. Return `Result<T, RetryError>` for functional composition.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
// â”€â”€ Strategies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type RetryStrategy = (attempt: number) => number;  // Returns delay in ms

export const fixed: (delayMs: number) => RetryStrategy;
export const exponential: (baseMs?: number, maxMs?: number) => RetryStrategy;
export const linear: (baseMs?: number, maxMs?: number) => RetryStrategy;
export const withJitter: (strategy: RetryStrategy, factor?: number) => RetryStrategy;

// â”€â”€ Options â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface RetryOptions {
  strategy?: RetryStrategy;       // Default: exponential(100, 30_000)
  maxAttempts?: number;           // Default: 3
  timeout?: number;               // Per-attempt timeout
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown) => boolean;  // Default: always retry
}

// â”€â”€ Retry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options?: RetryOptions
): Promise<T>;

// With Result type (if @hexguard/ts-result is available)
export async function retrySafe<T>(
  fn: (attempt: number) => Promise<T>,
  options?: RetryOptions
): Promise<Result<T, RetryError>>;

export interface RetryError extends Error {
  attempts: number;
  lastError: unknown;
  errors: unknown[];
}

// Usage
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  {
    strategy: withJitter(exponential(100, 5000)),
    maxAttempts: 5,
    shouldRetry: e => e instanceof TypeError,  // Only retry network errors
    onRetry: (n, err, delay) => console.log(`Retry ${n} in ${delay}ms: ${err}`),
  }
);
```

## Implementation Plan

1. Create `ts/packages/ts-retry/`.
2. Implement retry strategies and core retry loop.
3. Implement `retry` and `retrySafe`.
4. Add tests with timer mocking.
5. Publish to npm.
