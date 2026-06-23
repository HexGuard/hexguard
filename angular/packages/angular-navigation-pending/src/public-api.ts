/**
 * Public API for `@hexguard/angular-navigation-pending`.
 *
 * The package provides a single injectable — `injectNavigationPending()` —
 * that wraps Angular Router events into signal-based navigation pending
 * state with configurable slow-navigation delay and route-scoped mode.
 */
export { injectNavigationPending } from './lib/navigation-pending';
export { fromRouterNavigation } from './lib/navigation-pending-observable';
export type { NavigationPendingOptions, NavigationPendingState } from './lib/types';
export type { NavigationPendingObservables } from './lib/navigation-pending-observable';
