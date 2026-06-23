import { type ElementRef, DestroyRef, effect, inject, signal } from '@angular/core';
import type { InfiniteScrollHandle, InfiniteScrollOptions } from './types';

export function inInfiniteScroll(
  sentinel: ElementRef,
  options?: InfiniteScrollOptions,
): InfiniteScrollHandle {
  const destroyRef = inject(DestroyRef);
  const rootMargin = options?.rootMargin ?? '200px';
  const threshold = options?.threshold ?? 0;
  const isTriggered = signal(false);
  const isLoading = signal(false);
  const isExhausted = signal(false);

  let observer: IntersectionObserver | null = null;

  function setupObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isExhausted() && !isLoading()) {
          isTriggered.set(true);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(sentinel.nativeElement);

    destroyRef.onDestroy(() => {
      observer?.disconnect();
      observer = null;
    });
  }

  // Delay observer setup to after the view is rendered
  effect(() => {
    if (sentinel.nativeElement && !observer) {
      setupObserver();
    }
  });

  return {
    isTriggered: isTriggered.asReadonly(),
    isLoading: isLoading.asReadonly(),
    isExhausted: isExhausted.asReadonly(),
  };
}
