import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TemplateRef } from '@angular/core';

import type {
  AsyncState,
  AsyncStateEmptyContext,
  AsyncStateErrorContext,
  AsyncStateIdleContext,
  AsyncStateReloadingContext,
  AsyncStateValueContext,
} from './types';

/**
 * Thin Angular outlet for rendering `AsyncState` handles with explicit templates.
 *
 * The outlet treats first-load errors differently from stale-data reload errors:
 * reload failures keep the value template visible and may render the optional
 * `staleErrorTemplate` beside it.
 */
@Component({
  selector: 'hexguard-async-state-outlet',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    @if (state().isIdle()) {
      <ng-container *ngTemplateOutlet="idleTemplate() ?? null; context: idleContext()" />
    } @else if (state().isLoading()) {
      <ng-container *ngTemplateOutlet="loadingTemplate() ?? null" />
    } @else if (state().isError() && !state().hasLoaded()) {
      <ng-container *ngTemplateOutlet="errorTemplate() ?? null; context: errorContext()" />
    } @else if (state().isEmpty()) {
      <ng-container *ngTemplateOutlet="emptyTemplate() ?? null; context: emptyContext()" />
    } @else {
      @if (state().isReloading()) {
        <ng-container
          *ngTemplateOutlet="reloadingTemplate() ?? null; context: reloadingContext()"
        />
      }
      @if (state().isError() && state().hasLoaded()) {
        <ng-container
          *ngTemplateOutlet="staleErrorTemplate() ?? null; context: reloadingContext()"
        />
      }
      <ng-container *ngTemplateOutlet="valueTemplate(); context: valueContext()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexguardAsyncStateOutletComponent<TValue, TError = unknown> {
  readonly state = input.required<AsyncState<TValue, TError>>();
  readonly valueTemplate = input.required<TemplateRef<AsyncStateValueContext<TValue, TError>>>();
  readonly idleTemplate = input<TemplateRef<AsyncStateIdleContext<TValue, TError>> | null>(null);
  readonly loadingTemplate = input<TemplateRef<unknown> | null>(null);
  readonly errorTemplate = input<TemplateRef<AsyncStateErrorContext<TValue, TError>> | null>(null);
  readonly emptyTemplate = input<TemplateRef<AsyncStateEmptyContext<TValue, TError>> | null>(null);
  readonly reloadingTemplate = input<TemplateRef<
    AsyncStateReloadingContext<TValue, TError>
  > | null>(null);
  readonly staleErrorTemplate = input<TemplateRef<
    AsyncStateReloadingContext<TValue, TError>
  > | null>(null);

  protected readonly idleContext = computed<AsyncStateIdleContext<TValue, TError>>(() => ({
    state: this.state(),
  }));

  protected readonly valueContext = computed<AsyncStateValueContext<TValue, TError>>(() => ({
    $implicit: this.state().value(),
    value: this.state().value(),
    state: this.state(),
  }));

  protected readonly errorContext = computed<AsyncStateErrorContext<TValue, TError>>(() => ({
    $implicit: this.state().error(),
    error: this.state().error(),
    state: this.state(),
  }));

  protected readonly emptyContext = computed<AsyncStateEmptyContext<TValue, TError>>(() => ({
    state: this.state(),
  }));

  protected readonly reloadingContext = computed<AsyncStateReloadingContext<TValue, TError>>(
    () => ({
      $implicit: this.state().value(),
      value: this.state().value(),
      error: this.state().error(),
      state: this.state(),
    }),
  );
}
