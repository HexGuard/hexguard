/**
 * Public API for `@hexguard/angular-theme`.
 *
 * The package provides `injectTheme()` for headless theme switching state
 * (light/dark/system modes, CSS class management, prefers-color-scheme
 * detection, persistence) and `injectTokenTheme()` for combining theme
 * switching with design token override layers.
 */
export { injectTheme, injectTokenTheme } from './lib/theme';
export { ThemeService } from './lib/theme-service';
export type { ThemeMode, ThemeConfig, ThemeHandle, TokenLayerMap } from './lib/types';
