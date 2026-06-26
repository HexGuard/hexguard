---
id: feature-ts-result
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-result'
---

# @hexguard/ts-result

## Summary

Result and Option types for TypeScript — `Result<T, E>` for fallible operations, `Option<T>` for nullable values, with `match()`/`map()`/`bind()`/`unwrapOr()` utilities. Avoids try/catch sprawl and null checks by making success/failure and presence/absence explicit in the type system.

**Competition check:** `ts-results` (7M weekly downloads), `fp-ts`, `effect-ts` exist but are heavy (fp-ts is a full FP library). This is a **narrow, zero-dependency** package with just Result and Option plus their combinators.

## Goals

1. Provide `Result<T, E>` — discriminated union for success/error.
2. Provide `Option<T>` — discriminated union for Some/None.
3. Provide chainable `map`, `bind` (flatMap), `match`, `unwrapOr`, `unwrapOrElse`.
4. Provide `fromPromise` — convert a Promise to `Result<T, Error>`.
5. Provide `combine` — combine multiple Results into one.
6. Zero dependencies, tree-shakeable, ESM.

## Proposed Public API

```typescript
// ── Result ────────────────────────────────────────────────

export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T>;
export function err<E>(error: E): Err<E>;

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  map<U>(fn: (value: T) => U): Result<U, never>;
  bind<U, E>(fn: (value: T) => Result<U, E>): Result<U, E>;
  match<U>(onOk: (value: T) => U, onErr: (error: never) => U): U;
  unwrapOr(defaultValue: U): T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
  map<U>(fn: (value: never) => U): Result<U, E>;
  bind<U>(fn: (value: never) => Result<U, E>): Result<U, E>;
  match<U>(onOk: (value: never) => U, onErr: (error: E) => U): U;
  unwrapOr<U>(defaultValue: U): U;
}

export function fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>>;
export function combine<T extends [unknown, ...unknown[]]>(
  results: { [K in keyof T]: Result<T[K], unknown> }
): Result<T, AggregateError>;

// ── Option ────────────────────────────────────────────────

export type Option<T> = Some<T> | None;

export function some<T>(value: T): Some<T>;
export const none: None;

export interface Some<T> {
  readonly some: true;
  readonly value: T;
  map<U>(fn: (value: T) => U): Option<U>;
  bind<U>(fn: (value: T) => Option<U>): Option<U>;
  match<U>(onSome: (value: T) => U, onNone: () => U): U;
  unwrapOr(defaultValue: U): T;
}

export interface None {
  readonly some: false;
  map<U>(fn: (value: never) => U): Option<U>;
  bind<U>(fn: (value: never) => Option<U>): Option<U>;
  match<U>(onSome: (value: never) => U, onNone: () => U): U;
  unwrapOr<U>(defaultValue: U): U;
}
```

## Implementation Plan

1. Create `ts/packages/ts-result/`.
2. Implement `Result<T,E>` and `Option<T>`.
3. Implement `fromPromise` and `combine`.
4. Add tests for all combinators.
5. Publish to npm.
