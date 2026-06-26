---
id: feature-angular-form-arrays
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-form-arrays'
---

# @hexguard/angular-form-arrays

## Summary

Typed FormArray operations for Angular Reactive Forms — typed move, swap, insert, remove, and clear helpers with dirty-tracking signals, index validation, and change detection optimization. Angular's `FormArray` is generic (`FormArray<AbstractControl>`) and requires manual index management.

**Promoted from sidenote.**

## Why Wide Adoption

Dynamic form lists (order line items, team members, addresses, education entries, repeatable sections) use `FormArray`. Every team re-implements the same add/remove/move/swap operations with manual index management.

## Goals

1. Provide `injectFormArray()` — typed wrapper around Angular's `FormArray` with signal-based state.
2. Support typed `push`, `remove`, `insert`, `move`, `swap`, `clear` operations.
3. Expose signals: `controls`, `length`, `dirty`, `valid`, `value`.
4. Validate indices for move/swap/remove operations — throw or no-op on out-of-bounds.
5. Auto-dirty the array on structural changes.

## Proposed Public API

```typescript
export function injectFormArray<T extends AbstractControl>(
  controls: T[] | (() => T[])
): {
  readonly controls: Signal<T[]>;
  readonly length: Signal<number>;
  readonly dirty: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly value: Signal<ReturnType<T['getRawValue']>[]>;

  push(control: T): void;
  remove(index: number): void;
  insert(index: number, control: T): void;
  move(fromIndex: number, toIndex: number): void;
  swap(indexA: number, indexB: number): void;
  clear(): void;
  reset(): void;
  at(index: number): T | undefined;
};

// Usage
const items = injectFormArray<FormControl<LineItem>>(() => [
  new FormControl(new LineItem()),
]);
items.push(new FormControl(new LineItem()));
items.move(2, 0);  // Move third item to first position
```

## Implementation Plan

1. Scaffold `angular/packages/angular-form-arrays/`.
2. Implement typed wrapper around Angular's `FormArray`.
3. Add move/swap with index validation.
4. Add dirty/valid/value signals.
5. Add tests: push/remove, move, swap, index validation, signal reactivity.
6. Register in workspace.
