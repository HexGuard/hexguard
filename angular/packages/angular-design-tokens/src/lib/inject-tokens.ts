import {
  computed,
  effect,
  type Signal,
  inject,
  DestroyRef,
} from '@angular/core';
import type { TokenRegistry } from './define-tokens';
import { syncTokensToRoot, unsyncTokensFromRoot } from './css-sync';

/**
 * Signal-based access to a token registry.
 *
 * Returned by `injectTokens()`.
 *
 * @example
 * ```ts
 * const access = injectTokens(tokens);
 * const primary = access.get('color.primary.500'); // Signal<string | undefined>
 * ```
 */
export interface TokenAccess {
  /**
   * Get a reactive signal for a single token path.
   * Returns `undefined` if the path does not exist.
   */
  get(path: string): Signal<string | undefined>;

  /** All flat token entries as a signal. */
  readonly all: Signal<ReadonlyMap<string, string>>;
}

class TokenAccessImpl implements TokenAccess {
  private readonly registry: TokenRegistry;
  private readonly cache = new Map<string, Signal<string | undefined>>();

  readonly all: Signal<ReadonlyMap<string, string>>;

  constructor(registry: TokenRegistry) {
    this.registry = registry;

    // The all signal is stable — token definitions are static after defineTokens()
    this.all = computed(() => registry.entries);
  }

  get(path: string): Signal<string | undefined> {
    const cached = this.cache.get(path);
    if (cached) return cached;

    const value = this.registry.get(path);
    const sig = computed(() => value);
    this.cache.set(path, sig);
    return sig;
  }
}

/**
 * Inject signal-based access to a token registry.
 *
 * Optionally auto-syncs CSS custom properties to `:root` via an effect
 * (cleaned up on component/service destroy).
 *
 * @param registry - A token registry from `defineTokens()`.
 * @param options - Optional configuration.
 * @returns `TokenAccess` with signal-based `get()` and `all`.
 *
 * @example
 * ```ts
 * @Component({ ... })
 * class MyComponent {
 *   readonly tokens = injectTokens(myTokens, { syncCss: true });
 *   readonly primary = this.tokens.get('color.primary.500');
 * }
 * // Template: {{ primary() }}
 * ```
 */
export function injectTokens(
  registry: TokenRegistry,
  options?: { syncCss?: boolean },
): TokenAccess {
  const access = new TokenAccessImpl(registry);

  if (options?.syncCss) {
    const destroyRef = inject(DestroyRef);

    // Initial sync
    syncTokensToRoot(registry);

    // Cleanup on destroy
    destroyRef.onDestroy(() => {
      unsyncTokensFromRoot(registry);
    });
  }

  return access;
}
