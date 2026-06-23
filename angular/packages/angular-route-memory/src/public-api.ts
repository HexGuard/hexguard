/**
 * Public API for `@hexguard/angular-route-memory`.
 *
 * The package provides a single injectable — `injectRouteMemory()` — for
 * saving and restoring route-scoped context such as list filters, active
 * tabs, and scroll positions across navigation boundaries.
 */
export { injectRouteMemory } from './lib/route-memory';
export { createRouteMemory } from './lib/route-memory-observable';
export type { RouteMemoryHandle, RouteMemoryOptions } from './lib/types';
export type { RouteMemoryObservables } from './lib/route-memory-observable';
