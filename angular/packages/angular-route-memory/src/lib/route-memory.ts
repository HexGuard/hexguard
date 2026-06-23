import { DestroyRef, inject, signal } from '@angular/core';
import type { RouteMemoryHandle, RouteMemoryOptions } from './types';

const ROUTE_MEMORY_PREFIX = 'hexguard-route-memory:';

export function injectRouteMemory(options?: RouteMemoryOptions): RouteMemoryHandle {
  const destroyRef = inject(DestroyRef);
  const serialized = options?.serialized ?? false;
  const store = new Map<string, Record<string, unknown>>();

  if (serialized) {
    hydrateFromSession(store);
  }

  function getStorageKey(key: string): string {
    return `${ROUTE_MEMORY_PREFIX}${key}`;
  }

  function hasMemory(key: string): ReturnType<RouteMemoryHandle['hasMemory']> {
    if (serialized) {
      const raw = sessionStorage.getItem(getStorageKey(key));
      return signal(raw !== null).asReadonly();
    }
    return signal(store.has(key)).asReadonly();
  }

  function save(key: string, context: Record<string, unknown>): void {
    store.set(key, { ...context });
    if (serialized) {
      sessionStorage.setItem(getStorageKey(key), JSON.stringify(context));
    }
  }

  function restore(key: string): Record<string, unknown> | null {
    if (serialized) {
      const raw = sessionStorage.getItem(getStorageKey(key));
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    const entry = store.get(key);
    return entry ? { ...entry } : null;
  }

  function clear(key: string): void {
    store.delete(key);
    if (serialized) {
      sessionStorage.removeItem(getStorageKey(key));
    }
  }

  function clearAll(): void {
    store.clear();
    if (serialized) {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k?.startsWith(ROUTE_MEMORY_PREFIX)) {
          keys.push(k);
        }
      }
      for (const k of keys) {
        sessionStorage.removeItem(k);
      }
    }
  }

  function autoSave(key: string, factory: () => Record<string, unknown>): void {
    destroyRef.onDestroy(() => {
      save(key, factory());
    });
  }

  return {
    hasMemory,
    save,
    restore,
    clear,
    clearAll,
    autoSave,
  };
}

function hydrateFromSession(store: Map<string, Record<string, unknown>>): void {
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k?.startsWith(ROUTE_MEMORY_PREFIX)) {
      const key = k.slice(ROUTE_MEMORY_PREFIX.length);
      try {
        const parsed = JSON.parse(sessionStorage.getItem(k)!) as Record<string, unknown>;
        store.set(key, parsed);
      } catch {
        // skip malformed entries
      }
    }
  }
}
