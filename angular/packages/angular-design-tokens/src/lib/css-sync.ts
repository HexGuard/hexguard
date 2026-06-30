import type { TokenRegistry } from './define-tokens';

/** Options for `syncTokensToRoot()`. */
export interface SyncOptions {
  /** Target element (defaults to `document.documentElement`). */
  target?: HTMLElement;
}

const CSS_PROP_PREFIX = '--';

/**
 * Write all tokens from a registry as CSS custom properties on the target element.
 *
 * Property names follow the pattern `--{prefix}-{path}` with dots replaced by dashes.
 * For example, token `color.primary.500` becomes `--hexguard-color-primary-500`.
 *
 * SSR-safe — no-ops if `document` is unavailable.
 *
 * @example
 * ```ts
 * const tokens = defineTokens({ color: { primary: { 500: '#3b82f6' } } });
 * syncTokensToRoot(tokens);
 * // Sets: --hexguard-color-primary-500: #3b82f6 on <html>
 * ```
 */
export function syncTokensToRoot(
  registry: TokenRegistry,
  options?: SyncOptions,
): void {
  if (typeof document === 'undefined') return;

  const target = options?.target ?? document.documentElement;
  const style = target.style;

  for (const [path, value] of registry.entries) {
    const propName = tokenPathToCssProp(registry.prefix, path);
    style.setProperty(propName, value);
  }
}

/**
 * Remove all CSS custom properties written by this registry.
 *
 * @example
 * ```ts
 * unsyncTokensFromRoot(registry);
 * ```
 */
export function unsyncTokensFromRoot(
  registry: TokenRegistry,
  options?: SyncOptions,
): void {
  if (typeof document === 'undefined') return;

  const target = options?.target ?? document.documentElement;
  const style = target.style;

  for (const path of registry.entries.keys()) {
    const propName = tokenPathToCssProp(registry.prefix, path);
    style.removeProperty(propName);
  }
}

/** Convert a token path + prefix to a CSS custom property name. */
export function tokenPathToCssProp(prefix: string, path: string): string {
  const dashed = path.replace(/\./g, '-');
  return `${CSS_PROP_PREFIX}${prefix}-${dashed}`;
}
