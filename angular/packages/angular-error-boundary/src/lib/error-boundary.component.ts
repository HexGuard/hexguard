import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  type Signal,
  signal,
  TemplateRef,
  ViewEncapsulation,
  ErrorHandler,
} from '@angular/core';

import type { ErrorBoundaryContext } from './types';

/**
 * Global stack of active error boundary controllers, used to route errors
 * from `ErrorHandler` to the innermost active boundary.
 *
 * Mutated by `activate()`/`deactivate()` — the array reference stays const.
 *
 * Each boundary wraps `ErrorHandler.handleError` so it routes errors through
 * the stack first. Multiple boundaries chain correctly: each wrapper
 * delegates to the previous one when no boundary captures the error.
 */
const boundaryStack: ErrorBoundaryController[] = [];

/**
 * Tracks a single error boundary's error state.
 */
class ErrorBoundaryController {
  private readonly errorSignal = signal<unknown | null>(null);

  readonly hasError: Signal<boolean> = computed(() => this.errorSignal() !== null);
  readonly caughtError: Signal<unknown | null> = this.errorSignal.asReadonly();

  activate(): void {
    boundaryStack.push(this);
  }

  deactivate(): void {
    const idx = boundaryStack.indexOf(this);
    if (idx >= 0) {
      boundaryStack.splice(idx, 1);
    }
  }

  capture(error: unknown): void {
    this.errorSignal.set(error);
  }

  reset(): void {
    this.errorSignal.set(null);
  }

  /** Route an error to the topmost active boundary. Returns true if captured. */
  static routeToTop(error: unknown): boolean {
    const top = boundaryStack[boundaryStack.length - 1];
    if (top) {
      top.capture(error);
      return true;
    }
    return false;
  }
}

/**
 * Declarative error boundary component that catches render-time and async
 * errors from projected content and displays a configurable fallback UI.
 *
 * Errors occurring inside projected content are intercepted by wrapping
 * Angular's `ErrorHandler`, routing them to this boundary instead of letting
 * them propagate to the global handler.
 *
 * @example
 * ```html
 * <hexguard-error-boundary>
 *   <my-risky-widget />
 * </hexguard-error-boundary>
 * ```
 *
 * @example
 * ```html
 * <hexguard-error-boundary [fallback]="fallbackTpl">
 *   <my-risky-widget />
 * </hexguard-error-boundary>
 *
 * <ng-template #fallbackTpl let-ctx>
 *   <p>Error: {{ ctx.error.message }}</p>
 *   <button (click)="ctx.reset()">Retry</button>
 * </ng-template>
 * ```
 */
@Component({
  standalone: true,
  selector: 'hexguard-error-boundary',
  imports: [NgTemplateOutlet],
  template: `
    @if (hasError()) {
      <div
        class="error-boundary__fallback"
        data-testid="error-boundary-fallback"
      >
        @if (fallback; as fallbackRef) {
          <ng-template
            [ngTemplateOutlet]="fallbackRef"
            [ngTemplateOutletContext]="fallbackContext()"
          />
        } @else {
          <div class="error-boundary__default-fallback">
            <p class="error-boundary__message">
              An error occurred in this section.
            </p>
            <button
              type="button"
              class="error-boundary__retry-btn"
              (click)="reset()"
              data-testid="error-boundary-retry"
            >
              Retry
            </button>
          </div>
        }
      </div>
    } @else {
      <ng-content />
    }
  `,
  styles: [
    `
    .error-boundary__fallback {
      padding: 1rem;
      border: 1px solid #f5c6cb;
      border-radius: 0.375rem;
      background: #f8d7da;
      color: #721c24;
    }
    .error-boundary__default-fallback {
      text-align: center;
    }
    .error-boundary__message {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
    }
    .error-boundary__retry-btn {
      border: 1px solid currentColor;
      border-radius: 0.25rem;
      background: none;
      cursor: pointer;
      font-size: 0.8125rem;
      padding: 0.375rem 0.75rem;
    }
    .error-boundary__retry-btn:hover {
      background: rgba(0,0,0,0.05);
    }
  `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexguardErrorBoundaryComponent {
  private readonly controller = new ErrorBoundaryController();

  /**
   * Optional custom fallback template. Receives an `ErrorBoundaryContext`
   * with `$implicit`, `error`, and `reset()`.
   */
  @Input() fallback: TemplateRef<ErrorBoundaryContext> | undefined;

  /** Whether an error has been caught. */
  readonly hasError = this.controller.hasError;

  /** The caught error, or `null` if no error has been caught. */
  readonly caughtError = this.controller.caughtError;

  /** Context object passed to the fallback template. */
  readonly fallbackContext = computed<ErrorBoundaryContext>(() => ({
    $implicit: this.caughtError(),
    error: this.caughtError(),
    reset: () => this.reset(),
  }));

  constructor() {
    const destroyRef = inject(DestroyRef);
    const errHandler = inject(ErrorHandler);

    // Wrap ErrorHandler.handleError so errors route through the boundary
    // stack first. Each component wraps it; the wrappers chain correctly
    // because each captures the previous value of handleError.
    const originalHandleError = errHandler.handleError.bind(errHandler);
    errHandler.handleError = (error: unknown) => {
      if (!ErrorBoundaryController.routeToTop(error)) {
        // No active boundary — delegate to the original handler
        originalHandleError(error);
      }
    };

    this.controller.activate();

    destroyRef.onDestroy(() => {
      this.controller.deactivate();
    });
  }

  /** Clear the error state and re-render the projected content. */
  reset(): void {
    this.controller.reset();
  }
}
