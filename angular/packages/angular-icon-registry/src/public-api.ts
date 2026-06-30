/**
 * Public API for `@hexguard/angular-icon-registry`.
 *
 * Provides a headless icon registry for centralized SVG icon management
 * with lazy loading, caching, sizing via design tokens, and color control.
 */
export { provideIcons, injectIcons } from './lib/icon-registry';
export type { IconConfig, IconDefinition, IconRenderData, IconRegistry } from './lib/icon-registry';
