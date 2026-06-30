import {
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  type Signal,
} from '@angular/core';

import {
  type VisibilityOptions,
  type VisibilityState,
} from './types';
import { VisibilityService } from './visibility-service';

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
  const service = inject(VisibilityService);
  service.startIdleTracking(options);

  return {
    isVisible: service.isVisible.asReadonly(),
    isIdle: service.isIdle,
    idleDuration: service.idleDuration.asReadonly(),
    lastActivity: service.lastActivity.asReadonly(),
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
