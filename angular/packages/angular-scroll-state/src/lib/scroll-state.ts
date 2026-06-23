import { DestroyRef, inject, signal } from '@angular/core';
import type { ScrollStateHandle, ScrollStateOptions } from './types';

const SCROLL_MEMORY = new Map<string, number>();

export function injectScrollState(options?: ScrollStateOptions): ScrollStateHandle {
  const destroyRef = inject(DestroyRef);
  const debounceMs = options?.debounceMs ?? 100;
  const scrollY = signal(0);
  let rafId: number | null = null;
  let lastSave = 0;

  function getScrollTarget(): Element | Window {
    return options?.scrollContainer?.nativeElement ?? window;
  }

  function onScroll(): void {
    const target = getScrollTarget();
    const y = target instanceof Window ? target.scrollY : (target as Element).scrollTop;
    scrollY.set(y);
  }

  function startListening(): void {
    const target = getScrollTarget();
    target.addEventListener('scroll', handleScrollEvent, { passive: true });
    destroyRef.onDestroy(() => {
      target.removeEventListener('scroll', handleScrollEvent);
    });
  }

  function handleScrollEvent(): void {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const now = Date.now();
      if (now - lastSave >= debounceMs) {
        lastSave = now;
        onScroll();
      }
    });
  }

  startListening();

  function save(key: string): void {
    SCROLL_MEMORY.set(key, scrollY());
  }

  function restore(key: string): number | null {
    return SCROLL_MEMORY.get(key) ?? null;
  }

  return {
    scrollY: scrollY.asReadonly(),
    save,
    restore,
  };
}
