---
id: feature-ts-fuzzy
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-fuzzy'
---

# @hexguard/ts-fuzzy

## Summary

Fuzzy search and filtering for TypeScript arrays — search objects by multiple fields with typo-tolerant matching, scored results, and highlight ranges. Lighter than fuse.js.

**Competition check:** `fuse.js` (5M+ weekly) is dominant but heavy (15KB). `fuzzysort` is lighter but opinionated.

## Goals

1. Provide `fuzzySearch(array, query, options)` — scored, sorted matches.
2. Support multi-field search with configurable weights.
3. Provide match ranges for text highlighting.
4. Support threshold and max results.
5. Zero dependencies.

## Proposed Public API

```typescript
export interface FuzzyOptions<T> {
  keys: (keyof T | { name: keyof T; weight: number })[];
  threshold?: number;           // 0–1, default 0.4
  maxResults?: number;
  caseSensitive?: boolean;
}

export interface FuzzyResult<T> {
  item: T;
  score: number;               // 0–1, higher = better match
  matches: FieldMatch[];       // For highlighting
}

export interface FieldMatch {
  key: string;
  indices: [number, number][];  // [start, end] pairs in field value
}

export function fuzzySearch<T extends Record<string, unknown>>(
  array: T[], query: string, options: FuzzyOptions<T>
): FuzzyResult<T>[];

export function fuzzyMatch(text: string, query: string): { score: number; indices: [number, number][] } | null;
```

## Implementation Plan

1. Create `ts/packages/ts-fuzzy/`.
2. Implement fuzzy matching algorithm.
3. Implement multi-field search with scoring.
4. Add tests.
5. Publish to npm.
