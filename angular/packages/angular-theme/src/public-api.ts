/**
 * Public API for `@hexguard/angular-theme`.
 *
 * The package provides a single injectable — `injectTheme()` — for
 * headless theme switching state: light/dark/system modes, CSS class
 * management, prefers-color-scheme detection, and persistence.
 */
export { injectTheme } from './lib/theme';
export type { ThemeMode, ThemeConfig, ThemeHandle } from './lib/types';
