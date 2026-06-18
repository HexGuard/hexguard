/**
 * Public API for `@hexguard/angular-network-status`.
 *
 * Provides signal-based connectivity state, connection-type detection,
 * debounced reconnection, and a promise-based whenBackOnline() helper.
 */
export { injectNetworkStatus } from './lib/network-status';
export type {
  NetworkStatusOptions,
  NetworkStatus,
  EffectiveConnectionType,
} from './lib/network-status';
