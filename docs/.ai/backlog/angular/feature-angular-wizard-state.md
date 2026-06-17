---
id: feature-angular-wizard-state
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-wizard-state'
---

# Angular Wizard State Package

## Summary

Design `@hexguard/angular-wizard-state` as a headless Angular package for standardizing multi-step flow state, validation gates, resume behavior, and review-or-confirm steps for create, import, onboarding, and setup experiences.

The repeated problem is that business apps frequently model multi-step flows — create a new entity (step 1: details, step 2: configuration, step 3: review), import data (step 1: upload, step 2: map columns, step 3: preview, step 4: confirm), or onboard a user (step 1: profile, step 2: permissions, step 3: finish). Every team rebuilds the same step-tracking, validation-gating, back/next/skip navigation, and resume-from-interruption logic.

## Goals

- Provide `injectWizardState(steps, options?)` returning signal-based wizard state: currentStep, isValid, canGoNext, isFirst, isLast, progress.
- Support linear and conditional step progression (skip a step based on a prior answer).
- Support per-step validation gates that must pass before the user can advance.
- Support resumable wizards — save progress to storage and restore on return.
- Support review/confirm step as a built-in step type.
- Provide navigation methods: `next()`, `back()`, `goToStep(n)`, `skip()`, `finish()`, `cancel()`.
- Expose step lifecycle hooks: `onStepEnter`, `onStepLeave`, `onFinish`, `onCancel`.

## Non-Goals

- Rendering wizard UI (step indicators, buttons, forms) — that's app-owned.
- Multi-page wizards across routes — this is for single-page step flows.
- Dynamic step addition/removal at runtime — steps are defined upfront.

## Decisions

- Steps are defined as a flat array with step identifiers. Conditional skipping uses a `canShow` predicate.
- Validation gates per step are optional signals — when false, `next()` is blocked.
- Resumability via an optional `WizardStorage` adapter (same pattern as angular-tour and angular-storage).
- `finish()` returns a signal of all collected data — the consumer reads final values.

## Proposed Public API

```ts
const wizard = injectWizardState({
  steps: [
    { id: 'details', title: 'Details', canShow: signal(true) },
    { id: 'config', title: 'Configuration', validate: configSignal().valid },
    { id: 'review', title: 'Review' },
  ],
  storage: localStorageWizardStorage('create-order-wizard'),
});

wizard.currentStep;       // Signal<WizardStep>
wizard.currentIndex;       // Signal<number>
wizard.isFirst;            // Signal<boolean>
wizard.isLast;             // Signal<boolean>
wizard.canGoNext;          // Signal<boolean> — false when validation gate fails
wizard.canGoBack;          // Signal<boolean>
wizard.progress;           // Signal<number> — 0–100
wizard.isFinished;         // Signal<boolean>

wizard.next();             // advances if canGoNext
wizard.back();
wizard.goToStep('review');
wizard.finish();           // marks complete, fires onFinish
wizard.cancel();           // fires onCancel
wizard.reset();            // resets to step 0, clears collected data
```

## Implementation Plan

1. Scaffold `angular/packages/angular-wizard-state/`.
2. Add build/test scripts.
3. Implement `injectWizardState()` with step array, current index, navigation methods.
4. Implement per-step validation gates as `Signal<boolean>`.
5. Implement conditional step visibility via `canShow` predicates.
6. Implement storage adapters for resumability.
7. Implement `canGoNext`, `canGoBack`, `progress` derived signals.
8. Implement step lifecycle hooks (onEnter, onLeave, onFinish, onCancel).
9. Add unit tests for: linear progression, conditional skip, validation gates, back navigation, finish, cancel, reset, storage save/restore, boundary conditions.
10. Add demo route, Playwright, docs, release.

## Validation

- `pnpm test:lib:wizard-state` — unit tests.
- `pnpm build:lib` — builds.
- `pnpm test:e2e` — Playwright.
