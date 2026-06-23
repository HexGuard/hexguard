import { Observable } from 'rxjs';
import { DEFAULT_BREAKPOINTS } from './types';

export interface BreakpointChange {
  readonly name: string;
  readonly matches: boolean;
}

/**
 * Creates a cold observable that emits `BreakpointChange` each time a
 * breakpoint crosses its threshold.
 *
 * Each subscriber gets its own set of `MediaQueryList` listeners which
 * are torn down on unsubscribe. Use the `share()` operator from
 * `rxjs/operators` for multicasting to multiple subscribers.
 *
 * @param breakpoints - Custom breakpoint map (name → min-width in px).
 *   Defaults to Tailwind-compatible breakpoints: `{ sm: 640, md: 768,
 *   lg: 1024, xl: 1280, '2xl': 1536 }`.
 * @returns A cold `Observable<BreakpointChange>` emitting `{ name,
 *   matches }` on every breakpoint threshold crossing.
 *
 * @example
 * ```ts
 * import { fromBreakpointChanges } from '@hexguard/angular-breakpoint-observer';
 *
 * fromBreakpointChanges().subscribe(change => {
 *   console.log(`${change.name}: ${change.matches}`);
 * });
 * ```
 */
export function fromBreakpointChanges(
  breakpoints?: Record<string, number>,
): Observable<BreakpointChange> {
  const bpMap = breakpoints ?? DEFAULT_BREAKPOINTS;
  const sortedEntries = Object.entries(bpMap).sort((a, b) => a[1] - b[1]);

  return new Observable<BreakpointChange>((subscriber) => {
    const listeners: Array<{
      mql: MediaQueryList;
      handler: (e: MediaQueryListEvent) => void;
    }> = [];

    for (const [name, minWidth] of sortedEntries) {
      const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
      const handler = (event: MediaQueryListEvent): void => {
        subscriber.next({ name, matches: event.matches });
      };
      mql.addEventListener('change', handler);
      listeners.push({ mql, handler });
    }

    return () => {
      for (const { mql, handler } of listeners) {
        mql.removeEventListener('change', handler);
      }
    };
  });
}
