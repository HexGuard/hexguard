import type { ElementRef } from '@angular/core';

export interface ScrollToOptions {
  /** Vertical pixel position to scroll to. */
  y?: number;
  /** Element to scroll into view. */
  element?: ElementRef;
  /** Scroll behavior — default 'smooth'. */
  behavior?: 'auto' | 'smooth';
}

export function scrollTo(options: ScrollToOptions): void {
  const behavior = options.behavior ?? 'smooth';

  if (options.element) {
    options.element.nativeElement.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  const y = options.y ?? 0;
  window.scrollTo({ top: y, behavior });
}
