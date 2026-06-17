---
id: feature-angular-undo
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-undo'
---

# Angular Undo Package

## Summary

Design `@hexguard/angular-undo` as a headless Angular package for standardizing reversible action flows with undo windows, expiry, and commit-or-revert behavior for delete, archive, move, and status-change actions.

The repeated problem is that destructive actions like delete, archive, move, or status-change often benefit from an undo window — "Item deleted. Undo?" — but every team rebuilds the same timer-based undo stack, expiry handling, and commit-or-revert state management.

## Goals

- Provide `injectUndoStack<T>(options?)` for managing a stack of reversible actions with configurable undo windows.
- Support push, undo, commit, and expire operations per action.
- Support configurable undo window (TTL) per action type — after the window expires, the action auto-commits.
- Expose signals for `pendingUndos`, `undosForType(type)`, and `isExpired(actionId)`.
- Provide action grouping — multiple actions that should be undone together (batch undo).
- Keep the package headless — no UI, no toast, no snackbar (compose with `angular-notifications` for the "Undo?" toast).

## Non-Goals

- Optimistic-state rollback — that's `angular-optimistic-state`.
- Server-side undo or compensation actions — the consumer provides the undo logic.
- Undo history persistence across sessions — in-memory only.

## Decisions

- In-memory undo stack — undo windows are ephemeral, tied to component or service lifetime.
- Default undo window of 5 seconds, configurable per action.
- Auto-commit via `setTimeout` when the window expires — calls the `onCommit` callback.
- Action grouping via a shared `groupId` string — calling `undo(groupId)` undoes all actions in the group.

## Proposed Public API

```ts
const undo = injectUndoStack<DeleteAction>({
  defaultTtlMs: 5000,
  onCommit: (action) => executeHardDelete(action.id),
});

// Push a reversible action
undo.push({
  id: 'delete-order-42',
  type: 'delete',
  data: { orderId: 42, previousStatus: 'active' },
  ttlMs: 7000,
  groupId: 'batch-1',
  onUndo: (action) => restoreOrder(action.data.orderId),
});

// Reactive state
undo.pendingUndos;           // Signal<ActionWithTimer[]>
undo.hasPending;             // Signal<boolean>
undo.undosForType('delete'); // Signal<ActionWithTimer[]>

// Imperative
undo.undo('delete-order-42');
undo.undoGroup('batch-1');
undo.commit('delete-order-42');  // expire immediately
undo.clear();                     // cancel all pending undo windows
```

## Implementation Plan

1. Scaffold `angular/packages/angular-undo/`.
2. Add build/test scripts.
3. Implement `injectUndoStack()` with action push, timer management, undo handler, commit handler.
4. Implement auto-commit on TTL expiry using `setTimeout` with `DestroyRef` cleanup.
5. Implement `undoGroup()` — locates all actions with matching groupId and undoes them.
6. Implement signals: `pendingUndos`, `hasPending`, `undosForType`.
7. Add unit tests for: push/undo/commit cycle, TTL expiry, manual undo, group undo, clear, concurrent timers, cleanup on destroy.
8. Add demo route, Playwright, docs, release.

## Validation

- `pnpm test:lib:undo`.
- `pnpm build:lib`.
