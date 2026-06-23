import { Observable } from 'rxjs';

/**
 * Creates an observable that emits the current vertical scroll position
 * on every `scroll` event, throttled via `requestAnimationFrame`.
 *
 * @param target - Scroll container. Defaults to `window`.
 * @returns A cold `Observable<number>` — emits the initial position on
 *   subscribe, then emits new values on scroll (RAF-throttled).
 *
 * @example
 * ```ts
 * import { fromScrollPosition } from '@hexguard/angular-scroll-state';
 *
 * fromScrollPosition().subscribe(y => console.log('Scrolled to:', y));
 * ```
 */
export function fromScrollPosition(target?: HTMLElement | Window): Observable<number> {
  return new Observable<number>((subscriber) => {
    const scrollTarget = target ?? window;
    let rafId: number | null = null;

    const onScroll = (): void => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        subscriber.next(
          scrollTarget instanceof Window ? scrollTarget.scrollY : scrollTarget.scrollTop,
        );
      });
    };

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    // Emit initial position
    subscriber.next(scrollTarget instanceof Window ? scrollTarget.scrollY : scrollTarget.scrollTop);

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
}

/**
 * Creates an observable that emits (void) each time an infinite-scroll
 * sentinel element enters the viewport, based on `IntersectionObserver`.
 *
 * Each emission locks the trigger until a new subscription is created.
 * Use with `switchMap` or `exhaustMap` to load the next page and
 * re-enable the sentinel.
 *
 * @param sentinel - The DOM element observed as the scroll sentinel.
 * @param rootMargin - IntersectionObserver rootMargin. Default `'200px'`.
 * @param threshold - IntersectionObserver threshold. Default `0`.
 * @returns A cold `Observable<void>` emitting once per intersection.
 *
 * @example
 * ```ts
 * import { fromInfiniteScroll } from '@hexguard/angular-scroll-state';
 *
 * fromInfiniteScroll(sentinelEl).subscribe(() => loadMore());
 * ```
 */
export function fromInfiniteScroll(
  sentinel: HTMLElement,
  rootMargin: string = '200px',
  threshold: number = 0,
): Observable<void> {
  return new Observable<void>((subscriber) => {
    if (typeof IntersectionObserver === 'undefined') {
      subscriber.complete();
      return;
    }

    let canTrigger = true;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && canTrigger) {
          canTrigger = false;
          subscriber.next();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  });
}

/**
 * Creates an observable that emits the ID of the most-visible section
 * based on `IntersectionObserver` tracking.
 *
 * Useful for table-of-contents highlighting.
 *
 * @param sectionIds - Ordered list of section element IDs to track.
 * @param rootMargin - IntersectionObserver rootMargin.
 *   Default `'-80px 0px -60% 0px'`.
 * @param threshold - IntersectionObserver thresholds. Default `[0, 0.5, 1]`.
 * @returns A cold `Observable<string | null>` emitting the most-visible
 *   section ID on every scroll position change.
 *
 * @example
 * ```ts
 * import { fromScrollSpy } from '@hexguard/angular-scroll-state';
 *
 * fromScrollSpy(['intro', 'api', 'pricing']).subscribe(sectionId => {
 *   console.log('Active section:', sectionId);
 * });
 * ```
 */
export function fromScrollSpy(
  sectionIds: readonly string[],
  rootMargin: string = '-80px 0px -60% 0px',
  threshold: readonly number[] = [0, 0.5, 1],
): Observable<string | null> {
  return new Observable<string | null>((subscriber) => {
    if (typeof IntersectionObserver === 'undefined') {
      subscriber.complete();
      return;
    }

    const visibilityMap = new Map<string, number>();

    const observer = new IntersectionObserver(
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

        subscriber.next(maxId);
      },
      { rootMargin, threshold: threshold as number[] },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
}
