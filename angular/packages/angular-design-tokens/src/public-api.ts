/**
 * Public API for `@hexguard/angular-design-tokens`.
 *
 * Provides a headless design token registry with typed token definitions,
 * CSS custom property synchronization, signal-based access, aliasing,
 * and per-theme override layers.
 */
export { defineTokens } from './lib/define-tokens';
export type {
  TokenRegistry,
  TokenDefinition,
  FlatTokens,
} from './lib/define-tokens';
export { syncTokensToRoot, unsyncTokensFromRoot } from './lib/css-sync';
export type { SyncOptions } from './lib/css-sync';
export { injectTokens } from './lib/inject-tokens';
export type { TokenAccess } from './lib/inject-tokens';
export { tokenAliases } from './lib/token-aliases';
export { TokenThemeLayer } from './lib/theme-layers';
