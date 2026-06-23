# `@hexguard/angular-error-boundary` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-error-boundary` provides a declarative component error boundary for Angular apps that need per-component error isolation without global `ErrorHandler` gymnastics. It catches render-time and async errors from projected content and displays a configurable fallback UI.

The package is intentionally narrow:

- catches errors from projected child components during change detection
- catches async errors from child-component timers and promise callbacks
- configurable fallback template with typed error context
- default fallback with retry button for quick adoption
- programmatic error state and reset control
- nested boundary support (innermost catches first)
- no global ErrorHandler monkey-patching at module initialization

## Feature Matrix

| Capability                     | Status    | Notes                                                      |
| ------------------------------ | --------- | ---------------------------------------------------------- |
| Render-time error capture      | Available | Catches errors from projected child template evaluation    |
| Async error capture            | Available | Catches errors from `setTimeout`, promise callbacks, etc.  |
| Default fallback               | Available | Error message panel with retry button                      |
| Custom fallback template       | Available | Via `@Input() fallback: TemplateRef<ErrorBoundaryContext>` |
| Programmatic reset             | Available | `reset()` clears error state and re-renders content        |
| `hasError()` / `caughtError()` | Available | Signals for programmatic error state access                |
| Nested boundary support        | Available | Innermost active boundary catches first                    |
| Zero dependencies              | ✅        | Only `@angular/core` + `tslib`                             |

## Public API Map

| Export                           | Role                                             |
| -------------------------------- | ------------------------------------------------ |
| `HexguardErrorBoundaryComponent` | Declarative error boundary component             |
| `ErrorBoundaryContext`           | Template context passed to the fallback template |

## How It Works

The component uses a **boundary stack** pattern with Angular's `ErrorHandler`:

1. **On creation**: the component pushes itself onto a global `boundaryStack`
2. **ErrorHandler wrapping**: the component wraps `ErrorHandler.handleError` so errors route through the stack first. Multiple boundaries chain their wrappers — each captures the previous `handleError` value, creating a linked list of wrappers that all delegate correctly.
3. **Error interception**: when an error occurs during change detection, Angular calls `ErrorHandler.handleError`. The wrapper checks the boundary stack for the topmost (innermost) active boundary.
4. **Error capture**: if a boundary is found, it stores the error in a signal, hides the projected content, and renders the fallback. The error is NOT propagated to the original handler.
5. **Reset**: `reset()` clears the error signal. On the next change detection pass, the projected content is re-rendered.

### Boundary Stack

The `boundaryStack` is a module-level array. When a component is created, `activate()` pushes it. When destroyed, `deactivate()` removes it. This ensures nested boundaries work correctly: the innermost boundary is always the last one pushed and the first to catch errors.

### ErrorHandler Wrapping (Chaining)

Each boundary component wraps `ErrorHandler.handleError`. Because each wrapper captures the previous value before replacing it, the wrappers form a chain:

```
User code → Boundary N wrapper → Boundary N-1 wrapper → ... → Original handler
```

If no boundary captures the error, it falls through to the true original handler, preserving Angular's default error logging behavior.

## Error Capture Scope

### Captured errors:

- Template evaluation errors in projected content (e.g., accessing a null property)
- Errors thrown during Angular change detection of projected views
- Async callbacks (`setTimeout`, promise chains) originating from child components

### Not captured:

- Errors from sibling or parent components outside the boundary's content projection
- HTTP request errors (use `@hexguard/angular-async-state` or `@hexguard/angular-api-errors`)
- Errors from `@defer` blocks (those are handled by Angular's built-in defer error handling)

## Nested Boundaries

```html
<hexguard-error-boundary>
  Widget A is protected
  <hexguard-error-boundary> Widget B has its own boundary </hexguard-error-boundary>
</hexguard-error-boundary>
```

When errors occur in Widget B, the inner boundary catches first. If Widget B's boundary is reset, Widget B re-renders within the outer boundary. Errors in Widget A (but outside Widget B) are caught by the outer boundary.

## Default Fallback

The default fallback renders:

- An error message: "An error occurred in this section."
- A "Retry" button styled with red tones

The fallback has `data-testid="error-boundary-fallback"` and the retry button has `data-testid="error-boundary-retry"` for testing.

## Custom Fallback Template

The `@Input() fallback` accepts a `TemplateRef<ErrorBoundaryContext>`. The context provides:

| Property    | Type         | Description                              |
| ----------- | ------------ | ---------------------------------------- |
| `$implicit` | `unknown`    | The caught error (for `let-ctx` binding) |
| `error`     | `unknown`    | The caught error                         |
| `reset`     | `() => void` | Clears error and re-renders              |

Example:

```html
<hexguard-error-boundary [fallback]="myFallback">
  <risky-widget />
</hexguard-error-boundary>

<ng-template #myFallback let-ctx>
  <div class="custom-error">
    <p>Something went wrong: {{ ctx.error?.message }}</p>
    <button (click)="ctx.reset()">Try again</button>
  </div>
</ng-template>
```

## Configuration Reference

### `HexguardErrorBoundaryComponent`

| Input      | Type                                | Default | Description                                |
| ---------- | ----------------------------------- | ------- | ------------------------------------------ |
| `fallback` | `TemplateRef<ErrorBoundaryContext>` | —       | Custom fallback template. Omit for default |

| Signal        | Type      | Description                          |
| ------------- | --------- | ------------------------------------ |
| `hasError`    | `boolean` | Whether an error is currently caught |
| `caughtError` | `unknown` | The caught error, or `null`          |

| Method    | Description                                   |
| --------- | --------------------------------------------- |
| `reset()` | Clears the error state and re-renders content |

### `ErrorBoundaryContext`

```ts
interface ErrorBoundaryContext {
  readonly $implicit: unknown;
  readonly error: unknown;
  readonly reset: () => void;
}
```

## Lifecycle

```
Component created → push to boundary stack → wrap ErrorHandler
       ↓
Content renders normally (hasError = false)
       ↓
Error thrown in projected content
       ↓
Angular calls ErrorHandler.handleError(err)
       ↓
Boundary wrapper routes to topmost active boundary
       ↓
Boundary sets error signal (hasError = true)
       ↓
Fallback renders with error context
       ↓
User clicks Retry → reset() called
       ↓
Error signal cleared (hasError = false)
       ↓
Content re-renders on next change detection

```

## Related Resources

- [Package README](../../angular/packages/angular-error-boundary/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-error-boundary/)
- [Source Code](../../angular/packages/angular-error-boundary/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                        | Severity |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Minimal surface: 1 component + 1 type. No injectable function — appropriate for component-based boundary.                                      | praise   |
| Implementation Quality    | Clean `ErrorHandler` wrapping with chaining for nested boundaries. Zero deps beyond `@angular/core`. `reset()` correctly clears error state.   | praise   |
| Test Coverage             | Renders safe content, catches render-time errors, resets state, verifies `fallbackContext` shape.                                              | praise   |
| Test Coverage             | Test accesses private `controller` via `(boundary as unknown as {...})` — fragile. No test for sibling boundaries coexisting (chain-wrapping). | minor    |
| Demo Integration          | Demo page with toggle-safe/throw controls, retry button, inspector panel.                                                                      | praise   |
| Cross-package Consistency | No `verify:package:error-boundary` standalone script in `angular/package.json`.                                                                | minor    |
| Cross-package Consistency | Only component-only export in the workspace — justified by domain.                                                                             | praise   |
