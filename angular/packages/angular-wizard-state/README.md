# @hexguard/angular-wizard-state

**Multi-step flow state for Angular.** Linear and conditional step progression, validation gates, resume-behavior, and review-or-confirm steps — all with signal-based primitives.

**[Deep package notes](docs/packages/angular-wizard-state.md)** · **[Demo](/packages/angular-wizard-state/demo)**

---

## Problem

Business apps frequently model multi-step flows — create an entity, import data, onboard a user. Every team rebuilds the same step-tracking, validation-gating, back/next/skip navigation, and resume-from-interruption logic.

**`@hexguard/angular-wizard-state`** standardizes this into one injectable contract with step lifecycle hooks, per-step validation gates, conditional visibility, and optional storage adapters.

## Installation

```bash
pnpm add @hexguard/angular-wizard-state
```

## Quickstart

```typescript
import { Component, signal } from '@angular/core';
import { injectWizardState } from '@hexguard/angular-wizard-state';
import type { WizardStep } from '@hexguard/angular-wizard-state';

const steps: readonly WizardStep[] = [
  { id: 'details', title: 'Details' },
  { id: 'config', title: 'Configuration', validate: configValid },
  { id: 'review', title: 'Review' },
];

const wizard = injectWizardState({ steps });

wizard.next(); // advances if canGoNext
wizard.back(); // goes back
wizard.finish(); // marks complete
wizard.cancel(); // cancels
wizard.reset(); // back to step 0
```

## Use Cases

### Conditional step skipping

```typescript
const isPremiumUser = signal(false);

const steps: readonly WizardStep[] = [
  { id: 'details', title: 'Details' },
  { id: 'billing', title: 'Billing', canShow: isPremiumUser.asReadonly() },
  { id: 'review', title: 'Review' },
];
// Billing step is automatically skipped for non-premium users.
```

### Resumable wizard with storage adapter

```typescript
const storage: WizardStorage = {
  save: (s) => sessionStorage.setItem('wizard', JSON.stringify(s)),
  restore: () => JSON.parse(sessionStorage.getItem('wizard') ?? 'null'),
  clear: () => sessionStorage.removeItem('wizard'),
};

const wizard = injectWizardState({ steps, storage });
// Progress is saved on each step change and restored on re-initialization.
```

## API

### `injectWizardState(options)`

| Signal         | Type                         | Description                        |
| -------------- | ---------------------------- | ---------------------------------- |
| `currentStep`  | `Signal<WizardStep \| null>` | Current step definition            |
| `currentIndex` | `Signal<number>`             | Current step index (visible steps) |
| `isFirst`      | `Signal<boolean>`            | True if on first visible step      |
| `isLast`       | `Signal<boolean>`            | True if on last visible step       |
| `canGoNext`    | `Signal<boolean>`            | False when validation gate fails   |
| `canGoBack`    | `Signal<boolean>`            | False on first step                |
| `progress`     | `Signal<number>`             | 0–100 progress percentage          |
| `isFinished`   | `Signal<boolean>`            | True after `finish()`              |

| Method         | Description                                     |
| -------------- | ----------------------------------------------- |
| `next()`       | Advance to next step (no-op if canGoNext false) |
| `back()`       | Go to previous step                             |
| `goToStep(id)` | Jump to a specific step by ID                   |
| `skip()`       | Skip current step (bypasses validation)         |
| `finish()`     | Complete wizard, fires onFinish                 |
| `cancel()`     | Cancel wizard, fires onCancel                   |
| `reset()`      | Return to step 0, clear storage                 |

### `WizardStep`

| Field          | Type              | Description                       |
| -------------- | ----------------- | --------------------------------- |
| `id`           | `string`          | Unique step identifier            |
| `title`        | `string`          | Display title                     |
| `validate?`    | `Signal<boolean>` | Blocks next() when false          |
| `canShow?`     | `Signal<boolean>` | Hides step when false (auto-skip) |
| `onStepEnter?` | `() => void`      | Called when entering this step    |
| `onStepLeave?` | `() => void`      | Called when leaving this step     |

## Scope Boundaries

| Concern                                  | Status                      |
| ---------------------------------------- | --------------------------- |
| Linear and conditional step progression  | ✅                          |
| Per-step validation gates                | ✅                          |
| Step lifecycle hooks                     | ✅                          |
| Storage adapter for resumability         | ✅                          |
| Dynamic step addition/removal at runtime | ❌ (steps defined upfront)  |
| Multi-page wizards across routes         | ❌ (single-page flows only) |

## Demo

Visit `/packages/angular-wizard-state/demo` for an interactive three-step wizard with validation gates and progress tracking.
