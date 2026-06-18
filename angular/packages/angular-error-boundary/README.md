# @hexguard/angular-error-boundary

Declarative component error boundary for Angular: catches render-time and async errors from projected content with configurable fallback and reset support.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-error-boundary.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-error-boundary
```

## Quickstart

```ts
import { Component } from '@angular/core';
import { HexguardErrorBoundaryComponent } from '@hexguard/angular-error-boundary';

@Component({
  standalone: true,
  imports: [HexguardErrorBoundaryComponent],
  template: `
    <hexguard-error-boundary>
      <my-risky-widget />
    </hexguard-error-boundary>
  `,
})
export class MyComponent {}
```

### Custom fallback

```ts
import { HexguardErrorBoundaryComponent } from '@hexguard/angular-error-boundary';

@Component({
  standalone: true,
  imports: [HexguardErrorBoundaryComponent],
  template: `
    <hexguard-error-boundary [fallback]="fallbackTpl">
      <my-risky-widget />
    </hexguard-error-boundary>

    <ng-template #fallbackTpl let-ctx>
      <p>Error: {{ ctx.error.message }}</p>
      <button (click)="ctx.reset()">Retry</button>
    </ng-template>
  `,
})
export class MyComponent {}
```

## Features

| Feature                        | Status | Notes                                                    |
| ------------------------------ | ------ | -------------------------------------------------------- |
| Catches render-time errors     | ✅     | Errors from projected child component templates          |
| Catches async errors           | ✅     | Errors from child-component timers and promise callbacks |
| Custom fallback template       | ✅     | Receives `ErrorBoundaryContext` with error and reset     |
| Default fallback               | ✅     | Error message + Retry button                             |
| `reset()` recovery             | ✅     | Clears error state and re-renders content                |
| `hasError()` / `caughtError()` | ✅     | Programmatic access to error state                       |
| Nested boundaries              | ✅     | Innermost boundary catches first                         |
| Zero dependencies              | ✅     | Only `@angular/core` + `tslib`                           |

## Demo routes

| Route                              | Description                                          |
| ---------------------------------- | ---------------------------------------------------- |
| `/packages/angular-error-boundary` | Error boundary demo with default and custom fallback |

## What It Owns

- Error capture from projected content during change detection
- Fallback template rendering with error context
- Programmatic error state and reset control

## What It Does Not Own

- HTTP error handling — use `@hexguard/angular-async-state` or `@hexguard/angular-api-errors`
- Global error monitoring — errors caught by boundaries are still logged via Angular's `ErrorHandler`
- Template-level error boundaries in `@defer` blocks — those are handled by Angular's built-in error handling

## API Reference

### `HexguardErrorBoundaryComponent`

```ts
@Component({
  selector: 'hexguard-error-boundary',
  template: `@if (hasError()) {
      ... fallback ...
    } @else {
      <ng-content />
    }`,
})
class HexguardErrorBoundaryComponent {
  @Input() fallback: TemplateRef<ErrorBoundaryContext> | undefined;
  readonly hasError: Signal<boolean>;
  readonly caughtError: Signal<unknown>;
  reset(): void;
}
```

### `ErrorBoundaryContext`

```ts
interface ErrorBoundaryContext {
  readonly $implicit: unknown;
  readonly error: unknown;
  readonly reset: () => void;
}
```
