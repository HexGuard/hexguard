import { computed, DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  DEFAULT_ACTIVITY_EVENTS,
  DEFAULT_IDLE_TIMEOUT_MS,
  IDLE_DURATION_UPDATE_MS,
  type VisibilityOptions,
  type VisibilityState,
} from './types';

/**
 * Singleton service managing document-level visibility and idle detection.
 *
 * All `injectVisibility()` calls share the same `isVisible`, `isIdle`,
 * `idleDuration`, and `lastActivity` signals, avoiding duplicate
 * `visibilitychange` listeners, activity event handlers, and interval timers.
 */
@Injectable({ providedIn: 'root' })
export class VisibilityService {
  readonly isVisible = signal<boolean>(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  );
  readonly lastActivity = signal<number>(Date.now());
  readonly idleDuration = signal<number>(0);

  readonly isIdle = computed<boolean>(() => {
    if (!this._idleTrackingEnabled) return false;
    return this.idleDuration() >= this._idleTimeoutMs;
  });

  private _idleTrackingEnabled = true;
  private _idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS;
  private _idleTimerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof document === 'undefined') return;

    // ── Tab visibility ──
    const visibilityHandler = (): void => {
      this.isVisible.set(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', visibilityHandler);
    destroyRef.onDestroy(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    });
  }

  /**
   * Starts idle tracking with the given options.
   * Called automatically by `injectVisibility()`. Safe to call multiple times
   * — only the first call with `idleTimeoutMs > 0` starts the interval.
   */
  startIdleTracking(options?: VisibilityOptions): void {
    const idleTimeoutMs = options?.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;
    const activityEvents = options?.activityEvents ?? DEFAULT_ACTIVITY_EVENTS;

    this._idleTrackingEnabled = idleTimeoutMs > 0;
    this._idleTimeoutMs = idleTimeoutMs;

    if (!this._idleTrackingEnabled || this._idleTimerId !== null || typeof document === 'undefined') {
      return;
    }

    const activityHandler = (): void => {
      this.lastActivity.set(Date.now());
      this.idleDuration.set(0);
    };

    for (const eventName of activityEvents) {
      document.addEventListener(eventName, activityHandler, { passive: true });
    }

    this._idleTimerId = setInterval(() => {
      const elapsed = Date.now() - this.lastActivity();
      this.idleDuration.set(elapsed);
    }, IDLE_DURATION_UPDATE_MS);

    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      for (const eventName of activityEvents) {
        document.removeEventListener(eventName, activityHandler);
      }
      if (this._idleTimerId !== null) {
        clearInterval(this._idleTimerId);
        this._idleTimerId = null;
      }
    });
  }
}
