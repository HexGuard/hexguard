import { computed, DestroyRef, inject, signal } from '@angular/core';

import { DEFAULT_TTL_MS, type UndoAction, type UndoStack, type UndoStackOptions } from './types';

/**
 * Injects a timer-based undo stack for managing reversible actions.
 *
 * @param options - Optional configuration for default TTL and commit callback.
 *
 * @example
 * ```ts
 * const undo = injectUndoStack<DeleteAction>({
 *   defaultTtlMs: 5000,
 *   onCommit: (action) => hardDelete(action.data.id),
 * });
 *
 * undo.push({
 *   id: 'delete-42',
 *   type: 'delete',
 *   data: { id: '42' },
 *   onUndo: (action) => restoreItem(action.data.id),
 * });
 * ```
 */
export function injectUndoStack<T>(options?: UndoStackOptions<T>): UndoStack<T> {
  const destroyRef = inject(DestroyRef);
  const defaultTtlMs = options?.defaultTtlMs ?? DEFAULT_TTL_MS;
  const commitCallback = options?.onCommit;

  const actions = signal<UndoAction<T>[]>([]);
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();

  function clearTimer(actionId: string): void {
    const timer = timerMap.get(actionId);
    if (timer !== undefined) {
      clearTimeout(timer);
      timerMap.delete(actionId);
    }
  }

  function removeAction(actionId: string): void {
    clearTimer(actionId);
    actions.update((list) => list.filter((a) => a.id !== actionId));
  }

  function push(action: UndoAction<T>): void {
    const ttl = action.ttlMs ?? defaultTtlMs;

    actions.update((list) => [...list, action]);

    const timerId = setTimeout(() => {
      // Auto-commit on TTL expiry
      timerMap.delete(action.id);
      actions.update((list) => list.filter((a) => a.id !== action.id));
      commitCallback?.(action);
    }, ttl);

    timerMap.set(action.id, timerId);
  }

  function undo(actionId: string): void {
    const action = actions().find((a) => a.id === actionId);
    if (!action) {
      return;
    }
    removeAction(actionId);
    action.onUndo(action);
  }

  function undoGroup(groupId: string): void {
    // Find all actions in the group, in reverse push order
    const groupActions = actions()
      .filter((a) => a.groupId === groupId)
      .reverse();

    for (const action of groupActions) {
      removeAction(action.id);
      action.onUndo(action);
    }
  }

  function commit(actionId: string): void {
    const action = actions().find((a) => a.id === actionId);
    if (!action) {
      return;
    }
    removeAction(actionId);
    commitCallback?.(action);
  }

  function clear(): void {
    for (const action of actions()) {
      clearTimer(action.id);
    }
    actions.set([]);
  }

  // Clean up all timers on destroy
  destroyRef.onDestroy(() => {
    for (const action of actions()) {
      clearTimer(action.id);
    }
  });

  const pendingUndos = actions.asReadonly();
  const hasPending = computed(() => actions().length > 0);
  const latestPendingId = computed(() => {
    const list = actions();
    return list.length > 0 ? list[list.length - 1].id : null;
  });

  const undosForTypeCache = new Map<string, ReturnType<typeof computed<UndoAction<T>[]>>>();

  function undosForType(type: string): ReturnType<typeof computed<UndoAction<T>[]>> {
    const cached = undosForTypeCache.get(type);
    if (cached) {
      return cached;
    }
    const result = computed(() => actions().filter((a) => a.type === type));
    // Limit cache to reasonable size to prevent memory leak
    if (undosForTypeCache.size >= 50) {
      // Evict oldest entry if cache grows too large
      const firstKey = undosForTypeCache.keys().next().value;
      if (firstKey !== undefined) {
        undosForTypeCache.delete(firstKey);
      }
    }
    undosForTypeCache.set(type, result);
    return result;
  }

  let keyboardCleanup: (() => void) | null = null;

  function withKeyboardShortcuts(): void {
    // Avoid duplicate registration
    if (keyboardCleanup) return;

    const handler = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        const id = latestPendingId();
        if (id) {
          e.preventDefault();
          undo(id);
        }
      }
    };

    document.addEventListener('keydown', handler);
    keyboardCleanup = () => document.removeEventListener('keydown', handler);

    destroyRef.onDestroy(() => {
      keyboardCleanup?.();
      keyboardCleanup = null;
    });
  }

  return {
    pendingUndos,
    hasPending,
    undosForType,
    push,
    undo,
    undoGroup,
    commit,
    clear,
    withKeyboardShortcuts,
  };
}
