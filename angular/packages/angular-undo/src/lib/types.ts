import type { Signal } from '@angular/core';

/**
 * A reversible action with an undo window.
 */
export interface UndoAction<T = any> {
  /**
   * Unique identifier for this action.
   */
  readonly id: string;

  /**
   * Action type for filtering (e.g. 'delete', 'archive', 'move').
   */
  readonly type: string;

  /**
   * Arbitrary data associated with the action.
   */
  readonly data: T;

  /**
   * Optional per-action TTL in milliseconds.
   * Falls back to the default TTL from {@link UndoStackOptions}.
   */
  readonly ttlMs?: number;

  /**
   * Optional group identifier for batch undo.
   * All actions sharing the same groupId can be undone together
   * via {@link UndoStack.undoGroup}.
   */
  readonly groupId?: string;

  /**
   * Callback invoked when this action is undone.
   */
  onUndo: (action: UndoAction<T>) => void;
}

/**
 * Options for configuring the undo stack.
 */
export interface UndoStackOptions<T> {
  /**
   * Default undo window in milliseconds.
   * Per-action `ttlMs` overrides this value.
   *
   * @default 5000
   */
  readonly defaultTtlMs?: number;

  /**
   * Callback invoked when an action auto-commits after its TTL expires
   * without being undone.
   */
  readonly onCommit?: (action: UndoAction<T>) => void;
}

/**
 * Handle returned by {@link injectUndoStack}.
 */
export interface UndoStack<T> {
  /**
   * All currently pending (reversible) actions.
   */
  readonly pendingUndos: Signal<UndoAction<T>[]>;

  /**
   * Whether there are any pending undo windows open.
   */
  readonly hasPending: Signal<boolean>;

  /**
   * Returns a signal of pending actions filtered by the given type.
   */
  undosForType(type: string): Signal<UndoAction<T>[]>;

  /**
   * Push a new reversible action onto the stack.
   * An undo window timer starts immediately.
   */
  push(action: UndoAction<T>): void;

  /**
   * Undo a specific action by its ID.
   * Calls the action's `onUndo` callback and removes it from the stack.
   */
  undo(actionId: string): void;

  /**
   * Undo all actions in the given group.
   * Calls each action's `onUndo` callback in reverse push order.
   */
  undoGroup(groupId: string): void;

  /**
   * Commit (expire) a specific action immediately without undoing it.
   * The `onCommit` callback is invoked if provided.
   */
  commit(actionId: string): void;

  /**
   * Cancel all pending undo windows.
   * Each action's timer is cleared and the stack is emptied.
   * No undo or commit callbacks are called.
   */
  clear(): void;
}

/** @internal Default TTL for undo windows. */
export const DEFAULT_TTL_MS = 5000;
