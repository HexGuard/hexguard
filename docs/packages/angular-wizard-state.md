# @hexguard/angular-wizard-state — Deep Package Notes

Multi-step flow state for Angular: linear and conditional step progression, validation gates, resume behavior, and review-or-confirm steps with signal-based primitives.

## Problem

Business apps frequently model multi-step flows — create an entity (step 1: details, step 2: config, step 3: review), import data (upload → map columns → preview → confirm), or onboard a user (profile → permissions → finish). Every team rebuilds the same step-tracking, validation-gating, back/next/skip navigation, and resume-from-interruption logic.

**`@hexguard/angular-wizard-state`** standardizes this into one injectable contract with step lifecycle hooks and optional storage adapters.

## API

- `injectWizardState(options)` — Returns a `WizardStateHandle` with:
  - `currentStep: Signal<WizardStep | null>` — The current step definition
  - `currentIndex: Signal<number>` — The current step index (accounting for skipped steps)
  - `isFirst`, `isLast`, `canGoNext`, `canGoBack: Signal<boolean>` — Navigation state
  - `progress: Signal<number>` — Progress percentage (0–100)
  - `isFinished: Signal<boolean>` — Whether the wizard has been finished
  - `next()`, `back()`, `goToStep(id)`, `skip()`, `finish()`, `cancel()`, `reset()` — Navigation methods
- Per-step: `validate: Signal<boolean>`, `canShow: Signal<boolean>`, `onStepEnter`, `onStepLeave` lifecycle hooks
- `WizardStorage` — Optional adapter for save/restore/resume

---

## Assessment: Potential Improvements

| Area  | Suggestion                                                                        | Priority |
| ----- | --------------------------------------------------------------------------------- | -------- |
| API   | Consider adding `collectData()` that returns a combined snapshot of all step data | Low      |
| API   | Consider adding `onStepEnter` context parameter with previous step ID             | Low      |
| API   | Consider a `canSkip: Signal<boolean>` per step for conditional skip enablement    | Low      |
| API   | Consider multi-page (route-based) wizard support in v0.2                          | Medium   |
| Tests | Missing test: `canShow` change at runtime causing visible steps to reorder        | Low      |
| Tests | Missing test: `finish()` is a no-op after `cancel()`                              | Low      |

## Code Examples

### Basic three-step wizard

```typescript
import { Component, signal } from '@angular/core';
import { injectWizardState } from '@hexguard/angular-wizard-state';
import type { WizardStep } from '@hexguard/angular-wizard-state';

@Component({ ... })
class CreateOrderWizardComponent {
  readonly agree = signal(false);

  private readonly steps: readonly WizardStep[] = [
    { id: 'details', title: 'Details' },
    { id: 'config', title: 'Configuration', validate: this.agree.asReadonly() },
    { id: 'review', title: 'Review' },
  ];

  readonly wizard = injectWizardState({ steps: this.steps });

  onFinish() {
    // Submit collected data
  }
}
// Template uses wizard.currentStep(), wizard.canGoNext(), wizard.progress(), etc.
// The Configuration step requires the user to check "I agree" before advancing.
```

### Wizard with conditional step and storage adapter

```typescript
import { injectWizardState } from '@hexguard/angular-wizard-state';
import type { WizardStep, WizardStorage } from '@hexguard/angular-wizard-state';

const steps: readonly WizardStep[] = [
  { id: 'details', title: 'Details' },
  { id: 'billing', title: 'Billing', canShow: isPremiumUser },
  { id: 'review', title: 'Review' },
];

const storage: WizardStorage = {
  save: (s) => sessionStorage.setItem('wizard-draft', JSON.stringify(s)),
  restore: () => {
    const raw = sessionStorage.getItem('wizard-draft');
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => sessionStorage.removeItem('wizard-draft'),
};

const wizard = injectWizardState({ steps, storage });
// The Billing step is automatically skipped for non-premium users.
// Progress is saved to sessionStorage for resume after page refresh.
```

## Related Resources

- [Package README](../../angular/packages/angular-wizard-state/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-wizard-state/)
- [Source Code](../../angular/packages/angular-wizard-state/src/)

---

## API Review Findings

Review date: 2026-06-23. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                                                        | Severity |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | 1 function (`injectWizardState`), 4 types. Rich step model with validation, visibility, and lifecycle hooks. WizardStorage adapter for resumability.                                           | praise   |
| Implementation Quality | Signal-based state with `computed` for derived values (visibleSteps, canGoNext, progress). Conditional step skipping. Storage save/restore on navigation. Step lifecycle hooks fire correctly. | praise   |
| Implementation Quality | `finish()` clears storage, `cancel()` clears storage, `reset()` returns to step 0. Consistent state transitions.                                                                               | praise   |
| Test Coverage          | 18 tests covering linear progression, back navigation, validation gates, conditional skip, finish/cancel/reset, goToStep, progress, isFirst/isLast, canGoBack, storage save/restore.           | praise   |
| Demo Integration       | Interactive demo with three-step wizard (Details → Configuration with checkbox gate → Review), progress bar, back/next/finish/cancel buttons, and inspector panel.                             | praise   |
