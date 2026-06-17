---
id: feature-angular-error-boundary
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-error-boundary'
---

# Angular Error Boundary Package

## Summary

Design `@hexguard/angular-error-boundary` as a declarative Angular package for catching component render errors, displaying fallback UI, and exposing retry and recovery state through signals.

The repeated problem is that Angular has no built-in equivalent to React error boundaries. Teams build ad hoc `ErrorHandler` overrides, manual try/catch in templates, or leave render errors unhandled, resulting in white screens and poor UX. A standardized error boundary component would give Angular apps the same declarative crash recovery that React developers take for granted.

## Goals

- Provide a declarative `<hexguard-error-boundary>` component that catches render errors in its content children.
- Expose error state, retry, and recovery signals through a headless injectable service.
- Support multiple fallback strategies: default fallback UI, custom fallback template, or rethrow-to-parent.
- Keep the boundary composable: nestable, skippable, and compatible with route-based and component-based error scopes.
- Integrate with error reporting services through an optional error-changed callback.

## Non-Goals

- Replacing global `ErrorHandler` for non-render errors (HTTP, async, service errors).
- Catcher errors outside the component template render cycle (event handlers, timers, observables).
- Shipping a design-system-styled error page — the fallback is app-defined.

## Decisions

- Use Angular's `ErrorHandler` + zone.js render error detection under the hood, but present a clean declarative boundary API.
- Prefer a component-based boundary over a service-based one for ergonomic template usage.
- Keep the retry behavior explicit: `retry()` recreates the content projection, not the boundary itself.
- Treat nested boundaries as independent scopes — error propagates up only when opted in.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Proposed Public API

```ts
import { Component } from '@angular/core';
import {
  HexguardErrorBoundaryComponent,
  injectErrorBoundary,
  type ErrorBoundaryFallbackContext,
} from '@hexguard/angular-error-boundary';

// Component usage
@Component({
  standalone: true,
  imports: [HexguardErrorBoundaryComponent],
  template: `
    <hexguard-error-boundary [fallback]="myFallback" (errorChanged)="onError($event)">
      <my-risky-component />
    </hexguard-error-boundary>

    <ng-template #myFallback let-ctx>
      <div role="alert">
        <p>Something went wrong: {{ ctx.error.message }}</p>
        <button (click)="ctx.retry()">Try again</button>
      </div>
    </ng-template>
  `,
})
export class MyComponent {
  private readonly boundary = injectErrorBoundary();

  onError(error: unknown) {
    console.error('Boundary caught:', error);
  }

  retryFromService() {
    this.boundary.retry();
  }
}

// Injected boundary handle
interface ErrorBoundaryHandle {
  readonly hasError: Signal<boolean>;
  readonly error: Signal<unknown>;
  retry(): void;
}

// Fallback template context
interface ErrorBoundaryFallbackContext {
  error: unknown;
  retry: () => void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-error-boundary/` following existing conventions (package.json, ng-package.json, tsconfigs, `angular.json` registration).
2. Add build and test scripts to `angular/package.json` (`build:lib:error-boundary`, `test:lib:error-boundary`).

### Phase 1: Core Error Boundary Implementation

3. Implement `HexguardErrorBoundaryComponent` using Angular's `ErrorHandler` integration or zone.js render-error detection to catch child-component template errors.
4. Implement the `fallback` `@ContentChild(TemplateRef)` input for custom fallback templates.
5. Implement the `errorChanged` `@Output()` for error-reporting integration.
6. Implement `ErrorBoundaryService` (injectable per-boundary) exposing `hasError`, `error` signals, and `retry()`.
7. Implement `injectErrorBoundary()` helper for imperative access from parent components.
8. Implement nested boundary isolation and opt-in error propagation.
9. Add unit tests for error capture, fallback rendering, retry, nested boundaries, and cleanup.

### Phase 2: Demo & Docs

10. Add a demo route at `/packages/angular-error-boundary` showing:
    - A component that throws on render (toggle-able)
    - Default fallback UI
    - Custom fallback template with retry button
    - Nested boundaries (inner catches, outer catches propagations)
    - Error reporting callback integration
11. Add Playwright coverage for the demo page.
12. Write the deep-dive doc at `docs/packages/angular-error-boundary.md`.
13. Update the npm-facing `README.md` with quickstart and API reference.

### Phase 3: Release

14. Add `verify:package:error-boundary` to `angular/package.json`.
15. Add `.github/workflows/release-angular-error-boundary.yml`.
16. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:error-boundary` — unit tests for error capture, fallback, retry, nesting.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:error-boundary` — tarball smoke test.

## Follow-Ups

- Revisit whether the boundary should also catch async template errors (e.g., `@defer` block errors) once Angular's defer behavior stabilizes.
- Evaluate whether a route-level error boundary helper (`canMatch` / `canActivate` style) could reuse the same component primitive.
- Consider a global `ErrorHandler` integration guide that routes unhandled errors through the nearest boundary.
