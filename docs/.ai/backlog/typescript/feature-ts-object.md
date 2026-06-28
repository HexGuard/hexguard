---
id: feature-ts-object
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-object'
---

# @hexguard/ts-object

## Summary

Zero-dependency object utility functions â€” pick, omit, deep merge, deep clone, deep equal, flatten, and key transformation. Type-safe with proper generics.


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
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T;
export function deepClone<T>(obj: T): T;
export function deepEqual(a: unknown, b: unknown): boolean;
export function flatten<T>(obj: Record<string, T>, delimiter?: string): Record<string, T>;
export function unflatten<T>(obj: Record<string, T>, delimiter?: string): Record<string, unknown>;
export function mapKeys<T>(obj: Record<string, T>, fn: (key: string) => string): Record<string, T>;
export function mapValues<T, U>(obj: Record<string, T>, fn: (value: T, key: string) => U): Record<string, U>;
export function invert<T extends Record<string, string>>(obj: T): Record<string, string>;
export function isEmpty(obj: Record<string, unknown>): boolean;
export function get<T>(obj: unknown, path: string, defaultValue?: T): T | undefined;
export function set<T>(obj: T, path: string, value: unknown): T;
```

## Implementation Plan

1. Create `ts/packages/ts-object/` with zero dependencies.
2. Implement all functions with proper generics and deep traversal.
3. Handle edge cases: circular references, prototype pollution, sparse objects.
4. Add tests. Publish to npm.
