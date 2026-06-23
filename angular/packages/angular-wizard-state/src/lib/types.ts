import type { Signal } from '@angular/core';

export interface WizardStep {
  readonly id: string;
  readonly title: string;
  /** Optional signal-based validation gate — blocks next() when false. */
  readonly validate?: Signal<boolean>;
  /** Optional predicate — step is skipped when false. */
  readonly canShow?: Signal<boolean>;
  /** Called when entering this step. */
  onStepEnter?: () => void;
  /** Called when leaving this step. */
  onStepLeave?: () => void;
}

export interface WizardStorage {
  save(state: WizardStateSnapshot): void;
  restore(): WizardStateSnapshot | null;
  clear(): void;
}

export interface WizardStateSnapshot {
  readonly currentIndex: number;
  readonly isFinished: boolean;
}

export interface WizardStateOptions {
  /** Array of step definitions — order defines progression. */
  readonly steps: readonly WizardStep[];
  /** Optional storage adapter for resumability. */
  readonly storage?: WizardStorage;
  /** Called when the wizard is finished. */
  onFinish?: () => void;
  /** Called when the wizard is cancelled. */
  onCancel?: () => void;
}

export interface WizardStateHandle {
  /** The current step definition. */
  readonly currentStep: Signal<WizardStep | null>;
  /** The current step index (accounting for skipped steps). */
  readonly currentIndex: Signal<number>;
  /** Whether the current step is the first visible step. */
  readonly isFirst: Signal<boolean>;
  /** Whether the current step is the last visible step. */
  readonly isLast: Signal<boolean>;
  /** Whether the user can advance — false when validation gate fails. */
  readonly canGoNext: Signal<boolean>;
  /** Whether the user can go back. */
  readonly canGoBack: Signal<boolean>;
  /** Progress percentage (0–100). */
  readonly progress: Signal<number>;
  /** Whether the wizard has been finished. */
  readonly isFinished: Signal<boolean>;

  /** Advance to the next step — no-op if canGoNext is false. */
  next(): void;
  /** Go back to the previous step. */
  back(): void;
  /** Go to a specific step by ID. */
  goToStep(id: string): void;
  /** Skip the current step — advances without validation. */
  skip(): void;
  /** Finish the wizard — fires onFinish callback. */
  finish(): void;
  /** Cancel the wizard — fires onCancel callback. */
  cancel(): void;
  /** Reset to the first step and clear storage. */
  reset(): void;
}
