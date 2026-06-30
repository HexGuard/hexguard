import { Injectable, signal } from '@angular/core';
import type { ScrollStateOptions } from './types';

const SCROLL_MEMORY = new Map<string, number>();

/**
 * Singleton service managing scroll position tracking and memory.
 *
 * All `injectScrollState()` calls share the same scroll listener and
 * `SCROLL_MEMORY` map, avoiding duplicate `scroll` event handlers.
 */
@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private readonly _scrollY = signal(0);
  private _rafId: number | null = null;
  private _lastSave = 0;
  private _debounceMs = 100;
  private _scrollTarget: Element | Window = typeof window !== 'undefined' ? window : ({} as Window);
  private _initialized = false;

  /** The current scroll position signal. */
  readonly scrollY = this._scrollY.asReadonly();

  /** Initialize the service with options. Safe to call multiple times. */
  init(options?: ScrollStateOptions): void {
    if (this._initialized) return;
    this._initialized = true;

    this._debounceMs = options?.debounceMs ?? 100;
    this._scrollTarget = options?.scrollContainer?.nativeElement ?? window;

    this._scrollTarget.addEventListener('scroll', this._handleScrollEvent, { passive: true });
  }

  /** Save the current scroll position under a key. */
  save(key: string): void {
    SCROLL_MEMORY.set(key, this._scrollY());
  }

  /** Restore a saved scroll position by key, or null. */
  restore(key: string): number | null {
    return SCROLL_MEMORY.get(key) ?? null;
  }

  /** Set scroll position directly (used for restore). */
  setScrollY(value: number): void {
    this._scrollY.set(value);
  }

  private _handleScrollEvent = (): void => {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      const now = Date.now();
      if (now - this._lastSave >= this._debounceMs) {
        this._lastSave = now;
        this._updateScrollY();
      }
    });
  };

  private _updateScrollY(): void {
    const y =
      this._scrollTarget instanceof Window
        ? this._scrollTarget.scrollY
        : (this._scrollTarget as Element).scrollTop;
    this._scrollY.set(y);
  }
}
