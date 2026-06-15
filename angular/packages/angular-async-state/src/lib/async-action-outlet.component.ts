import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TemplateRef } from '@angular/core';

import type {
  AsyncAction,
  AsyncActionErrorContext,
  AsyncActionIdleContext,
  AsyncActionPendingContext,
  AsyncActionSuccessContext,
} from './types';

/** Thin Angular outlet for rendering `AsyncAction` handles with explicit templates. */
@Component({
  selector: 'hexguard-async-action-outlet',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    @if (action().pending()) {
      <ng-container *ngTemplateOutlet="pendingTemplate() ?? null; context: pendingContext()" />
    } @else if (action().hasFailed()) {
      <ng-container *ngTemplateOutlet="errorTemplate() ?? null; context: errorContext()" />
    } @else if (action().hasSucceeded()) {
      <ng-container *ngTemplateOutlet="successTemplate() ?? null; context: successContext()" />
    } @else {
      <ng-container *ngTemplateOutlet="idleTemplate() ?? null; context: idleContext()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexguardAsyncActionOutletComponent<TInput = void, TResult = void, TError = unknown> {
  readonly action = input.required<AsyncAction<TInput, TResult, TError>>();
  readonly idleTemplate = input<TemplateRef<
    AsyncActionIdleContext<TInput, TResult, TError>
  > | null>(null);
  readonly pendingTemplate = input<TemplateRef<
    AsyncActionPendingContext<TInput, TResult, TError>
  > | null>(null);
  readonly successTemplate = input<TemplateRef<
    AsyncActionSuccessContext<TInput, TResult, TError>
  > | null>(null);
  readonly errorTemplate = input<TemplateRef<
    AsyncActionErrorContext<TInput, TResult, TError>
  > | null>(null);

  protected readonly idleContext = computed<AsyncActionIdleContext<TInput, TResult, TError>>(
    () => ({ action: this.action() }),
  );

  protected readonly pendingContext = computed<AsyncActionPendingContext<TInput, TResult, TError>>(
    () => ({ action: this.action() }),
  );

  protected readonly successContext = computed<AsyncActionSuccessContext<TInput, TResult, TError>>(
    () => ({
      $implicit: this.action().lastResult(),
      result: this.action().lastResult(),
      action: this.action(),
    }),
  );

  protected readonly errorContext = computed<AsyncActionErrorContext<TInput, TResult, TError>>(
    () => ({
      $implicit: this.action().error(),
      error: this.action().error(),
      action: this.action(),
    }),
  );
}
