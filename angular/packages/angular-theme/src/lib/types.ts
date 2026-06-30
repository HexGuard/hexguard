import type { Signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Per-theme token overrides written as CSS custom properties on `<html>`.
 * Keys are theme names ('light', 'dark', etc.), values are token path → CSS value maps.
 *
 * @example
 * ```ts
 * const tokens: TokenLayerMap = {
 *   light: { 'color-surface': '#ffffff', 'color-text': '#171717' },
 *   dark:  { 'color-surface': '#1a1a1a', 'color-text': '#f0f0f0' },
 * };
 * ```
 */
export type TokenLayerMap = Readonly<Record<string, Readonly<Record<string, string>>>>;

export interface ThemeConfig {
  /** Default theme mode. Default: 'system'. */
  readonly defaultMode?: ThemeMode;
  /** localStorage key for persisting the chosen mode. Default: 'hexguard-theme'. */
  readonly persistKey?: string;
  /**
   * CSS class added to `<html>` during theme transitions to enable smooth
   * CSS transitions. Removed after a short delay. Default: no transition class.
   */
  readonly transitionClass?: string;
  /**
   * Delay in ms before removing the transition class. Default: 300.
   * Only applies when `transitionClass` is set.
   */
  readonly transitionDuration?: number;
  /**
   * Per-theme token overrides. When the effective theme changes, the
   * corresponding token layer is written as CSS custom properties on `<html>`.
   * Property names follow `--{key}` pattern (e.g. `--color-surface`).
   */
  readonly tokens?: TokenLayerMap;
}

export interface ThemeHandle {
  /** The currently selected mode: 'light', 'dark', or 'system'. */
  readonly mode: Signal<ThemeMode>;
  /** The resolved theme — 'light' or 'dark' (system preference is resolved). */
  readonly effectiveTheme: Signal<'light' | 'dark'>;
  /** Whether the effective theme is dark. */
  readonly isDark: Signal<boolean>;
  /** Whether the effective theme is light. */
  readonly isLight: Signal<boolean>;

  /** Set the theme mode explicitly. */
  setMode(mode: ThemeMode): void;
  /** Toggle between light and dark (ignores system mode). */
  toggle(): void;
  /** Reset to system preference. */
  resetToSystem(): void;
}
