import { computed, DestroyRef, effect, inject, signal } from '@angular/core';
import type { ThemeConfig, ThemeHandle, ThemeMode } from './types';

const DEFAULT_PERSIST_KEY = 'hexguard-theme';

export function injectTheme(config?: ThemeConfig): ThemeHandle {
  const destroyRef = inject(DestroyRef);
  const persistKey = config?.persistKey ?? DEFAULT_PERSIST_KEY;
  const defaultMode = config?.defaultMode ?? loadPersistedMode(persistKey) ?? 'system';

  const mode = signal<ThemeMode>(defaultMode);
  const systemDark = signal<boolean>(false);

  // Set up matchMedia listener for system preference
  let mq: MediaQueryList | null = null;
  if (typeof window !== 'undefined' && window.matchMedia) {
    mq = window.matchMedia('(prefers-color-scheme: dark)');
    systemDark.set(mq.matches);
    const handler = (e: MediaQueryListEvent): void => {
      systemDark.set(e.matches);
    };
    mq.addEventListener('change', handler);
    destroyRef.onDestroy(() => {
      mq?.removeEventListener('change', handler);
    });
  }

  const effectiveTheme = computed<'light' | 'dark'>((): 'light' | 'dark' => {
    const m = mode();
    if (m === 'system') {
      return systemDark() ? 'dark' : 'light';
    }
    return m;
  });

  const isDark = computed(() => effectiveTheme() === 'dark');
  const isLight = computed(() => effectiveTheme() === 'light');

  // Apply theme to DOM
  function applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;

    // Add transition class if configured
    if (config?.transitionClass) {
      document.documentElement.classList.add(config.transitionClass);
      setTimeout(() => {
        if (config?.transitionClass) {
          document.documentElement.classList.remove(config.transitionClass);
        }
      }, config?.transitionDuration ?? 300);
    }

    document.documentElement.setAttribute('data-theme', theme);
  }

  // Persist mode
  function persistMode(m: ThemeMode): void {
    if (typeof localStorage === 'undefined') return;
    if (m === 'system') {
      localStorage.removeItem(persistKey);
    } else {
      localStorage.setItem(persistKey, m);
    }
  }

  // React to effective theme changes
  effect(() => {
    applyTheme(effectiveTheme());
  });

  function setMode(newMode: ThemeMode): void {
    mode.set(newMode);
    persistMode(newMode);
  }

  function toggle(): void {
    const current = effectiveTheme();
    const target: ThemeMode = current === 'dark' ? 'light' : 'dark';
    mode.set(target);
    persistMode(target);
  }

  function resetToSystem(): void {
    mode.set('system');
    persistMode('system');
  }

  return {
    mode: mode.asReadonly(),
    effectiveTheme,
    isDark,
    isLight,
    setMode,
    toggle,
    resetToSystem,
  };
}

function loadPersistedMode(persistKey: string): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(persistKey);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
  } catch {
    // localStorage not available
  }
  return null;
}
