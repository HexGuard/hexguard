import { TestBed } from '@angular/core/testing';
import { injectSelectionState } from './selection-state';

describe('injectSelectionState', () => {
  it('starts with empty selection', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      expect(state.count()).toBe(0);
      expect(state.isEmpty()).toBe(true);
      expect(state.canAct()).toBe(false);
      expect(state.first()).toBeNull();
      expect([...state.selected()]).toEqual([]);
    });
  });

  it('selects a single key', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      expect(state.count()).toBe(1);
      expect(state.selected().has('a')).toBe(true);
      expect(state.canAct()).toBe(true);
      expect(state.first()).toBe('a');
    });
  });

  it('toggles a key', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();

      state.toggle('a');
      expect(state.selected().has('a')).toBe(true);

      state.toggle('a');
      expect(state.selected().has('a')).toBe(false);
    });
  });

  it('deselects a key', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.select('b');
      state.deselect('a');
      expect(state.selected().has('a')).toBe(false);
      expect(state.selected().has('b')).toBe(true);
    });
  });

  it('clears all selection', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.select('b');
      state.clear();
      expect(state.count()).toBe(0);
      expect(state.isEmpty()).toBe(true);
    });
  });

  it('replaces selection', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.replace(['b', 'c']);
      expect(state.count()).toBe(2);
      expect(state.selected().has('b')).toBe(true);
      expect(state.selected().has('c')).toBe(true);
      expect(state.selected().has('a')).toBe(false);
    });
  });

  it('selects all visible keys with selectAll', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.selectAll(['b', 'c']);
      expect(state.count()).toBe(3);
    });
  });

  it('toggleAll selects all when nothing selected', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.toggleAll(['a', 'b']);
      expect(state.count()).toBe(2);
    });
  });

  it('toggleAll deselects all when all visible are selected', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.select('b');
      state.toggleAll(['a', 'b']);
      expect(state.count()).toBe(0);
    });
  });

  it('toggleAll selects all when partially selected', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.toggleAll(['a', 'b']);
      expect(state.count()).toBe(2);
    });
  });

  it('deselect is no-op for non-selected key', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.deselect('nonexistent');
      expect(state.count()).toBe(0);
    });
  });

  it('single-selection mode replaces previous selection on select', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>({ multi: false });
      state.select('a');
      state.select('b');
      expect(state.count()).toBe(1);
      expect(state.selected().has('a')).toBe(false);
      expect(state.selected().has('b')).toBe(true);
    });
  });

  it('single-selection mode replaces previous selection on toggle', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>({ multi: false });
      state.toggle('a');
      state.toggle('b');
      expect(state.count()).toBe(1);
      expect(state.selected().has('b')).toBe(true);
    });
  });

  it('isAllSelected checks visible keys correctly', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.selectAll(['a', 'b']);
      expect(state.isAllSelected()(['a', 'b'])).toBe(true);
      expect(state.isAllSelected()(['a', 'b', 'c'])).toBe(false);
      expect(state.isAllSelected()([])).toBe(false);
    });
  });

  it('first returns null when empty', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      expect(state.first()).toBeNull();
    });
  });

  it('toggleAll with empty visible list does nothing', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.toggleAll([]);
      expect(state.count()).toBe(1);
    });
  });

  it('selectAll on empty visible list does nothing', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectSelectionState<string>();
      state.select('a');
      state.selectAll([]);
      expect(state.count()).toBe(1);
    });
  });
});
