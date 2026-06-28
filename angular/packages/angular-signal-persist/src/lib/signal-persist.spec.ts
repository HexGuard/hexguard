import { Component, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectPersistedSignal } from './signal-persist';
import type { PersistSignalOptions } from './types';

function flushEffects(): void {
  TestBed.flushEffects();
}

describe('injectPersistedSignal', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  function setup<T>(
    key: string,
    defaultValue: T,
    options?: PersistSignalOptions<T>,
  ): { signal: WritableSignal<T> } {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly signal = injectPersistedSignal<T>(key, defaultValue, {
        ...options,
        syncAcrossTabs: false,
      } as PersistSignalOptions<T>);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    flushEffects();
    return { signal: fixture.componentInstance.signal };
  }

  it('should return default value when no stored value exists', () => {
    const { signal } = setup('test-key', 'default');
    expect(signal()).toBe('default');
  });

  it('should hydrate from stored value', () => {
    window.localStorage.setItem('test-key', '"stored-value"');
    const { signal } = setup('test-key', 'default');
    expect(signal()).toBe('stored-value');
  });

  it('should persist on set()', () => {
    const { signal } = setup('test-key', 'default');
    signal.set('new-value');
    flushEffects();
    expect(window.localStorage.getItem('test-key')).toBe('"new-value"');
  });

  it('should persist on update()', () => {
    const { signal } = setup<number>('test-key', 0);
    signal.update((v) => v + 1);
    flushEffects();
    expect(window.localStorage.getItem('test-key')).toBe('1');
  });

  it('should persist on update() with object spread', () => {
    const { signal } = setup<{ count: number }>('test-key', { count: 0 });
    signal.update((v) => ({ count: v.count + 1 }));
    flushEffects();
    expect(JSON.parse(window.localStorage.getItem('test-key')!)).toEqual({ count: 1 });
  });

  it('should use stored value when TTL has not expired', () => {
    window.localStorage.setItem(
      'test-key',
      JSON.stringify({ _value: 'fresh', _ts: Date.now() }),
    );
    const { signal } = setup('test-key', 'default', { ttlMs: 60_000 });
    expect(signal()).toBe('fresh');
  });

  it('should fall back to default when TTL has expired', () => {
    window.localStorage.setItem(
      'test-key',
      JSON.stringify({ _value: 'stale', _ts: Date.now() - 120_000 }),
    );
    const { signal } = setup('test-key', 'default', { ttlMs: 60_000 });
    expect(signal()).toBe('default');
  });

  it('should call onRestore with stored value', () => {
    window.localStorage.setItem('test-key', '"old-format"');
    const onRestore = vi.fn((stored: string) => `migrated-${stored}`) as (stored: string) => string;
    const { signal } = setup<string>('test-key', 'default', { onRestore });
    expect(signal()).toBe('migrated-old-format');
  });

  it('should use custom serializer and deserializer', () => {
    const { signal } = setup('test-key', { a: 1 }, {
      serializer: (v) => btoa(JSON.stringify(v)),
      deserializer: (raw) => JSON.parse(atob(raw)),
    });
    signal.set({ a: 42 });
    flushEffects();
    expect(window.localStorage.getItem('test-key')).toBe(btoa(JSON.stringify({ a: 42 })));
  });

  it('should handle storage failure gracefully on hydration', () => {
    // sessionStorage is available but separate - causes getItem to be used for a key in localStorage
    // that won't match. This test verifies the default is used when hydration fails.
    const { signal } = setup('test-key', 'default', {
      backend: undefined as unknown as typeof localStorage,
    });
    expect(signal()).toBe('default');
  });

  it('should handle non-JSON stored value gracefully', () => {
    window.localStorage.setItem('test-key', 'not-json');
    const { signal } = setup('test-key', 'default');
    expect(signal()).toBe('default');
  });
});
