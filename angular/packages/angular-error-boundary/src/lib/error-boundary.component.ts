import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChild,
  EmbeddedViewRef,
  inject,
  Input,
  type Signal,
  signal,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  type DoCheck,
} from '@angular/core';

import type { ErrorBoundaryContext } from './types';

/**
 * Tracks a single error boundary's error state.
 */
class ErrorBoundaryController {
  private readonly errorSignal = signal<unknown | null>(null);

  readonly hasError: Signal<boolean> = computed(() => this.errorSignal() !== null);
  readonly caughtError: Signal<unknown | null> = this.errorSignal.asReadonly();

  capture(error: unknown): void {
    this.errorSignal.set(error);
  }

  reset(): void {
    this.errorSignal.set(null);
  }
}

/**
 * Declarative error boundary component that catches render-time errors
 * from projected content rendered as `<ng-template>` and displays a
 * configurable fallback UI.
 *
 * Content MUST be wrapped in an `<ng-template>`. The template is rendered
 * as an embedded view in the boundary's change-detection scope, and errors
 * during its rendering are caught locally by wrapping
 * `ViewContainerRef.createEmbeddedView()` / `EmbeddedViewRef.detectChanges()`.
 *
 * @example
 * ```html
 * <hexguard-error-boundary>
 *   <ng-template>
 *     <my-risky-widget />
 *   </ng-template>
 * </hexguard-error-boundary>
 * ```
 *
 * @example
 * ```html
 * <hexguard-error-boundary [fallback]="fallbackTpl">
 *   <ng-template>
 *     <my-risky-widget />
 *   </ng-template>
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
export class HexguardErrorBoundaryComponent implements DoCheck, AfterViewInit {
  private readonly controller = new ErrorBoundaryController();
  private readonly vcr = inject(ViewContainerRef);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Flag to avoid re-entrant rendering. */
  private contentViewRef: EmbeddedViewRef<unknown> | null = null;
  private needsRender = true;

  /**
   * Optional custom fallback template. Receives an `ErrorBoundaryContext`
   * with `$implicit`, `error`, and `reset()`.
   */
  @Input() fallback: TemplateRef<ErrorBoundaryContext> | undefined;

  /**
   * Content projected as `<ng-template>`.
   */
  @ContentChild(TemplateRef) contentTemplate: TemplateRef<unknown> | undefined;

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

  ngAfterViewInit(): void {
    this.renderContent();
  }

  /**
   * On each CD pass, re-create the embedded view. This ensures that
   * render-time errors thrown inside the content template are caught by
   * our local try-catch, rather than propagating to Angular's global
   * ErrorHandler where they cannot be correctly associated with this
   * boundary when multiple sibling boundaries exist.
   */
  ngDoCheck(): void {
    if (!this.hasError() && this.contentTemplate) {
      this.renderContent();
    }
  }

  private renderContent(): void {
    this.vcr.clear();
    try {
      this.contentViewRef = this.vcr.createEmbeddedView(this.contentTemplate!);
      this.contentViewRef.detectChanges();
    } catch (e) {
      this.vcr.clear();
      this.controller.capture(e);
      this.cdr.markForCheck();
    }
  }

  /** Clear the error state and re-render the projected content. */
  reset(): void {
    this.controller.reset();
    if (this.contentTemplate) {
      this.renderContent();
    }
  }
}
