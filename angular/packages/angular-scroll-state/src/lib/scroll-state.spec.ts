import { TestBed } from '@angular/core/testing';
import { injectScrollState } from './scroll-state';

describe(injectScrollState.name, () => {
  it('starts with scrollY of 0', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState();
      expect(state.scrollY()).toBe(0);
    });
  });

  it('save stores current scrollY', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState();
      state.save('test-key');
      const restored = state.restore('test-key');
      expect(restored).toBe(0);
    });
  });

  it('restore returns saved value', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState();
      state.save('pos');
      expect(state.restore('pos')).toBe(0);
    });
  });

  it('restore returns null for missing key', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState();
      expect(state.restore('nonexistent')).toBeNull();
    });
  });

  it('save overwrites previous value', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState();
      state.save('key');
      state.save('key');
      expect(state.restore('key')).toBe(0);
    });
  });

  it('accepts custom debounce option', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectScrollState({ debounceMs: 200 });
      expect(state.scrollY()).toBe(0);
    });
  });
});
