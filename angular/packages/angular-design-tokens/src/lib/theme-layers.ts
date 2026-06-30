import type { TokenRegistry } from './define-tokens';
import { syncTokensToRoot } from './css-sync';

/**
 * A theme-specific token override layer.
 *
 * Maps token paths to override values for a specific theme (e.g. `"dark"`, `"high-contrast"`).
 *
 * @example
 * ```ts
 * const darkLayer = new TokenThemeLayer({
 *   'color.surface': '#1a1a1a',
 *   'color.text': '#f0f0f0',
 * });
 *
 * // Apply the layer to a registry, producing a merged registry
 * const darkTokens = darkLayer.applyTo(lightTokens);
 * ```
 */
export class TokenThemeLayer {
  private readonly overrides: ReadonlyMap<string, string>;

  /**
   * @param overrides - A record of token path → override value.
   */
  constructor(overrides: Record<string, string>) {
    this.overrides = new Map(Object.entries(overrides));
  }

  /**
   * Create a new token registry with this layer's overrides applied on top
   * of the base registry.
   */
  applyTo(base: TokenRegistry): TokenRegistry {
    const entries = new Map<string, string>(base.entries);
    for (const [path, value] of this.overrides) {
      entries.set(path, value);
    }
    return {
      entries,
      prefix: base.prefix,
      size: entries.size,
      get: (path: string) => entries.get(path),
      validate: () => [], // Assume overrides are already validated
    };
  }

  /**
   * Apply this layer directly to the DOM by syncing the overrides
   * as CSS custom properties (without removing non-overridden tokens).
   */
  syncToDom(): void {
    if (typeof document === 'undefined') return;
    const style = document.documentElement.style;
    // Use a generic prefix — consumer controls the naming
    for (const [path, value] of this.overrides) {
      const propName = `--hexguard-${path.replace(/\./g, '-')}`;
      style.setProperty(propName, value);
    }
  }

  /** The override entries in this layer. */
  get entries(): ReadonlyMap<string, string> {
    return this.overrides;
  }

  /** Number of overrides in this layer. */
  get size(): number {
    return this.overrides.size;
  }
}
