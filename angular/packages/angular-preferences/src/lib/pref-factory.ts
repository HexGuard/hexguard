/**
 * Factory function that creates a typed preference definition.
 *
 * @example
 * ```typescript
 * const USER_PREFS = {
 *   sidebarOpen: pref('sidebar-open', true),
 *   theme: pref('theme', 'system' as 'light' | 'dark' | 'system'),
 *   pageSize: pref('page-size', 20),
 * } as const;
 * ```
 */
export function pref<T>(key: string, defaultValue: T): PreferenceDef<T> {
  return { key, defaultValue };
}

export interface PreferenceDef<T> {
  /** Storage key for the preference. */
  readonly key: string;
  /** Default value when no stored value exists. */
  readonly defaultValue: T;
}
