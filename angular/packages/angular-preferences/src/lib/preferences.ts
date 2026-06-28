import { computed, inject, type Signal } from '@angular/core';
import { injectStorage, type TypedStorage } from '@hexguard/angular-storage';
import type { PreferenceDef } from './pref-factory';

/**
 * Typed handle returned by `injectPreferences`.
 */
export interface PreferencesHandle<T extends Record<string, PreferenceDef<unknown>>> {
  /** Get a typed signal for a specific preference key. */
  get<K extends keyof T>(key: K): Signal<T[K]['defaultValue']>;
  /** Set a preference value. */
  set<K extends keyof T>(key: K, value: T[K]['defaultValue']): void;
  /** Reset a single preference to its default value. */
  reset(key: keyof T): void;
  /** Reset all preferences to their defaults. */
  resetAll(): void;
  /** Patch multiple preferences at once. */
  patch(values: Partial<{ [K in keyof T]: T[K]['defaultValue'] }>): void;
}

/**
 * Injects typed user preferences from a schema definition.
 *
 * Each key in the schema becomes a typed signal backed by `@hexguard/angular-storage`,
 * providing cross-tab sync, TTL expiry, and persistence via JSON envelope.
 *
 * @example
 * ```typescript
 * const PREFS = {
 *   sidebarOpen: pref('sidebar-open', true),
 *   theme: pref('theme', 'system' as 'light' | 'dark' | 'system'),
 *   pageSize: pref('page-size', 20),
 * } as const;
 *
 * class AppComponent {
 *   readonly prefs = injectPreferences(PREFS);
 *   readonly sidebarOpen = this.prefs.get('sidebarOpen');
 *
 *   toggleSidebar() { this.prefs.set('sidebarOpen', !this.sidebarOpen()); }
 * }
 * ```
 */
export function injectPreferences<T extends Record<string, PreferenceDef<unknown>>>(
  schema: T,
): PreferencesHandle<T> {
  const defaults = {} as { [K in keyof T]: T[K]['defaultValue'] };
  const storageMap = {} as { [K in keyof T]: TypedStorage<T[K]['defaultValue']> };

  for (const key of Object.keys(schema) as (keyof T)[]) {
    const def = schema[key] as PreferenceDef<T[typeof key]['defaultValue']>;
    defaults[key] = def.defaultValue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageMap[key] = injectStorage<any>(def.key, {
      defaultValue: def.defaultValue,
    }) as TypedStorage<T[typeof key]['defaultValue']>;
  }

  return {
    get: <K extends keyof T>(key: K): Signal<T[K]['defaultValue']> => {
      return computed(() => storageMap[key].value());
    },
    set: <K extends keyof T>(key: K, value: T[K]['defaultValue']): void => {
      storageMap[key].set(value);
    },
    reset: (key: keyof T): void => {
      storageMap[key].set(defaults[key]);
    },
    resetAll: (): void => {
      for (const key of Object.keys(schema) as (keyof T)[]) {
        storageMap[key].set(defaults[key]);
      }
    },
    patch: (values: Partial<{ [K in keyof T]: T[K]['defaultValue'] }>): void => {
      for (const [key, value] of Object.entries(values)) {
        if (value !== undefined && key in schema) {
          (storageMap as Record<string, TypedStorage<unknown>>)[key].set(value);
        }
      }
    },
  };
}
