import { Observable, Subject, of } from 'rxjs';
import { first } from 'rxjs/operators';

let nextId = 0;

/**
 * Creates a headless confirmation dialog stream.
 *
 * Returns a `requests$` observable for the dialog UI to consume,
 * and an `ask$()` function returning `Observable<boolean>` —
 * `true` if confirmed, `false` if cancelled.
 *
 * Guards against concurrent prompts — calling `ask$()` while a
 * confirmation is already pending returns `of(false)`.
 *
 * @returns An object with:
 *   - `requests$`: subscribe to show/hide a confirmation dialog.
 *   - `ask$(request)`: opens a prompt, returns `Observable<boolean>`.
 *   - `confirm()`: resolves the pending prompt with `true`.
 *   - `cancel()`: resolves the pending prompt with `false`.
 *
 * @example
 * ```ts
 * import { createConfirmationStream } from '@hexguard/angular-confirmation';
 *
 * const dialog = createConfirmationStream();
 * dialog.requests$.subscribe(req => openModal(req));
 * dialog.ask$({ title: 'Delete?', message: 'Sure?' })
 *   .subscribe(confirmed => { if (confirmed) deleteItem(); });
 * dialog.confirm();
 * ```
 */
export function createConfirmationStream() {
  const requestSubject = new Subject<ConfirmationObservableRequest>();
  const resultSubject = new Subject<boolean>();
  let pending = false;

  function ask$(request: Omit<ConfirmationObservableRequest, 'id'>): Observable<boolean> {
    if (pending) return of(false);
    pending = true;
    const id = `confirm-obs-${++nextId}`;
    requestSubject.next({ id, ...request });
    return resultSubject.pipe(first());
  }

  function confirm(): void {
    pending = false;
    resultSubject.next(true);
  }

  function cancel(): void {
    pending = false;
    resultSubject.next(false);
  }

  return {
    /** Subscribe to this to show/hide a confirmation dialog. */
    requests$: requestSubject.asObservable(),
    /** Call this to open a confirmation prompt. Returns Observable<boolean>. */
    ask$,
    /** Call when the user confirms. */
    confirm,
    /** Call when the user cancels. */
    cancel,
  };
}

export interface ConfirmationObservableRequest {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly destructive?: boolean;
}
