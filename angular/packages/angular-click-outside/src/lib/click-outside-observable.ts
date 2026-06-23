import { Observable } from 'rxjs';
import type { ClickOutsideOptions } from './types';

/**
 * Creates an observable that emits `PointerEvent` each time a click
 * outside the referenced element is detected.
 *
 * Uses capture-phase `pointerdown` listener with automatic cleanup
 * on unsubscribe.
 *
 * @param element - The DOM element to detect outside clicks for.
 * @param options - Optional configuration (exclude selectors).
 * @returns A cold `Observable<PointerEvent>` — each subscriber gets its
 *   own capture-phase listener, torn down on unsubscribe.
 *
 * @example
 * ```ts
 * import { fromClickOutsideEvent } from '@hexguard/angular-click-outside';
 *
 * const panel = document.getElementById('dropdown')!;
 * const sub = fromClickOutsideEvent(panel).subscribe(() => close());
 * // Later: sub.unsubscribe()
 * ```
 */
export function fromClickOutsideEvent(
  element: HTMLElement,
  options?: ClickOutsideOptions,
): Observable<PointerEvent> {
  const exclude = options?.exclude ?? [];

  return new Observable<PointerEvent>((subscriber) => {
    const handler = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      if (!target) return;
      if (element.contains(target)) return;
      for (const selector of exclude) {
        if (target instanceof Element && target.closest(selector)) return;
      }
      subscriber.next(event);
    };

    document.addEventListener('pointerdown', handler, { capture: true });

    return () => {
      document.removeEventListener('pointerdown', handler, { capture: true });
    };
  });
}
