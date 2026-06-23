import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export interface RouteMemoryObservables {
  /** Emits `true` when the given key has saved memory. */
  hasMemory$(key: string): Observable<boolean>;
  /** Save context under a key. */
  save(key: string, context: Record<string, unknown>): void;
  /** Restore context for a key, or `null` if not found. */
  restore(key: string): Record<string, unknown> | null;
  /** Clear memory for a key. */
  clear(key: string): void;
  /** Clear all route memory. */
  clearAll(): void;
}

const ROUTE_MEMORY_PREFIX = 'hexguard-route-memory:';

/**
 * Creates an observable-based route memory store, mirroring
 * `injectRouteMemory()` but without Angular DI. Pure in-memory
 * (no sessionStorage persistence).
 *
 * @returns An object with `hasMemory$(key)` observable, `save`,
 *   `restore`, `clear`, and `clearAll` methods.
 *
 * @example
 * ```ts
 * import { createRouteMemory } from '@hexguard/angular-route-memory';
 *
 * const mem = createRouteMemory();
 * mem.hasMemory$('orders-filter').subscribe(has =>
 *   has && restoreFilters(mem.restore('orders-filter'))
 * );
 * ```
 */
export function createRouteMemory(): RouteMemoryObservables {
  const storeSubject = new BehaviorSubject<Map<string, Record<string, unknown>>>(new Map());

  function hasMemory$(key: string): Observable<boolean> {
    return storeSubject.pipe(
      map((store) => store.has(key)),
      distinctUntilChanged(),
    );
  }

  function save(key: string, context: Record<string, unknown>): void {
    storeSubject.next(
      (() => {
        const next = new Map(storeSubject.getValue());
        next.set(key, { ...context });
        return next;
      })(),
    );
  }

  function restore(key: string): Record<string, unknown> | null {
    const entry = storeSubject.getValue().get(key);
    return entry ? { ...entry } : null;
  }

  function clear(key: string): void {
    storeSubject.next(
      (() => {
        const next = new Map(storeSubject.getValue());
        next.delete(key);
        return next;
      })(),
    );
  }

  function clearAll(): void {
    storeSubject.next(new Map());
  }

  return { hasMemory$, save, restore, clear, clearAll };
}
