# @hexguard/angular-undo

**Timer-based undo stack for Angular.** Reversible action flows with configurable undo windows, TTL expiry, group undo, and commit-or-revert behavior — no RxJS required.

**[Deep package notes](docs/packages/angular-undo.md)** · **[Demo](/packages/angular-undo/demo)**

---

## Problem

Destructive actions (delete, archive, move, status change) need an undo window so users can revert mistakes. Teams rebuild the same timer-based stack: push action → start TTL timer → provide undo/commit buttons → auto-commit on expiry. Group undo (select-all → delete → batch revert) adds more complexity.

**`@hexguard/angular-undo`** standardizes this into one injectable contract with per-action TTL, group undo, auto-commit callback, and reactive pending-state signals.

## Installation

```bash
pnpm add @hexguard/angular-undo
```

## Quickstart

```typescript
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
undo.hasPending;   // Signal<boolean>
undo.pendingUndos; // Signal<UndoAction[]>

// Imperative
undo.undo('delete-42');      // revert
undo.undoGroup('batch-1');   // batch revert
undo.commit('delete-42');    // expire immediately
undo.clear();                // cancel all
```

## Use Cases

### Delete with undo toast
```typescript
// In component:
undo.push({
  id: `delete-${item.id}`,
  type: 'delete',
  data: item,
  onUndo: () => restoreItem(item),
});

// Template: show "Undo" button while timer runs
@if (undo.hasPending()) {
  <div class="toast">
    Item deleted
    @for (a of undo.undosForType('delete'); track a.id) {
      <button (click)="undo.undo(a.id)">Undo</button>
    }
  </div>
}
```

### Batch archive with group undo
```typescript
for (const item of selectedItems) {
  undo.push({
    id: `archive-${item.id}`,
    type: 'archive',
    data: item,
    groupId: 'batch-archive',
    onUndo: (a) => unarchiveItem(a.data),
  });
}
// Later: undo.undoGroup('batch-archive') reverts all in reverse order
```

## API

### `injectUndoStack<T>(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultTtlMs` | `number` | `5000` | Default undo window (ms). Per-action `ttlMs` overrides |
| `onCommit` | `(action) => void` | — | Called when an action auto-commits after TTL expiry |

### `UndoAction<T>`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique action identifier |
| `type` | `string` | Action type for filtering (`'delete'`, `'archive'`, etc.) |
| `data` | `T` | Arbitrary action payload |
| `ttlMs?` | `number` | Per-action TTL override |
| `groupId?` | `string` | Group identifier for batch undo |
| `onUndo` | `(action) => void` | Callback invoked when undone |

### `UndoStack<T>`

| Member | Type | Description |
|--------|------|-------------|
| `pendingUndos` | `Signal<UndoAction<T>[]>` | All pending reversible actions |
| `hasPending` | `Signal<boolean>` | Whether any undo windows are open |
| `undosForType(type)` | `(t) => Signal<UndoAction<T>[]>` | Filter pending by action type |
| `push(action)` | `(a) => void` | Push a new reversible action |
| `undo(id)` | `(id) => void` | Revert a specific action |
| `undoGroup(gid)` | `(gid) => void` | Revert all actions in a group (reverse order) |
| `commit(id)` | `(id) => void` | Expire immediately without undoing |
| `clear()` | `() => void` | Cancel all pending undo windows |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Timer-based undo windows with auto-commit | ✅ |
| Group undo for batch operations | ✅ |
| Per-action and default TTL | ✅ |
| Optimistic-state rollback | ❌ (use `@hexguard/angular-optimistic-state`) |
| Toast/snackbar UI | ❌ (compose with `@hexguard/angular-notifications`) |
| Persistence across sessions | ❌ (in-memory only) |

## Demo

Visit `/packages/angular-undo/demo` for delete/archive undo flows with TTL demo.

