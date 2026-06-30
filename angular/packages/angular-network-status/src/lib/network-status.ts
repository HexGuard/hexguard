import { inject } from '@angular/core';
import { NetworkStatusService, EffectiveConnectionType } from './network-status-service';

export { NetworkStatusService } from './network-status-service';
export type { EffectiveConnectionType };

/** Options for injectNetworkStatus. */
export interface NetworkStatusOptions {
  readonly onlineDebounceMs?: number;
  readonly backOnlineSignalDurationMs?: number;
}

/** The return type of injectNetworkStatus. */
export interface NetworkStatus {
  readonly online: import('@angular/core').Signal<boolean>;
  readonly connectionType: import('@angular/core').Signal<EffectiveConnectionType>;
  readonly recentlyBackOnline: import('@angular/core').Signal<boolean>;
  whenBackOnline(): Promise<void>;
}

/**
 * Injects the app-wide network connectivity state.
 * Multiple calls share the same singleton.
 */
export function injectNetworkStatus(options?: NetworkStatusOptions): NetworkStatus {
  const service = inject(NetworkStatusService);
  if (options) service.configure(options);
  return {
    online: service.online.asReadonly(),
    connectionType: service.connectionType.asReadonly(),
    recentlyBackOnline: service.recentlyBackOnline.asReadonly(),
    whenBackOnline: () => service.whenBackOnline(),
  };
}
