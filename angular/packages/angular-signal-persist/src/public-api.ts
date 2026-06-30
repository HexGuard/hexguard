/**
 * Public API for `@hexguard/angular-signal-persist`.
 *
 * Provides `injectPersistedSignal()` — one-call persistence for any WritableSignal.
 * Wraps a signal to auto-persist its value to localStorage or sessionStorage
 * via an effect(), with hydration on init, TTL expiry, migration, and cross-tab sync.
 */
export { injectPersistedSignal } from './lib/signal-persist';
export { PersistSignalService } from './lib/persist-signal-service';
export type { PersistSignalOptions } from './lib/types';
