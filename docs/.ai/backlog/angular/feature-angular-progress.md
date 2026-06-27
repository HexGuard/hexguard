---
id: feature-angular-progress
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-progress'
---

# @hexguard/angular-progress

## Summary

Headless progress and stepper state — multi-step progression, step validation, completion tracking, and step navigation. For wizards, onboarding flows, checkout processes, and multi-form workflows.

## Goals

- Linear and non-linear step progression
- Step validation gates (can't proceed until current step is valid)
- Step completion tracking (completed, current, pending, skipped)
- Optional steps that can be skipped
- Step history navigation (back/forward/jump-to)
- Progress percentage computation
- Step metadata (title, description, icon, status)
- Conditional steps (show/hide based on previous answers)

## Non-Goals

- No rendered stepper/progress bar UI
- No form validation logic (delegated to consumer)
- No persistence across sessions (use angular-storage for that)

## Proposed Public API

```typescript
export function injectProgress(steps: ProgressStep[]): {
  readonly steps: Signal<ProgressStep[]>;
  readonly currentStep: Signal<ProgressStep | null>;
  readonly currentIndex: Signal<number>;
  readonly progressPercent: Signal<number>;
  readonly isFirstStep: Signal<boolean>;
  readonly isLastStep: Signal<boolean>;
  readonly canProceed: Signal<boolean>;
  readonly completedSteps: Signal<ProgressStep[]>;
  next(): void;
  previous(): void;
  goTo(index: number): void;
  setStepValid(stepId: string, isValid: boolean): void;
  completeStep(stepId: string): void;
  skipStep(stepId: string): void;
  reset(): void;
};

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'skipped' | 'error';
  isOptional?: boolean;
  isVisible?: boolean;
  isValid?: boolean;
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-progress/`.
2. Implement step progression, validation gates, completion tracking with signals.
3. Add conditional steps and skip support.
4. Add tests for all navigation patterns.
5. Register in workspace.
