import { Injectable, computed, DestroyRef, inject, signal, Signal } from '@angular/core';

import {
  DEFAULT_BREAKPOINTS,
  type BreakpointObserver,
  type BreakpointObserverOptions,
} from './types';

/**
 * Singleton service that provides the core breakpoint-observer logic.
 *
 * Each call to `createObserver()` returns an independent set of reactive signals
 * scoped to the consumer's injection context (for proper cleanup on destroy).
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class BreakpointObserverService {
  /**
   * Creates a new `BreakpointObserver` for the given options.
   *
   * @param options - Optional breakpoint configuration.
   * @returns A `BreakpointObserver` handle with `active`, `breakpoints`,
   * `above`, `below`, and `matches` signals.
   */
  createObserver(options?: BreakpointObserverOptions): BreakpointObserver {
    const breakpoints = options?.breakpoints ?? DEFAULT_BREAKPOINTS;
    const entries = Object.entries(breakpoints);
    const destroyRef = inject(DestroyRef);

    // Build match-media listeners for each breakpoint
    const breakpointSignals = new Map<string, ReturnType<typeof signal<boolean>>>();

    for (const [name, minWidth] of entries) {
      const mql = window.matchMedia(`(min-width: ${minWidth}px)`);

      const bpSignal = signal<boolean>(mql.matches);
      breakpointSignals.set(name, bpSignal);

      const handler = (event: MediaQueryListEvent): void => {
        bpSignal.set(event.matches);
      };

      mql.addEventListener('change', handler);
      destroyRef.onDestroy(() => {
        mql.removeEventListener('change', handler);
      });
    }

    // Build breakpoints record
    const breakpointRecord: Record<string, Signal<boolean>> = {};
    // Build above/below helpers
    const aboveCache = new Map<string, ReturnType<typeof computed<boolean>>>();
    const belowCache = new Map<string, ReturnType<typeof computed<boolean>>>();

    for (const [name] of entries) {
      const sig = breakpointSignals.get(name)!;
      breakpointRecord[name] = sig.asReadonly();
    }

    // Active breakpoint: largest matching name
    const active = computed<string>(() => {
      for (let i = entries.length - 1; i >= 0; i--) {
        const [name] = entries[i];
        const sig = breakpointSignals.get(name)!;
        if (sig()) {
          return name;
        }
      }
      return '';
    });

    const above = (name: string): ReturnType<typeof computed<boolean>> => {
      const cached = aboveCache.get(name);
      if (cached) {
        return cached;
      }

      const bp = breakpoints[name];
      if (bp === undefined) {
        const out = computed(() => false);
        aboveCache.set(name, out);
        return out;
      }

      // "above" means at or above: any breakpoint with min-width >= this one
      const matchingEntries = entries.filter(([, minW]) => minW >= bp);
      const result = computed(() => matchingEntries.some(([n]) => breakpointSignals.get(n)!()));
      aboveCache.set(name, result);
      return result;
    };

    const below = (name: string): ReturnType<typeof computed<boolean>> => {
      const cached = belowCache.get(name);
      if (cached) {
        return cached;
      }

      const bp = breakpoints[name];
      if (bp === undefined) {
        const out = computed(() => false);
        belowCache.set(name, out);
        return out;
      }

      const result = computed(() => !above(name)());
      belowCache.set(name, result);
      return result;
    };

    const matches = (query: string): ReturnType<typeof computed<boolean>> => {
      const mql = window.matchMedia(query);
      const matchSignal = signal<boolean>(mql.matches);

      const handler = (event: MediaQueryListEvent): void => {
        matchSignal.set(event.matches);
      };

      mql.addEventListener('change', handler);
      destroyRef.onDestroy(() => {
        mql.removeEventListener('change', handler);
      });

      return matchSignal.asReadonly();
    };

    return {
      active,
      breakpoints: breakpointRecord as Record<string, Signal<boolean>>,
      above,
      below,
      matches,
    };
  }
}
