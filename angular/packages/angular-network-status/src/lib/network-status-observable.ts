import { Observable } from 'rxjs';
import type { EffectiveConnectionType } from './network-status';

export interface NetworkStatusObservables {
  /** Emits `true` when the browser goes online, `false` when offline. */
  readonly online$: Observable<boolean>;
  /** Emits the current effective connection type when it changes. */
  readonly connectionType$: Observable<EffectiveConnectionType>;
}

/**
 * Creates observables for browser connectivity state.
 *
 * Unlike the signal-based `injectNetworkStatus()`, this variant does NOT
 * apply a debounce to the online transition — every raw online/offline
 * event is emitted immediately.
 *
 * @returns An object with:
 *   - `online$`: emits `true`/`false` on every `online`/`offline` event.
 *   - `connectionType$`: emits the effective connection type on change.
 *
 * @example
 * ```ts
 * import { createNetworkStatusObservables } from '@hexguard/angular-network-status';
 *
 * const { online$, connectionType$ } = createNetworkStatusObservables();
 * online$.subscribe(isOnline => console.log('Online:', isOnline));
 * ```
 */
export function createNetworkStatusObservables(): NetworkStatusObservables {
  const online$ = new Observable<boolean>((subscriber) => {
    const onOnline = (): void => subscriber.next(true);
    const onOffline = (): void => subscriber.next(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  });

  const connectionType$ = new Observable<EffectiveConnectionType>((subscriber) => {
    const conn = (
      navigator as unknown as {
        connection?: {
          effectiveType: string;
          addEventListener: (e: string, fn: () => void) => void;
          removeEventListener: (e: string, fn: () => void) => void;
        };
      }
    ).connection;

    if (!conn) {
      subscriber.next('unknown');
      subscriber.complete();
      return;
    }

    const update = (): void => {
      subscriber.next((conn.effectiveType as EffectiveConnectionType) ?? 'unknown');
    };

    update();
    conn.addEventListener('change', update);

    return () => {
      conn.removeEventListener('change', update);
    };
  });

  return { online$, connectionType$ };
}
