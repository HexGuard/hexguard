import { Observable, Subject } from 'rxjs';
import type { Notification, NotificationType } from './types';

/**
 * Creates a standalone notification queue as an observable stream,
 * without Angular DI. Useful for non-Angular contexts or when you
 * want to pipe notifications through RxJS operators.
 *
 * @returns An object with `notifications$` observable and typed
 *   convenience methods (`success`, `error`, `info`, `warning`).
 *
 * @example
 * ```ts
 * import { createNotificationStream } from '@hexguard/angular-notifications';
 * import { filter } from 'rxjs/operators';
 *
 * const notifier = createNotificationStream();
 * notifier.notifications$.pipe(
 *   filter(n => n.type === 'error')
 * ).subscribe(n => showToast(n));
 * notifier.error('Request failed');
 * ```
 */
export function createNotificationStream() {
  const subject = new Subject<Notification>();

  let nextId = 0;

  function emit(
    message: string,
    type: NotificationType = 'info',
    options?: { duration?: number; title?: string },
  ): void {
    const id = `notif-obs-${++nextId}`;
    subject.next({
      id,
      type,
      message,
      duration: options?.duration ?? 5000,
      timestamp: Date.now(),
      ...(options?.title ? { title: options.title } : {}),
    });
  }

  return {
    /** Subscribe to receive all notifications. */
    notifications$: subject.asObservable(),
    success: (message: string, options?: { duration?: number; title?: string }) =>
      emit(message, 'success', options),
    error: (message: string, options?: { duration?: number; title?: string }) =>
      emit(message, 'error', options),
    info: (message: string, options?: { duration?: number; title?: string }) =>
      emit(message, 'info', options),
    warning: (message: string, options?: { duration?: number; title?: string }) =>
      emit(message, 'warning', options),
  };
}
