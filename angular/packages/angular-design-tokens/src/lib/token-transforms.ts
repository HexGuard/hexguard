import { computed, inject, type Signal, ElementRef, InjectionToken, effect, DestroyRef } from '@angular/core';
import type { TokenRegistry } from './define-tokens';
import { syncTokensToRoot, unsyncTokensFromRoot, tokenPathToCssProp } from './css-sync';

/**
 * Transform a token value through a function, returning a reactive signal.
 *
 * @param registry - The token registry.
 * @param path - Token path e.g. `"spacing.md"`.
 * @param transform - Function that receives the token value and returns a transformed value.
 * @returns A signal with the transformed value, or `undefined` if the path doesn't exist.
 *
 * @example
 * ```ts
 * const doubleSpacing = transformToken(tokens, 'spacing.md', (v) => `calc(${v} * 2)`);
 * // doubleSpacing() → 'calc(1rem * 2)'
 * ```
 */
export function transformToken<T = string>(
  registry: TokenRegistry,
  path: string,
  transform: (value: string) => T,
): Signal<T | undefined> {
  const raw = registry.get(path);
  if (raw === undefined) {
    return computed(() => undefined);
  }
  const result = transform(raw);
  return computed(() => result);
}

// ── Scoped tokens ──────────────────────────────────────────

const SCOPED_TOKEN_TARGET = new InjectionToken<ElementRef<HTMLElement>>('SCOPED_TOKEN_TARGET');

/**
 * Inject token access that syncs CSS custom properties to a specific element
 * (e.g. the component's host via `:host`), not the global `:root`.
 *
 * Scoped tokens are isolated — they don't leak to the rest of the page.
 * Useful for component-level theming, portal overlays, or shadow DOM.
 *
 * @param registry - The token registry.
 * @param target - The element to sync CSS custom properties to.
 * @returns The `TokenRegistry` (for chaining with `injectTokens`).
 *
 * @example
 * ```ts
 * @Component({ ... })
 * class CardComponent {
 *   private readonly host = inject(ElementRef<HTMLElement>);
 *   readonly tokens = injectScopedTokens(cardTokens, this.host);
 * }
 * ```
 */
export function injectScopedTokens(
  registry: TokenRegistry,
  target: ElementRef<HTMLElement>,
): TokenRegistry {
  const destroyRef = inject(DestroyRef);

  syncTokensToRoot(registry, { target: target.nativeElement });

  destroyRef.onDestroy(() => {
    unsyncTokensFromRoot(registry, { target: target.nativeElement });
  });

  return registry;
}
