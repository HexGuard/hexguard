import { TestBed } from '@angular/core/testing';

import { injectUndoStack } from './undo';

describe(injectUndoStack.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createAction(overrides: Partial<ReturnType<typeof makeAction>> = {}) {
    return makeAction(overrides);
  }

  const makeAction = (overrides: any = {}) => ({
    id: 'action-1',
    type: 'delete',
    data: { id: '42' },
    onUndo: vi.fn(),
    ...overrides,
  });

  describe('push and state', () => {
    it('starts with no pending undos', () => {
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack();
        expect(undo.hasPending()).toBe(false);
        expect(undo.pendingUndos()).toEqual([]);
      });
    });

    it('adds action on push', () => {
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack();
        const action = createAction();
        undo.push(action);
        expect(undo.hasPending()).toBe(true);
        expect(undo.pendingUndos()).toHaveLength(1);
        expect(undo.pendingUndos()[0].id).toBe('action-1');
      });
    });

    it('tracks multiple actions', () => {
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack();
        undo.push(createAction({ id: 'a', type: 'delete' }));
        undo.push(createAction({ id: 'b', type: 'archive' }));
        expect(undo.pendingUndos()).toHaveLength(2);
      });
    });
  });

  describe('undo', () => {
    it('undoes an action and calls onUndo', () => {
      TestBed.runInInjectionContext(() => {
        const onUndo = vi.fn();
        const undo = injectUndoStack();
        const action = createAction({ onUndo });
        undo.push(action);
        undo.undo('action-1');
        expect(onUndo).toHaveBeenCalledTimes(1);
        expect(undo.hasPending()).toBe(false);
      });
    });

    it('does nothing for unknown action ID', () => {
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack();
        undo.undo('unknown');
        expect(undo.hasPending()).toBe(false);
      });
    });
  });

  describe('TTL expiry', () => {
    it('auto-commits after default TTL', () => {
      TestBed.runInInjectionContext(() => {
        const onCommit = vi.fn();
        const undo = injectUndoStack({ defaultTtlMs: 5000, onCommit });
        undo.push(createAction());
        expect(undo.hasPending()).toBe(true);

        vi.advanceTimersByTime(5000);
        expect(undo.hasPending()).toBe(false);
        expect(onCommit).toHaveBeenCalledTimes(1);
      });
    });

    it('auto-commits with per-action TTL', () => {
      TestBed.runInInjectionContext(() => {
        const onCommit = vi.fn();
        const undo = injectUndoStack({ defaultTtlMs: 10000, onCommit });
        undo.push(createAction({ ttlMs: 2000 }));
        expect(undo.hasPending()).toBe(true);

        vi.advanceTimersByTime(2000);
        expect(undo.hasPending()).toBe(false);
        expect(onCommit).toHaveBeenCalledTimes(1);
      });
    });

    it('cancels the timer on manual undo', () => {
      TestBed.runInInjectionContext(() => {
        const onCommit = vi.fn();
        const onUndo = vi.fn();
        const undo = injectUndoStack({ defaultTtlMs: 5000, onCommit });
        undo.push(createAction({ onUndo }));
        undo.undo('action-1');

        vi.advanceTimersByTime(5000);
        expect(onCommit).not.toHaveBeenCalled();
        expect(onUndo).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('commit', () => {
    it('commits an action and calls onCommit', () => {
      TestBed.runInInjectionContext(() => {
        const onCommit = vi.fn();
        const undo = injectUndoStack({ onCommit });
        undo.push(createAction());
        undo.commit('action-1');
        expect(onCommit).toHaveBeenCalledTimes(1);
        expect(undo.hasPending()).toBe(false);
      });
    });
  });

  describe('undoGroup', () => {
    it('undoes all actions in a group', () => {
      TestBed.runInInjectionContext(() => {
        const onUndo1 = vi.fn();
        const onUndo2 = vi.fn();
        const undo = injectUndoStack();
        undo.push(createAction({ id: 'a', groupId: 'batch-1', onUndo: onUndo1 }));
        undo.push(createAction({ id: 'b', groupId: 'batch-1', onUndo: onUndo2 }));
        undo.undoGroup('batch-1');
        expect(onUndo1).toHaveBeenCalledTimes(1);
        expect(onUndo2).toHaveBeenCalledTimes(1);
        expect(undo.hasPending()).toBe(false);
      });
    });
  });

  describe('clear', () => {
    it('removes all pending actions without calling callbacks', () => {
      TestBed.runInInjectionContext(() => {
        const onCommit = vi.fn();
        const onUndo = vi.fn();
        const undo = injectUndoStack({ onCommit });
        undo.push(createAction({ onUndo }));
        undo.push(createAction({ id: 'b', onUndo }));
        undo.clear();
        expect(undo.hasPending()).toBe(false);
        expect(undo.pendingUndos()).toHaveLength(0);
        expect(onUndo).not.toHaveBeenCalled();
        expect(onCommit).not.toHaveBeenCalled();
      });
    });
  });

  describe('undosForType', () => {
    it('filters actions by type', () => {
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack();
        undo.push(createAction({ id: 'a', type: 'delete' }));
        undo.push(createAction({ id: 'b', type: 'archive' }));
        undo.push(createAction({ id: 'c', type: 'delete' }));
        const deletes = undo.undosForType('delete');
        expect(deletes()).toHaveLength(2);
        expect(deletes()[0].id).toBe('a');
        expect(deletes()[1].id).toBe('c');
      });
    });
  });

  describe('cleanup on destroy', () => {
    it('clears timers on destroy', () => {
      const onCommit = vi.fn();
      TestBed.runInInjectionContext(() => {
        const undo = injectUndoStack({ defaultTtlMs: 5000, onCommit });
        undo.push(createAction());
        // Simulate component destroy to trigger DestroyRef cleanup
        TestBed.resetTestingModule();
      });
      // After DestroyRef cleanup, timers should be cleared
      vi.advanceTimersByTime(5000);
      expect(onCommit).not.toHaveBeenCalled();
    });
  });
});
