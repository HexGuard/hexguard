import type { Signal } from '@angular/core';

export interface ConfirmationRequest {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly destructive?: boolean;
}

export interface ConfirmationResult<T = unknown> {
  readonly confirmed: boolean;
  readonly result?: T;
}

export interface ConfirmationHandle {
  readonly isOpen: Signal<boolean>;
  readonly currentRequest: Signal<ConfirmationRequest | null>;
  ask(request: Omit<ConfirmationRequest, 'id'>): Promise<boolean>;
  run<T>(request: Omit<ConfirmationRequest, 'id'>, action: () => Promise<T>): Promise<ConfirmationResult<T>>;
  /** Resolve the current dialog as confirmed. */
  confirm(): void;
  /** Resolve the current dialog as cancelled. */
  cancel(): void;
}
