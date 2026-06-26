---
id: feature-angular-batch
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-batch'
---

# @hexguard/angular-batch

## Summary

Headless batch operation state for Angular — a higher-level composition that orchestrates selection → confirmation → execution → result display in a single cohesive flow. Combines patterns from `@hexguard/angular-selection-state`, `@hexguard/angular-confirmation`, `@hexguard/angular-async-state`, and `@hexguard/angular-notifications` into a reusable batch workflow.

**Competition check:** No Angular package provides a headless batch operation flow. Individual operations exist (selection, confirmation, async) but composing them for "select 5 items → confirm delete → execute → show results" is re-done every time.

## Why Wide Adoption

Batch operations are universal: "Delete selected", "Export selected", "Approve selected", "Archive selected", "Change status of selected". Every admin panel, data grid, and list view has batch actions. The state flow is always identical: select → (optional confirm) → execute → show per-item results.

## Goals

1. Provide `injectBatch()` — batch operation state machine with clear phases.
2. Support configurable phases: selection only, selection + confirmation, or direct execution.
3. Track per-item results: success/failure per item, with error messages.
4. Expose signals: `phase`, `selectedCount`, `successCount`, `errorCount`, `results`, `isProcessing`.
5. Support `cancel()` at any phase before execution starts.
6. Support `reset()` to return to idle for a new batch.

## Proposed Public API

```typescript
export type BatchPhase = 'idle' | 'selecting' | 'confirming' | 'executing' | 'complete';

export interface BatchConfig<T> {
  onExecute: (items: T[]) => Promise<BatchItemResult<T>[]>;
  requireConfirmation?: boolean | (() => ConfirmationRequest);
}

export interface BatchItemResult<T> {
  item: T;
  success: boolean;
  error?: string;
}

export interface BatchState<T> {
  readonly phase: Signal<BatchPhase>;
  readonly selectedItems: Signal<T[]>;
  readonly selectedCount: Signal<number>;
  readonly isProcessing: Signal<boolean>;
  readonly results: Signal<BatchItemResult<T>[]>;
  readonly successCount: Signal<number>;
  readonly errorCount: Signal<number>;
  readonly hasErrors: Signal<boolean>;

  start(): void;                          // Enter selection phase
  select(items: T[]): void;               // From selection phase → next phase
  confirm(): void;                        // From confirming → executing
  cancel(): void;                         // Return to idle
  execute(): Promise<BatchItemResult<T>[]>;  // Execute the batch
  reset(): void;                          // Return to idle
}

export function injectBatch<T>(config: BatchConfig<T>): BatchState<T>;

// Usage
const batch = injectBatch({
  onExecute: async (items) => {
    const results = await api.bulkDelete(items.map(i => i.id));
    return items.map((item, i) => ({ item, success: results[i].ok, error: results[i].error }));
  },
  requireConfirmation: true,
});

// Template
@if (batch.phase() === 'selecting') {
  <button (click)="batch.select(selectedIds())">Delete Selected (@batch.selectedCount())</button>
}
@if (batch.phase() === 'complete') {
  <div>Deleted @batch.successCount() items
    @if (batch.hasErrors()) { <span>@batch.errorCount() failed</span> }
  </div>
  <button (click)="batch.reset()">Done</button>
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-batch/`.
2. Implement batch state machine (`idle → selecting → (confirming →) executing → complete`).
3. Implement `onExecute` integration with per-item result tracking.
4. Add tests: full flow, cancellation at each phase, error results, reset.
5. Create demo page.
6. Register in workspace.
