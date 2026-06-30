import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  type Provider,
  signal,
  type Signal,
} from '@angular/core';

// ── Types ──────────────────────────────────────────────────

/** A single icon definition. */
export interface IconDefinition {
  /** Raw SVG content (inner markup, no `<svg>` wrapper). */
  readonly svgContent: string;
  /** ViewBox attribute e.g. `"0 0 24 24"`. */
  readonly viewBox: string;
  /** Alternative names that resolve to this icon. */
  readonly aliases?: readonly string[];
  /** Search tags for icon discovery. */
  readonly tags?: readonly string[];
}

/** Configuration for `provideIcons()`. */
export interface IconConfig {
  /** Map of icon name → definition. */
  readonly icons: Record<string, IconDefinition>;
  /** Default size for rendered icons (CSS value). */
  readonly defaultSize?: string;
}

/** Data needed to render an icon. */
export interface IconRenderData {
  readonly svgContent: string;
  readonly viewBox: string;
  readonly size: string;
  readonly color: string;
}

/** The icon registry interface returned by `injectIcons()`. */
export interface IconRegistry {
  /** Get a reactive signal for an icon's render data, or null if not found. */
  get(name: string): Signal<IconRenderData | null>;
  /** Check if an icon exists in the registry. */
  has(name: string): boolean;
  /** All registered icon names. */
  names(): string[];
}

// ── DI Token ───────────────────────────────────────────────

const ICON_CONFIG = new InjectionToken<IconConfig>('ICON_CONFIG');

// ── Service ────────────────────────────────────────────────

@Injectable()
class IconRegistryService implements IconRegistry {
  private readonly config = inject(ICON_CONFIG);
  private readonly _defaultSize: string;
  private readonly nameMap = new Map<string, string>(); // alias → canonical name
  private readonly cache = new Map<string, Signal<IconRenderData | null>>();

  constructor() {
    this._defaultSize = this.config.defaultSize ?? '1.5rem';

    // Build alias→canonical map
    for (const [name, def] of Object.entries(this.config.icons)) {
      this.nameMap.set(name, name);
      if (def.aliases) {
        for (const alias of def.aliases) {
          this.nameMap.set(alias, name);
        }
      }
    }
  }

  get(name: string): Signal<IconRenderData | null> {
    const canonical = this.nameMap.get(name);
    if (!canonical) {
      // Return a stable null signal for unknown icons
      return computed(() => null);
    }

    const cached = this.cache.get(canonical);
    if (cached) return cached;

    const def = this.config.icons[canonical]!;
    const data: IconRenderData = {
      svgContent: def.svgContent,
      viewBox: def.viewBox,
      size: this._defaultSize,
      color: 'currentColor',
    };

    const sig = computed(() => data);
    this.cache.set(canonical, sig);
    return sig;
  }

  has(name: string): boolean {
    return this.nameMap.has(name);
  }

  names(): string[] {
    return Object.keys(this.config.icons);
  }
}

// ── Public API ─────────────────────────────────────────────

/**
 * Provide icon definitions to the registry.
 *
 * @param config - Icon configuration with name→definition map.
 * @returns Angular providers array.
 *
 * @example
 * ```ts
 * @Component({
 *   providers: [provideIcons({
 *     icons: {
 *       home: { svgContent: '<path d="..." />', viewBox: '0 0 24 24' },
 *       settings: { svgContent: '<path d="..." />', viewBox: '0 0 24 24', aliases: ['gear'] },
 *     },
 *   })],
 * })
 * class MyComponent {}
 * ```
 */
export function provideIcons(config: IconConfig): Provider[] {
  return [{ provide: ICON_CONFIG, useValue: config }, IconRegistryService];
}

/**
 * Inject the icon registry for the current injector scope.
 *
 * @returns `IconRegistry` with `get()`, `has()`, and `names()`.
 *
 * @example
 * ```ts
 * const icons = injectIcons();
 * const homeIcon = icons.get('home'); // Signal<IconRenderData | null>
 * // Template: <svg [attr.viewBox]="homeIcon()?.viewBox" ...>
 * ```
 */
export function injectIcons(): IconRegistry {
  return inject(IconRegistryService);
}
