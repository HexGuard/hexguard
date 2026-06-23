# @hexguard/angular-confirmation — Deep Package Notes

Headless confirmation dialog state for Angular: promise-based `ask()`/`run()` flows for destructive actions.

## Problem

Every app needs "Are you sure?" dialogs for delete, archive, and destructive actions. Teams rebuild the same promise-based state management: `isOpen` signal, `currentRequest` tracking, resolve/reject wiring, and duplicate-open prevention.

**`@hexguard/angular-confirmation`** standardizes this into one injectable contract.

## API

- `ask(request)` → `Promise<boolean>` — Opens a confirmation dialog, resolves `true` on confirm, `false` on cancel
- `run(request, action)` → `Promise<ConfirmationResult>` — Composes `ask()` with an async action
- `confirm()` / `cancel()` — Resolve the current dialog
- `isOpen: Signal<boolean>` — Whether a dialog is active
- `currentRequest: Signal<ConfirmationRequest | null>` — The active request for rendering

---

## Assessment: Potential Improvements

| Area  | Suggestion                                                                                                                                                              | Priority    |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| API   | Consider adding a `reset()` method that clears state without resolving (for external dismiss)                                                                           | Low         |
| API   | Consider a `destroyRef`-based auto-cleanup for dangling unresolved promises when the component is destroyed while a dialog is open                                      | Medium      |
| API   | The `run()` method swallows action errors — consider exposing them via an `actionError` signal or returning `{ confirmed: true, error }`                                | Medium      |
| Tests | Missing test: `run()` with confirmed but failed action returns `{ confirmed: true }` without the error                                                                  | Low         |
| API   | ✅ Added RxJS observable alternative — `createConfirmationStream()` returns `{ requests$, ask$(), confirm(), cancel() }`. Import from `@hexguard/angular-confirmation`. | Implemented |

## Code Examples

### Ask for confirmation before a destructive action

```typescript
import { injectConfirmation } from '@hexguard/angular-confirmation';

@Component({ ... })
class DeleteDocumentComponent {
  readonly confirm = injectConfirmation();

  async onDelete(): Promise<void> {
    const ok = await this.confirm.ask({
      title: 'Delete document?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    await this.api.delete(documentId);
  }
}
// Template:
// @if (confirm.isOpen()) {
//   <div class="dialog">
//     <p>{{ confirm.currentRequest()?.message }}</p>
//     <button (click)="confirm.confirm()">Confirm</button>
//     <button (click)="confirm.cancel()">Cancel</button>
//   </div>
// }
```

### Confirm-and-execute pattern with `run()`

```typescript
@Component({ ... })
class PublishArticleComponent {
  readonly confirm = injectConfirmation();

  async onPublish(): Promise<void> {
    const result = await this.confirm.run(
      { title: 'Publish article?', message: 'Article will be visible to readers.' },
      () => this.api.publish(articleId),
    );
    if (result.confirmed) {
      this.notify.success('Article published');
    }
  }
}
```

## RxJS Observable API

For RxJS consumers, `createConfirmationStream()` returns a dialog stream that can be composed with other observable pipelines:

```ts
import { createConfirmationStream } from '@hexguard/angular-confirmation';
import { switchMap } from 'rxjs/operators';

const dialog = createConfirmationStream();

// Dialog component subscribes to requests
const modalSub = dialog.requests$.subscribe((req) => openModal(req));

// Caller chains with other async flows
dialog
  .ask$({ title: 'Delete?', message: 'Are you sure?' })
  .pipe(switchMap((confirmed) => (confirmed ? deleteItem() : skip())))
  .subscribe();

// In dialog template: dialog.confirm() or dialog.cancel()
```

## Related Resources

- [Package README](../../angular/packages/angular-confirmation/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-confirmation/)
- [Source Code](../../angular/packages/angular-confirmation/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                     | Severity |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Minimal surface: 1 function (`injectConfirmation`), 3 types. Elegant signal-based headless design.                                          | praise   |
| Implementation Quality | `ask()`/`run()`/`confirm()`/`cancel()` — clean promise-based flow. Duplicate-open prevention.                                               | praise   |
| Implementation Quality | **No `DestroyRef` cleanup** — dangling unresolved promises if component destroyed while dialog open. Noted in deep-dive as Medium priority. | moderate |
| Test Coverage          | 6 tests: happy path, cancel, duplicate rejection, `run()` flow.                                                                             | praise   |
| Test Coverage          | No test for `run()` with a _failed_ action callback — error would propagate unhandled.                                                      | minor    |
| Demo Integration       | Interactive demo with ask/confirm/cancel and inspector panel.                                                                               | praise   |
