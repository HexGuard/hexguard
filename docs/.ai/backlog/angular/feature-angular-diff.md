---
id: feature-angular-diff
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-diff'
---

# @hexguard/angular-diff

## Summary

Headless diff/compare state — compute and navigate differences between two versions of text, JSON, or structured data. For version history viewers, change logs, audit comparisons, and content review workflows.

## Goals

- Line-by-line text diff computation (added/removed/unchanged)
- JSON structural diff with path-level changes
- Change navigation (next/previous change)
- Change count summary (added/removed/modified lines)
- Side-by-side and unified diff models
- Inline change markers (word-level diffs within lines)
- Configurable diff algorithm options

## Non-Goals

- No diff visualization/rendering components
- No merge conflict resolution
- No three-way merge

## Proposed Public API

```typescript
export function injectDiff(): {
  readonly changes: Signal<DiffChange[]>;
  readonly summary: Signal<{ added: number; removed: number; unchanged: number }>;
  readonly currentChangeIndex: Signal<number>;
  compute(left: string, right: string, options?: DiffOptions): void;
  computeJson(left: unknown, right: unknown): void;
  nextChange(): void;
  previousChange(): void;
  goToChange(index: number): void;
};

export interface DiffChange {
  type: 'added' | 'removed' | 'unchanged';
  leftLineNumber?: number;
  rightLineNumber?: number;
  value: string;
  wordChanges?: WordChange[];
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  contextLines?: number;
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-diff/`.
2. Implement Myers diff algorithm for text, structural diff for JSON.
3. Add change navigation and summary with signals.
4. Add tests with known diff fixtures.
5. Register in workspace.
