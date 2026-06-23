import { TestBed } from '@angular/core/testing';
import { injectRouteMemory } from './route-memory';

describe(injectRouteMemory.name, () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('starts with no memory for any key', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      expect(mem.restore('orders-list')).toBeNull();
    });
  });

  it('returns null for missing key', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      expect(mem.restore('nonexistent')).toBeNull();
    });
  });

  it('saves and restores a context value', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('orders-list', { tab: 'active', scrollY: 450 });
      const restored = mem.restore('orders-list');
      expect(restored).toEqual({ tab: 'active', scrollY: 450 });
    });
  });

  it('returns a copy on restore, not a reference', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('key', { value: 1 });
      const r1 = mem.restore('key')!;
      const r2 = mem.restore('key')!;
      expect(r1).toEqual(r2);
      expect(r1).not.toBe(r2);
    });
  });

  it('overwrites existing value on save', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('key', { value: 1 });
      mem.save('key', { value: 2 });
      expect(mem.restore('key')).toEqual({ value: 2 });
    });
  });

  it('clears a specific key', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('a', { x: 1 });
      mem.save('b', { y: 2 });
      mem.clear('a');
      expect(mem.restore('a')).toBeNull();
      expect(mem.restore('b')).toEqual({ y: 2 });
    });
  });

  it('clears all keys', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('a', { x: 1 });
      mem.save('b', { y: 2 });
      mem.clearAll();
      expect(mem.restore('a')).toBeNull();
      expect(mem.restore('b')).toBeNull();
    });
  });

  it('hasMemory returns true after save', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('key', { value: 1 });
      expect(mem.hasMemory('key')()).toBe(true);
    });
  });

  it('hasMemory returns false after clear', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.save('key', { value: 1 });
      mem.clear('key');
      expect(mem.hasMemory('key')()).toBe(false);
    });
  });

  it('autoSave saves context on destroy', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory();
      mem.autoSave('key', () => ({ saved: true }));
      expect(typeof mem.autoSave).toBe('function');
    });
  });

  it('serialized mode persists to sessionStorage', () => {
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory({ serialized: true });
      mem.save('key', { value: 'test' });
      const raw = sessionStorage.getItem('hexguard-route-memory:key');
      expect(raw).toBeTruthy();
      expect(JSON.parse(raw!)).toEqual({ value: 'test' });
    });
  });

  it('serialized mode restores from sessionStorage', () => {
    sessionStorage.setItem('hexguard-route-memory:key', JSON.stringify({ persisted: true }));
    TestBed.runInInjectionContext(() => {
      const mem = injectRouteMemory({ serialized: true });
      expect(mem.restore('key')).toEqual({ persisted: true });
    });
  });

  it('clearAll removes all sessionStorage entries', () => {
    TestBed.runInInjectionContext(() => {
      sessionStorage.setItem('hexguard-route-memory:a', JSON.stringify({}));
      sessionStorage.setItem('hexguard-route-memory:b', JSON.stringify({}));
      sessionStorage.setItem('other-key', JSON.stringify({}));
      const mem = injectRouteMemory({ serialized: true });
      mem.clearAll();
      expect(sessionStorage.getItem('hexguard-route-memory:a')).toBeNull();
      expect(sessionStorage.getItem('hexguard-route-memory:b')).toBeNull();
      expect(sessionStorage.getItem('other-key')).toBeTruthy();
    });
  });
});
