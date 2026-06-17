---
id: feature-angular-tour
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-tour'
---

# Angular Tour Package

## Summary

Design `@hexguard/angular-tour` as a headless Angular package for standardizing product tour and onboarding step state with configurable step progression, dismissal persistence, optional spotlight positioning calculations, and composition with feature-flags for gated tours.

The repeated problem is that business applications commonly need first-run experiences — a 3-5 step product tour highlighting key features on initial login, or a what's-new announcement after an update. Every team rebuilds the same step-tracking, dismissal persistence, progress indicators, and skip/last/next logic.

## Goals

- Provide `injectTour(config)` returning step-by-step tour state with signals for current step, total steps, isActive, and isCompleted.
- Support linear and non-linear step progression.
- Support dismissal persistence via optional storage adapter: "don't show again" suppresses the tour across sessions.
- Support tour gating via an optional `canShow` signal — compose with feature-flags or permissions.
- Provide step lifecycle hooks: `onStepEnter`, `onStepExit`, `onComplete`, `onDismiss`.
- Provide a `TourStep` model with id, title, description, optional target element selector, and placement hint.
- Keep the core headless — no overlay UI, no spotlight rendering, no tooltip components.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Overlay, spotlight, or tooltip rendering — those belong in a companion UI package.
- Step animation or scroll-into-view logic — the consumer positions their own tooltip.
- Tour-authoring UI or drag-to-reorder step management.
- Multi-step form or wizard workflows — that's wizard-state.

## Decisions

- Keep step state in-memory by default; persistence via an optional `TourStorage` adapter interface.
- Use a flat step array with imperative `next()`/`prev()`/`goToStep(n)` navigation rather than a state machine.
- Provide `canShow` as a `Signal<boolean>` — when false, `start()` becomes a no-op.
- Expose `isCompleted` as a signal that persists once all steps are finished (or the tour is dismissed).
- Default placement hint as a string (`'top' | 'bottom' | 'left' | 'right' | 'center'`) — the consumer maps to CSS.

## Proposed Public API

```ts
import { injectTour, type TourStep } from '@hexguard/angular-tour';

const tour = injectTour({
  steps: [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Here is the dashboard overview.',
      placement: 'center',
    },
    {
      id: 'search',
      title: 'Search',
      description: 'Use the search bar to find orders.',
      target: '#search-input',
      placement: 'bottom',
    },
    {
      id: 'filters',
      title: 'Filters',
      description: 'Filter by status and date range.',
      target: '#filter-panel',
      placement: 'right',
    },
  ],
  canShow: featureFlags.isEnabled('product-tour'), // optional gate
  storage: localStorageTourStorage('product-tour-v1'),
  onComplete: () => console.log('Tour finished'),
  onDismiss: () => console.log('Tour dismissed'),
});

// Signals
tour.isActive; // Signal<boolean>
tour.currentStep; // Signal<TourStep | null>
tour.currentIndex; // Signal<number>
tour.totalSteps; // number
tour.isFirst; // Signal<boolean>
tour.isLast; // Signal<boolean>
tour.progress; // Signal<number> — 0-100
tour.isCompleted; // Signal<boolean>

// Navigation
tour.start();
tour.next();
tour.prev();
tour.goToStep(2);
tour.dismiss(); // marks completed without finishing all steps
tour.reset(); // clears completion state, allows re-show

// Step model
interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlight element
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

// Options
interface TourOptions {
  steps: TourStep[];
  canShow?: Signal<boolean>;
  storage?: TourStorage;
  onStepEnter?: (step: TourStep, index: number) => void;
  onStepExit?: (step: TourStep, index: number) => void;
  onComplete?: () => void;
  onDismiss?: () => void;
}

// Storage adapter
interface TourStorage {
  isCompleted(): boolean;
  markCompleted(): void;
  reset(): void;
}

// Built-in storage
export function localStorageTourStorage(key: string): TourStorage;
export function sessionStorageTourStorage(key: string): TourStorage;
export function memoryTourStorage(): TourStorage;
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-tour/` following existing conventions.
2. Add build and test scripts to `angular/package.json`.

### Phase 1: Core Implementation

3. Implement `TourStep` model and `TourOptions` config interface.
4. Implement `injectTour()` with step state, current index, navigation methods.
5. Implement `progress` derived signal.
6. Implement `canShow` gate — when false, `start()` is a no-op.
7. Implement `TourStorage` interface and built-in adapters (`localStorageTourStorage`, `sessionStorageTourStorage`, `memoryTourStorage`).
8. Implement step lifecycle hooks.
9. Add unit tests for: step progression (next/prev/goTo), boundary behavior (first/last), progress calculation, dismiss, reset, canShow gating, storage persistence, lifecycle hooks, and cleanup.

### Phase 2: Demo & Docs

10. Add a demo route at `/packages/angular-tour` showing:
    - A multi-step product tour highlighting page elements
    - Step progression with next/prev/skip
    - Dismiss and "don't show again" with persistence
    - Feature-flag gating (tour only shows when flag is on)
11. Add Playwright coverage.
12. Write deep-dive doc at `docs/packages/angular-tour.md`.
13. Update npm-facing `README.md`.

### Phase 3: Release

14. Add `verify:package:tour` to `angular/package.json`.
15. Add release workflow.
16. Run `pnpm test:ci` and `pnpm build`.

## Validation

- `pnpm test:lib:tour` — unit tests.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright.
- `pnpm verify:package:tour` — tarball smoke test.
