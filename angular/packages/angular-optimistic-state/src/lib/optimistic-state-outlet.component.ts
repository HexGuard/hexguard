import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TemplateRef } from '@angular/core';

import type {
  OptimisticState,
  OptimisticStateErrorContext,
  OptimisticStatePendingContext,
  OptimisticStateValueContext,
} from './types';

/**
 * Thin Angular outlet for rendering optimistic-state handles with explicit templates.
 *
 * The outlet always renders the current derived value and can optionally render
 * companion pending or error templates alongside it.
 */
@Component({
  selector: 'hexguard-optimistic-state-outlet',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    @if (state().isPending()) {
      <ng-container *ngTemplateOutlet="pendingTemplate() ?? null; context: pendingContext()" />
    }

    @if (state().isError()) {
      <ng-container *ngTemplateOutlet="errorTemplate() ?? null; context: errorContext()" />
    }

    <ng-container *ngTemplateOutlet="valueTemplate(); context: valueContext()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexguardOptimisticStateOutletComponent<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly state = input.required<OptimisticState<TValue, TInput, TResult, TError, TTarget>>();
  readonly valueTemplate =
    input.required<
      TemplateRef<OptimisticStateValueContext<TValue, TInput, TResult, TError, TTarget>>
    >();
  readonly pendingTemplate = input<TemplateRef<
    OptimisticStatePendingContext<TValue, TInput, TResult, TError, TTarget>
  > | null>(null);
  readonly errorTemplate = input<TemplateRef<
    OptimisticStateErrorContext<TValue, TInput, TResult, TError, TTarget>
  > | null>(null);

  protected readonly valueContext = computed<
    OptimisticStateValueContext<TValue, TInput, TResult, TError, TTarget>
  >(() => ({
    $implicit: this.state().value(),
    value: this.state().value(),
    state: this.state(),
  }));

  protected readonly pendingContext = computed<
    OptimisticStatePendingContext<TValue, TInput, TResult, TError, TTarget>
  >(() => ({
    $implicit: this.state()
      .entries()
      .filter((entry) => entry.status === 'pending'),
    entries: this.state()
      .entries()
      .filter((entry) => entry.status === 'pending'),
    state: this.state(),
  }));

  protected readonly errorContext = computed<
    OptimisticStateErrorContext<TValue, TInput, TResult, TError, TTarget>
  >(() => ({
    $implicit: this.state().error(),
    error: this.state().error(),
    state: this.state(),
  }));
}
