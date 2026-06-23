/**
 * Public API for `@hexguard/angular-command-palette`.
 *
 * The package provides a single injectable — `injectCommandRegistry()` — for
 * managing a headless command registry with keyboard shortcut support,
 * searchable command palette state, and context-aware enablement.
 */
export { injectCommandRegistry } from './lib/command-registry';
export type { Command, CommandRegistryOptions, CommandRegistryHandle } from './lib/types';
