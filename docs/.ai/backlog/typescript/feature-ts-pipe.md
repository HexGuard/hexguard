---
id: feature-ts-pipe
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-pipe'
---

# @hexguard/ts-pipe

## Summary

Functional programming utilities for TypeScript — `pipe()`, `compose()`, `flow()`, `tap()`, and `curry()`. Every TypeScript codebase ends up with utility functions for chaining operations; this provides them in one tiny, zero-dependency package.

**Competition check:** `fp-ts` (function module), `lodash/fp`, `ramda` cover this but are much larger. This is a **single-purpose** package with just pipe/compose/flow/tap/curry.

## Goals

1. Provide `pipe(value, ...fns)` — left-to-right function composition.
2. Provide `compose(...fns)` — right-to-left function composition.
3. Provide `flow(...fns)` — returns a function (pipe without initial value).
4. Provide `tap(fn)` — side-effect in a pipeline.
5. Provide `curry(fn)` — auto-curry a function.
6. Full TypeScript type inference through the pipeline.

## Proposed Public API

```typescript
// ── Pipe ──────────────────────────────────────────────────

export function pipe<A, B>(a: A, fn1: (a: A) => B): B;
export function pipe<A, B, C>(a: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
// ... up to 10 fns with full type inference

// ── Compose ───────────────────────────────────────────────

export function compose<A, B>(fn1: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => C;
// ... up to 10 fns

// ── Flow ──────────────────────────────────────────────────

export function flow<A, B>(fn1: (a: A) => B): (a: A) => B;
export function flow<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
// ... up to 10 fns

// ── Tap ───────────────────────────────────────────────────

export function tap<T>(fn: (value: T) => void): (value: T) => T;

// ── Curry ─────────────────────────────────────────────────

export function curry<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): Curried<Args, Return>;

// Usage
const result = pipe(
  'hello',
  s => s.toUpperCase(),        // 'HELLO'
  s => `${s} WORLD`,           // 'HELLO WORLD'
  s => s.split(' '),           // ['HELLO', 'WORLD']
);

const process = flow(
  (s: string) => s.trim(),
  s => s.toLowerCase(),
  tap(s => console.log(s)),    // Log without breaking pipeline
);
```

## Implementation Plan

1. Create `ts/packages/ts-pipe/`.
2. Implement `pipe`, `compose`, `flow`, `tap`, `curry`.
3. Add TypeScript overloads for full type inference.
4. Add tests.
5. Publish to npm.
