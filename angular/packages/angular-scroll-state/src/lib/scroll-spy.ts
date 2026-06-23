import { DestroyRef, inject, signal } from '@angular/core';
import type { ScrollSpyHandle, ScrollSpyOptions } from './types';

export function inScrollSpy(
  sectionIds: readonly string[],
  options?: ScrollSpyOptions,
): ScrollSpyHandle {
  const destroyRef = inject(DestroyRef);
  const rootMargin = options?.rootMargin ?? '-80px 0px -60% 0px';
  const threshold = options?.threshold ?? [0, 0.5, 1];
  const activeSection = signal<string | null>(null);

  const visibilityMap = new Map<string, number>();

  let observer: IntersectionObserver | null = null;

  function setupObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        }

        let maxRatio = 0;
        let maxId: string | null = null;
        for (const id of sectionIds) {
          const ratio = visibilityMap.get(id) ?? 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = id;
          }
        }
        activeSection.set(maxId);
      },
      { rootMargin, threshold: threshold as number[] },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }

    destroyRef.onDestroy(() => {
      observer?.disconnect();
      observer = null;
    });
  }

  setupObserver();

  return {
    activeSection: activeSection.asReadonly(),
  };
}
