# @hexguard/angular-undo

Timer-based undo stack for Angular: reversible action flows with configurable undo windows, TTL expiry, group undo, and commit-or-revert behavior for delete, archive, move, and status-change actions.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-undo.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-undo
# No RxJS dependency required
```

## Quickstart

```ts
import { injectUndoStack } from '@hexguard/angular-undo';

const undo = injectUndoStack<{ id: string }>({
  defaultTtlMs: 5000,
  onCommit: (action) => hardDelete(action.data.id),
});

undo.push({
  id: 'delete-42',
  type: 'delete',
  data: { id: '42' },
  onUndo: (action) => restoreItem(action.data.id),
});

// Reactive state
undo.hasPending; // Signal<boolean>
undo.pendingUndos; // Signal<UndoAction[]>

// Imperative
undo.undo('delete-42');      // revert
undo.undoGroup('batch-1');    // batch revert
undo.commit('delete-42');     // expire immediately
undo.clear();                 // cancel all
```

## Features

| Feature                         | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| Timer-based undo windows        | ✅     | Configurable per-action TTL                        |
| Auto-commit on expiry           | ✅     | Configurable `onCommit` callback                   |
| Manual undo / commit            | ✅     | By action ID                                       |
| Group undo                      | ✅     | Via shared `groupId` string                        |
| `pendingUndos` signal           | ✅     | All pending reversible actions                     |
| `hasPending` signal             | ✅     | Whether any undo windows are open                  |
| `undosForType(type)` signal     | ✅     | Filter by action type                              |
| `clear()`                       | ✅     | Cancel all pending undo windows                    |
| Automatic timer cleanup        | ✅     | Via `DestroyRef`                                   |
| Zero extra dependencies         | ✅     | Only `@angular/core` + `tslib`                     |

## Demo routes

| Route                                                    | Description                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `/packages/angular-undo`                                 | Undo package overview                                          |
| `/packages/angular-undo/demo`                            | Delete/archive undo flows with TTL demo                        |

## What It Owns

- One injectable for managing a stack of reversible actions
- Timer-based undo windows with auto-commit
- Action grouping for batch undo
- Reactive signals for pending state

## What It Does Not Own

- Optimistic-state rollback — see `@hexguard/angular-optimistic-state`
- Toast or snackbar UI — compose with `@hexguard/angular-notifications`
- Persistence — in-memory only

## API Reference

### `injectUndoStack<T>(options?)`

Creates an undo stack handle.

**Parameters:**

- `options.defaultTtlMs?: number` — Default undo window in ms (default 5000).
- `options.onCommit?: (action: UndoAction<T>) => void` — Called when an action auto-commits after TTL expiry.

**Returns:** `UndoStack<T>`

### `UndoAction<T>`

```ts
interface UndoAction<T = any> {
  id: string;
  type: string;
  data: T;
  ttlMs?: number;
  groupId?: string;
  onUndo: (action: UndoAction<T>) => void;
}
```

### `UndoStack<T>`

```ts
interface UndoStack<T> {
  readonly pendingUndos: Signal<UndoAction<T>[]>;
  readonly hasPending: Signal<boolean>;
  undosForType(type: string): Signal<UndoAction<T>[]>;
  push(action: UndoAction<T>): void;
  undo(actionId: string): void;
  undoGroup(groupId: string): void;
  commit(actionId: string): void;
  clear(): void;
}
```
