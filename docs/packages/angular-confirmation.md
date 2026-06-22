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

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding a `reset()` method that clears state without resolving (for external dismiss) | Low |
| API | Consider a `destroyRef`-based auto-cleanup for dangling unresolved promises when the component is destroyed while a dialog is open | Medium |
| API | The `run()` method swallows action errors — consider exposing them via an `actionError` signal or returning `{ confirmed: true, error }` | Medium |
| Tests | Missing test: `run()` with confirmed but failed action returns `{ confirmed: true }` without the error | Low |
