import {
  computed,
  inject,
  Injectable,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import type { ApiError, ApiValidationResult } from './types';

/**
 * Signal-based container for page-level API error state.
 *
 * Use in components to track API errors that are not tied to a specific form
 * control, such as toast-style banners, inline alerts, or submit-error states.
 */
export interface ApiErrorState {
  /** Signal of all current API errors. */
  readonly errors: Signal<readonly ApiError[]>;
  /** Signal indicating whether any errors are present. */
  readonly hasErrors: Signal<boolean>;
  /** Signal of current model-level (non-field) errors. */
  readonly pageErrors: Signal<readonly ApiError[]>;

  /** Sets errors from a validation result. Replaces any previous errors. */
  setErrors(result: ApiValidationResult): void;
  /** Adds a single error to the current state. */
  addError(error: ApiError): void;
  /** Clears all errors. */
  clear(): void;
  /** Checks if a specific field has errors. */
  hasFieldError(fieldPath: string): Signal<boolean>;
}

/**
 * Injectable service that provides signal-based API error state management.
 * Use `injectApiErrorState()` for convenient access.
 */
@Injectable({ providedIn: 'root' })
export class DefaultApiErrorState implements ApiErrorState {
  private readonly _errors: WritableSignal<readonly ApiError[]> = signal([]);

  readonly errors: Signal<readonly ApiError[]> = this._errors.asReadonly();

  /** Signal indicating whether any errors are present. */
  readonly hasErrors: Signal<boolean> = computed(() => this._errors().length > 0);

  /** Signal of current model-level (non-field) errors. */
  readonly pageErrors: Signal<readonly ApiError[]> = computed(() =>
    this._errors().filter((e) => !e.isFieldError || e.field.length === 0),
  );

  setErrors(result: ApiValidationResult): void {
    this._errors.set([...result.errors]);
  }

  addError(error: ApiError): void {
    this._errors.update((current) => [...current, error]);
  }

  clear(): void {
    this._errors.set([]);
  }

  hasFieldError(fieldPath: string): Signal<boolean> {
    return computed(() => this._errors().some((e) => e.field === fieldPath));
  }
}

/**
 * Injection function that returns an `ApiErrorState` instance.
 */
export function injectApiErrorState(): ApiErrorState {
  return inject(DefaultApiErrorState);
}
