/**
 * Public API for `@hexguard/angular-network-status`.
 *
 * Provides signal-based connectivity state, connection-type detection,
 * debounced reconnection, and a promise-based whenBackOnline() helper.
 *
 * Also provides observable-based alternatives for RxJS consumers.
 */
export { injectNetworkStatus, NetworkStatusService } from './lib/network-status';
export { createNetworkStatusObservables } from './lib/network-status-observable';
export type { NetworkStatusObservables } from './lib/network-status-observable';
export type {
  NetworkStatusOptions,
  NetworkStatus,
  EffectiveConnectionType,
} from './lib/network-status';
