import { DestroyRef, ElementRef, inject, signal, type Signal } from '@angular/core';

import type { ClickOutsideHandle, ClickOutsideOptions } from './types';

/**
 * Injects a click-outside detector that emits a signal when a click occurs
 * outside the referenced element.
 *
 * @param elementRef - A signal returning an `ElementRef` or `undefined`.
 * @param options - Optional configuration for enabled state and exclusions.
 *
 * @example
 * ```ts
 * const panel = viewChild.required<ElementRef>('panel');
 * const outside = injectClickOutside(panel, {
 *   enabled: isOpen,
 *   exclude: ['.ignore-clicks'],
 * });
 * effect(() => { if (outside.clickOutside()) close(); });
 * ```
 */
export function injectClickOutside(
  elementRef: Signal<ElementRef<HTMLElement> | undefined>,
  options?: ClickOutsideOptions,
): ClickOutsideHandle {
  const destroyRef = inject(DestroyRef);
  const enabled = options?.enabled ?? signal(true);
  const exclude = options?.exclude ?? [];

  const clickOutside = signal<PointerEvent | null>(null);

  const handler = (event: PointerEvent): void => {
    if (!enabled()) {
      return;
    }

    const el = elementRef();
    if (!el) {
      return;
    }

    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    // Check if the click target is outside the element
    if (el.nativeElement.contains(target)) {
      return;
    }

    // Check if the click target matches any exclude selector
    for (const selector of exclude) {
      if (target instanceof Element && target.closest(selector)) {
        return;
      }
    }

    clickOutside.set(event);
  };

  // Use capture phase to catch events before they reach the target
  document.addEventListener('pointerdown', handler, { capture: true });

  destroyRef.onDestroy(() => {
    document.removeEventListener('pointerdown', handler, { capture: true });
  });

  return { clickOutside: clickOutside.asReadonly() };
}
