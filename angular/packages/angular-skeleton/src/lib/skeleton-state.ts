import { computed, effect, signal, type Signal } from '@angular/core';

// ── Types ──────────────────────────────────────────────────

/** Skeleton shape variants. */
export type SkeletonVariant =
  | 'text'
  | 'text-short'
  | 'circle'
  | 'avatar'
  | 'card'
  | 'table-row'
  | 'table-header'
  | 'custom';

/** Configuration for `skeletonState()`. */
export interface SkeletonOptions {
  /** Default shape variant. Default: `'text'`. */
  readonly variant?: SkeletonVariant;
  /** Number of skeleton items. Default: `1`. */
  readonly count?: number;
  /** Enable shimmer animation. Default: `true`. */
  readonly shimmer?: boolean;
  /** Shimmer animation duration in ms. Default: `1500`. */
  readonly shimmerDurationMs?: number;
}

/** Headless skeleton state returned by `skeletonState()`. */
export interface SkeletonState {
  /** Whether the skeleton is currently active (visible). */
  readonly isActive: Signal<boolean>;
  /** Current shape variant. */
  readonly variant: Signal<SkeletonVariant>;
  /** Number of skeleton items. */
  readonly count: Signal<number>;
  /** Shimmer state: active flag and duration. */
  readonly shimmer: Signal<{ active: boolean; durationMs: number }>;

  /** Show the skeleton. */
  show(): void;
  /** Hide the skeleton. */
  hide(): void;
  /** Set the variant. */
  setVariant(v: SkeletonVariant): void;
  /** Set the item count. */
  setCount(n: number): void;
}

// ── Implementation ─────────────────────────────────────────

/**
 * Create headless skeleton state with configurable shapes, count,
 * and shimmer animation.
 *
 * @param options - Optional configuration.
 * @returns `SkeletonState` with reactive signals.
 *
 * @example
 * ```ts
 * const skeleton = skeletonState({ variant: 'card', count: 3 });
 * // Template: @if (skeleton.isActive()) { ...render skeleton... }
 * ```
 */
export function skeletonState(options?: SkeletonOptions): SkeletonState {
  const _isActive = signal(false);
  const _variant = signal<SkeletonVariant>(options?.variant ?? 'text');
  const _count = signal(options?.count ?? 1);
  const _shimmerActive = signal(options?.shimmer ?? true);
  const _shimmerDuration = signal(options?.shimmerDurationMs ?? 1500);

  const shimmer = computed(() => ({
    active: _shimmerActive(),
    durationMs: _shimmerDuration(),
  }));

  return {
    isActive: _isActive.asReadonly(),
    variant: _variant.asReadonly(),
    count: _count.asReadonly(),
    shimmer,

    show: () => _isActive.set(true),
    hide: () => _isActive.set(false),
    setVariant: (v) => _variant.set(v),
    setCount: (n) => _count.set(Math.max(0, n)),
  };
}

/**
 * Bind a skeleton's `isActive` signal to an external loading signal.
 *
 * When `loading()` is true, the skeleton shows; when false, it hides.
 *
 * @param skeleton - The skeleton state to bind.
 * @param loading - An external signal indicating loading state.
 * @returns The same skeleton state (for chaining).
 *
 * @example
 * ```ts
 * const data = injectAsyncValue(...);
 * const skeleton = skeletonState({ variant: 'table-row', count: 5 });
 * bindLoading(skeleton, data.isLoading);
 * // Now skeleton.isActive() === data.isLoading()
 * ```
 */
export function bindLoading(skeleton: SkeletonState, loading: Signal<boolean>): SkeletonState {
  effect(() => {
    if (loading()) {
      skeleton.show();
    } else {
      skeleton.hide();
    }
  });

  return skeleton;
}
