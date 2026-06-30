import { computed, DestroyRef, effect, Injectable, inject, signal } from '@angular/core';
import type { ThemeConfig, ThemeHandle, ThemeMode, TokenLayerMap } from './types';

const DEFAULT_PERSIST_KEY = 'hexguard-theme';

function loadPersistedMode(persistKey: string): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(persistKey);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {}
  return null;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly persistKey = signal(DEFAULT_PERSIST_KEY);
  private readonly mode = signal<ThemeMode>(loadPersistedMode(DEFAULT_PERSIST_KEY) ?? 'system');
  private readonly systemDark = signal<boolean>(false);
  private persistKeyLocked = false;
  private tokenLayers: TokenLayerMap | null = null;
  private tokenLayersLocked = false;

  readonly modeSignal = this.mode.asReadonly();

  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const m = this.mode();
    return m === 'system' ? (this.systemDark() ? 'dark' : 'light') : m;
  });

  readonly isDark = computed(() => this.effectiveTheme() === 'dark');
  readonly isLight = computed(() => this.effectiveTheme() === 'light');

  constructor() {
    const destroyRef = inject(DestroyRef);
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(mq.matches);
      const handler = (e: MediaQueryListEvent): void => this.systemDark.set(e.matches);
      mq.addEventListener('change', handler);
      destroyRef.onDestroy(() => mq.removeEventListener('change', handler));
    }
    effect(() => {
      if (typeof document === 'undefined') return;
      document.documentElement.setAttribute('data-theme', this.effectiveTheme());
    });
    // Token layer sync: when effective theme changes, write CSS custom properties
    effect(() => {
      if (typeof document === 'undefined' || !this.tokenLayers) return;
      const theme = this.effectiveTheme();
      const layer = this.tokenLayers[theme];
      if (!layer) return;
      const style = document.documentElement.style;
      for (const [key, value] of Object.entries(layer)) {
        const propName = key.startsWith('--') ? key : `--${key}`;
        style.setProperty(propName, value);
      }
    });
  }

  configureTokenLayers(layers: TokenLayerMap): void {
    if (this.tokenLayersLocked) return;
    this.tokenLayers = layers;
    this.tokenLayersLocked = true;
  }

  setMode(newMode: ThemeMode, persistKey?: string, config?: ThemeConfig): void {
    this.lockPersistKey(persistKey);
    this.mode.set(newMode);
    this.persistMode(newMode);
    if (config?.transitionClass) {
      this.applyTransition(config.transitionClass, config.transitionDuration ?? 300);
    }
  }

  toggle(config?: ThemeConfig): void {
    const target: ThemeMode = this.effectiveTheme() === 'dark' ? 'light' : 'dark';
    this.mode.set(target);
    this.persistMode(target);
    if (config?.transitionClass) {
      this.applyTransition(config.transitionClass, config.transitionDuration ?? 300);
    }
  }

  resetToSystem(): void {
    this.mode.set('system');
    this.persistMode('system');
  }

  private lockPersistKey(key?: string): void {
    if (!this.persistKeyLocked && key) {
      this.persistKey.set(key);
      this.persistKeyLocked = true;
      // Re-read persisted mode with the new key
      const persisted = loadPersistedMode(key);
      if (persisted) this.mode.set(persisted);
    }
  }

  private persistMode(m: ThemeMode): void {
    const key = this.persistKey();
    if (typeof localStorage === 'undefined') return;
    try {
      if (m === 'system') localStorage.removeItem(key);
      else localStorage.setItem(key, m);
    } catch {}
  }

  private applyTransition(transitionClass: string, duration: number): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add(transitionClass);
    setTimeout(() => document.documentElement.classList.remove(transitionClass), duration);
  }
}

export function injectTheme(config?: ThemeConfig): ThemeHandle {
  const service = inject(ThemeService);
  const persistKey = config?.persistKey;

  return {
    mode: service.modeSignal,
    effectiveTheme: service.effectiveTheme,
    isDark: service.isDark,
    isLight: service.isLight,
    setMode: (newMode: ThemeMode) => service.setMode(newMode, persistKey, config),
    toggle: () => service.toggle(config),
    resetToSystem: () => service.resetToSystem(),
  };
}

/**
 * Inject theme state with design token layer support.
 *
 * Combines `injectTheme()` with token layer configuration: when the
 * effective theme changes, the corresponding token layer is written as
 * CSS custom properties on `<html>`.
 *
 * @param config - Theme config with optional `tokens` for per-theme CSS custom property overrides.
 * @returns ThemeHandle — same as `injectTheme()`.
 *
 * @example
 * ```ts
 * const theme = injectTokenTheme({
 *   tokens: {
 *     light: { 'color-surface': '#ffffff', 'color-text': '#171717' },
 *     dark:  { 'color-surface': '#1a1a1a', 'color-text': '#f0f0f0' },
 *   },
 * });
 * theme.setMode('dark');
 * // Writes --color-surface: #1a1a1a and --color-text: #f0f0f0 on <html>
 * ```
 */
export function injectTokenTheme(config?: ThemeConfig): ThemeHandle {
  const service = inject(ThemeService);
  if (config?.tokens) {
    service.configureTokenLayers(config.tokens);
  }
  const persistKey = config?.persistKey;

  return {
    mode: service.modeSignal,
    effectiveTheme: service.effectiveTheme,
    isDark: service.isDark,
    isLight: service.isLight,
    setMode: (newMode: ThemeMode) => service.setMode(newMode, persistKey, config),
    toggle: () => service.toggle(config),
    resetToSystem: () => service.resetToSystem(),
  };
}
