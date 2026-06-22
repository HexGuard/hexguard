# @hexguard/angular-undo — Deep Package Notes

Timer-based undo stack for Angular: reversible action flows with configurable undo windows, TTL expiry, group undo, and commit-or-revert behavior.

## Problem

Destructive actions like delete, archive, move, or status-change often benefit from an undo window — "Item deleted. Undo?" — but every team rebuilds the same timer-based undo stack, expiry handling, and commit-or-revert state management. The challenges include:

- Managing multiple concurrent undo timers
- Auto-committing when the undo window expires
- Grouping related actions for batch undo
- Properly cleaning up timers on destroy

**`@hexguard/angular-undo`** standardizes this into one injectable contract.

## Design

### One Injectable

```ts
import { injectUndoStack } from '@hexguard/angular-undo';

const undo = injectUndoStack<DeleteAction>({
  defaultTtlMs: 5000,
  onCommit: (action) => hardDelete(action.data.id),
});
```

### Action Lifecycle

1. **Push** — `undo.push(action)` adds a reversible action and starts a timer
2. **Undo window** — The consumer can call `undo(id)` to revert, calling the action's `onUndo` callback
3. **Auto-commit** — When the timer expires, the `onCommit` callback fires and the action is removed
4. **Manual commit** — `undo.commit(id)` expires the action immediately without undoing
5. **Clear** — `undo.clear()` cancels all pending undo windows without calling any callbacks

### Action Grouping

Multiple actions can share a `groupId` for batch undo:

```ts
undo.push({ id: 'a', groupId: 'batch-1', ... });
undo.push({ id: 'b', groupId: 'batch-1', ... });
undo.undoGroup('batch-1'); // undoes both 'a' and 'b' in reverse order
```

### Reactive State

| Signal | Type | Description |
|--------|------|-------------|
| `pendingUndos` | `Signal<UndoAction[]>` | All pending reversible actions |
| `hasPending` | `Signal<boolean>` | Whether any undo windows are open |
| `undosForType(type)` | `Signal<UndoAction[]>` | Filtered by action type |

## Lifecycle

- Each pushed action gets a `setTimeout` timer
- Timers are cleared on manual undo, commit, or clear
- All remaining timers are cleared via `DestroyRef.onDestroy()`

## API Surface

### `injectUndoStack<T>(options?)`

**Parameters:**

- `options.defaultTtlMs?: number` — Default undo window (default 5000)
- `options.onCommit?: (action: UndoAction<T>) => void` — Auto-commit callback

**Returns:** `UndoStack<T>`

### `UndoAction<T>`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `type` | `string` | Action type for filtering |
| `data` | `T` | Arbitrary payload |
| `ttlMs?` | `number` | Per-action TTL override |
| `groupId?` | `string` | Group for batch undo |
| `onUndo` | `(action) => void` | Undo callback |

### `UndoStack<T>`

| Method/Signal | Description |
|--------------|-------------|
| `pendingUndos` | Signal of all pending actions |
| `hasPending` | Signal: any pending? |
| `undosForType(type)` | Signal filtered by type |
| `push(action)` | Add a reversible action |
| `undo(id)` | Revert a specific action |
| `undoGroup(groupId)` | Revert all actions in a group |
| `commit(id)` | Expire without undoing |
| `clear()` | Cancel all pending undo windows |

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider a `remainingTtl(actionId)` signal showing ms left before auto-commit | Low |
| API | Consider `onBeforeUndo` / `onAfterUndo` lifecycle hooks for analytics | Low |
| API | Consider `maxPending` option (e.g., limit to 10 pending actions) to prevent memory leaks | Medium |
| Edge Cases | No test for `undoGroup` with mixed types or overlapping group IDs | Low |
| Edge Cases | No test for pushing an action with the same `id` as an existing one (should replace or reject) | Medium |
| Integration | Consider pairing with `@hexguard/angular-notifications` for automatic undo-toast UI | Low |
