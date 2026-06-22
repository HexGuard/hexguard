import { TestBed } from '@angular/core/testing';
import { injectFormDraft } from './form-drafts';

describe(injectFormDraft.name, () => {
  /** In-memory storage for testing. */
  function createMockStorage(): Storage {
    const store = new Map<string, string>();
    return {
      get length() {
        return store.size;
      },
      key: (_: number) => null,
      getItem(key: string) {
        return store.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        store.set(key, value);
      },
      removeItem(key: string) {
        store.delete(key);
      },
      clear() {
        store.clear();
      },
    };
  }

  function createDraft<T>(key: string, options?: Parameters<typeof injectFormDraft<T>>[1]) {
    return TestBed.runInInjectionContext(() => injectFormDraft<T>(key, options));
  }

  it('starts with no draft and no metadata', () => {
    const draft = createDraft('test');
    expect(draft.hasDraft()).toBe(false);
    expect(draft.metadata()).toBeNull();
    expect(draft.restore()).toBeNull();
  });

  it('saves and restores a draft', async () => {
    const storage = createMockStorage();
    const draft = createDraft<{ title: string }>('form-1', {
      storage,
      debounceMs: 50,
    });

    draft.save({ title: 'Hello' });
    expect(draft.hasDraft()).toBe(false); // not yet persisted (debounced)

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 60));
    expect(draft.hasDraft()).toBe(true);

    const restored = draft.restore();
    expect(restored).not.toBeNull();
    expect(restored!.data.title).toBe('Hello');
    expect(restored!.meta.savedAt).toBeTruthy();
    expect(restored!.meta.expiresAt).toBeTruthy();
  });

  it('clear() removes the draft', async () => {
    const storage = createMockStorage();
    const draft = createDraft<{ val: number }>('form-2', { storage, debounceMs: 20 });

    draft.save({ val: 42 });
    await new Promise((r) => setTimeout(r, 30));
    expect(draft.hasDraft()).toBe(true);

    draft.clear();
    expect(draft.hasDraft()).toBe(false);
    expect(draft.metadata()).toBeNull();
    expect(draft.restore()).toBeNull();
  });

  it('does not restore expired drafts', async () => {
    const storage = createMockStorage();
    const draft = createDraft<{ val: number }>('form-3', {
      storage,
      debounceMs: 20,
    });

    draft.save({ val: 99 });
    await new Promise((r) => setTimeout(r, 30));
    expect(draft.hasDraft()).toBe(true);

    // Manually write an expired draft to storage
    const expired = JSON.stringify({
      data: { val: 99 },
      meta: { savedAt: '2020-01-01T00:00:00.000Z', expiresAt: '2020-01-01T00:00:00.000Z' },
    });
    storage.setItem('hexguard:draft:form-3', expired);

    const restored = draft.restore();
    expect(restored).toBeNull();
  });

  it('updates metadata on successive saves', async () => {
    const storage = createMockStorage();
    const draft = createDraft<{ val: number }>('form-4', { storage, debounceMs: 20 });

    draft.save({ val: 1 });
    await new Promise((r) => setTimeout(r, 30));
    const meta1 = draft.metadata()!;

    draft.save({ val: 2 });
    await new Promise((r) => setTimeout(r, 30));
    const meta2 = draft.metadata()!;

    expect(meta2.savedAt).not.toBe(meta1.savedAt);
    expect(meta2.expiresAt).not.toBe(meta1.expiresAt);
  });

  it('restore returns null for non-existent key', () => {
    const draft = createDraft('nonexistent');
    expect(draft.restore()).toBeNull();
  });

  it('handles missing storage gracefully', () => {
    const draft = createDraft<{ val: number }>('no-storage', {
      storage: undefined as unknown as Storage,
    });

    draft.save({ val: 1 });
    // No crash
    expect(draft.hasDraft()).toBe(false);

    draft.clear();
    expect(draft.hasDraft()).toBe(false);

    expect(draft.restore()).toBeNull();
  });

  it('clear() cancels pending debounced save', async () => {
    const storage = createMockStorage();
    const draft = createDraft<{ val: number }>('form-5', { storage, debounceMs: 100 });

    draft.save({ val: 42 });
    draft.clear(); // cancel before debounce fires

    await new Promise((r) => setTimeout(r, 120));
    // Should NOT have saved
    expect(draft.hasDraft()).toBe(false);
    expect(storage.getItem('hexguard:draft:form-5')).toBeNull();
  });
});
