---
id: feature-ts-diff
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-diff'
---

# @hexguard/ts-diff

## Summary

Text diff and patch utilities for TypeScript — line/word/char-level diff via Myers algorithm, unified patch creation and application. For diff viewers, code review, version comparison.

**Competition check:** `diff` (50M+ weekly) is the standard but heavy. This is a narrow, zero-dependency implementation.

## Proposed Public API

```typescript
export interface DiffEntry {
  type: 'equal' | 'add' | 'remove';
  value: string;
  count?: number;
}

export function diffLines(a: string, b: string): DiffEntry[];
export function diffWords(a: string, b: string): DiffEntry[];
export function diffChars(a: string, b: string): DiffEntry[];

export function createPatch(a: string, b: string, options?: { header?: string }): string;
export function applyPatch(text: string, patch: string): { success: boolean; result?: string; error?: string };
```

## Implementation Plan

1. Create `ts/packages/ts-diff/`.
2. Implement Myers diff algorithm.
3. Implement line/word/char granularity.
4. Implement patch create/apply.
5. Add tests.
6. Publish to npm.
