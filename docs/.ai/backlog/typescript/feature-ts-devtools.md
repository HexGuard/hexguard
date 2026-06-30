---
id: feature-ts-devtools
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-devtools'
---

# @hexguard/ts-devtools

## Summary

Zero-dependency development utilities — structured console logging with levels, dev-only assertions, debug conditionals, and environment detection. For cleaner debugging code.

## Proposed Public API

```typescript
// Structured logging (dev-only, tree-shaken in production)
export const devLog: {
  info(category: string, message: string, data?: unknown): void;
  warn(category: string, message: string, data?: unknown): void;
  error(category: string, message: string, data?: unknown): void;
  debug(category: string, message: string, data?: unknown): void;
  group(category: string, label: string, fn: () => void): void;
  table(category: string, data: unknown[]): void;
  time(category: string, label: string): () => void; // returns stop function
};

// Dev-only assertions (stripped in production)
export function devAssert(condition: boolean, message?: string): asserts condition;
export function devAssertEqual<T>(actual: T, expected: T, message?: string): void;

// Environment detection
export function isDevelopment(): boolean;
export function isProduction(): boolean;
export function isTest(): boolean;
export function isBrowser(): boolean;
export function isNode(): boolean;

// Debug conditionals
export function whenDev<T>(fn: () => T): T | undefined;
export function whenProd<T>(fn: () => T): T | undefined;

// Performance markers (dev only)
export function devMark(label: string): void;
export function devMeasure(label: string, startMark: string): void;

// Stack trace helpers
export function getCallerInfo(depth?: number): { file?: string; function?: string; line?: number } | null;
export function formatStackTrace(error: Error, frames?: number): string;

// Object inspection (dev-safe, handles circular refs)
export function inspect(obj: unknown, depth?: number): string;
export function diff(a: unknown, b: unknown): string; // colored diff for console
```

## Implementation Plan
1. Create `ts/packages/ts-devtools/` with zero dependencies.
2. Implement all utilities with production tree-shaking.
3. Add tests. Publish to npm.
