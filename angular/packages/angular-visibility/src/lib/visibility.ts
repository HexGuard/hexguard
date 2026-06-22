import {
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  type Signal,
} from '@angular/core';

import {
  DEFAULT_ACTIVITY_EVENTS,
  DEFAULT_IDLE_TIMEOUT_MS,
  IDLE_DURATION_UPDATE_MS,
  type VisibilityOptions,
  type VisibilityState,
} from './types';

/**
 * Injects a document-level visibility and idle-detection handle.
 *
 * Tracks tab visibility via `document.visibilityState` and user activity
 * via configurable DOM events, exposing reactive signals for `isVisible`,
 * `isIdle`, `idleDuration`, and `lastActivity`.
 *
 * @param options - Optional configuration for idle timeout and activity events.
 *
 * @example
 * ```ts
 * const visibility = injectVisibility();
 *
 * effect(() => {
 *   if (!visibility.isVisible()) {
 *     pausePolling();
 *   }
 * });
 *
 * effect(() => {
 *   if (visibility.isIdle()) {
 *     showIdlePrompt();
 *   }
 * });
 * ```
 */
export function injectVisibility(options?: VisibilityOptions): VisibilityState {
  const destroyRef = inject(DestroyRef);
  const idleTimeoutMs = options?.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;
  const activityEvents = options?.activityEvents ?? DEFAULT_ACTIVITY_EVENTS;
  const idleTrackingEnabled = idleTimeoutMs > 0;

  // ── Tab visibility ─────────────────────────────────────────────

  const isVisible = signal<boolean>(document.visibilityState === 'visible');

  const visibilityHandler = (): void => {
    isVisible.set(document.visibilityState === 'visible');
  };

  document.addEventListener('visibilitychange', visibilityHandler);
  destroyRef.onDestroy(() => {
    document.removeEventListener('visibilitychange', visibilityHandler);
  });

  // ── Idle detection ─────────────────────────────────────────────

  const lastActivity = signal<number>(Date.now());
  const idleDuration = signal<number>(0);
  let idleTimerId: ReturnType<typeof setInterval> | null = null;

  if (idleTrackingEnabled) {
    const activityHandler = (): void => {
      lastActivity.set(Date.now());
      idleDuration.set(0);
    };

    for (const eventName of activityEvents) {
      document.addEventListener(eventName, activityHandler, { passive: true });
    }

    // Periodic update of idle duration while user is idle
    idleTimerId = setInterval(() => {
      const elapsed = Date.now() - lastActivity();
      idleDuration.set(elapsed);
    }, IDLE_DURATION_UPDATE_MS);

    destroyRef.onDestroy(() => {
      for (const eventName of activityEvents) {
        document.removeEventListener(eventName, activityHandler);
      }
      if (idleTimerId !== null) {
        clearInterval(idleTimerId);
      }
    });
  }

  const isIdle = computed<boolean>(() => {
    if (!idleTrackingEnabled) {
      return false;
    }
    return idleDuration() >= idleTimeoutMs;
  });

  return {
    isVisible: isVisible.asReadonly(),
    isIdle,
    idleDuration: idleDuration.asReadonly(),
    lastActivity: lastActivity.asReadonly(),
  };
}

/**
 * Returns a signal that tracks whether a DOM element is currently intersecting
 * the viewport, using `IntersectionObserver`.
 *
 * The observer is created and started when the `elementRef` signal produces a
 * non-`undefined` value, and disconnected on destroy.
 *
 * @param elementRef - A signal returning an `ElementRef` or `undefined`.
 *
 * @example
 * ```ts
 * const target = viewChild.required<ElementRef>('target');
 * const isVisible = inElementVisibility(target);
 *
 * effect(() => {
 *   console.log('Element visible:', isVisible());
 * });
 * ```
 */
export function inElementVisibility(
  elementRef: Signal<ElementRef<HTMLElement> | undefined>,
): Signal<boolean> {
  const isIntersecting = signal<boolean>(false);
  let observer: IntersectionObserver | null = null;

  const cleanup = (): void => {
    if (observer !== null) {
      observer.disconnect();
      observer = null;
    }
  };

  const initEffect = effect(() => {
    const el = elementRef();
    cleanup();

    if (el === undefined) {
      isIntersecting.set(false);
      return;
    }

    observer = new IntersectionObserver((entries) => {
      isIntersecting.set(entries[0]?.isIntersecting ?? false);
    });

    observer.observe(el.nativeElement);
  });

  // We need to clean up the effect and observer. Use DestroyRef via injection
  // context — but this function may be called outside an injection context
  // (e.g., during component construction where effect() still works via the
  // active consumer context). We'll handle cleanup by returning a signal that
  // the consumer's DestroyRef can manage, but we need a DestroyRef.
  //
  // Approach: use the ambient injector from the effect's context.
  // Since effect() and signal() both work in the same injection context as the
  // caller, we can inject DestroyRef here.

  // Inject and clean up
  try {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      cleanup();
      initEffect.destroy();
    });
  } catch {
    // If called outside injection context, the consumer is responsible for
    // lifecycle. We'll still connect the observer via the effect.
  }

  return isIntersecting.asReadonly();
}
