# Changelog

## 0.1.0 — 2026-06-23

Initial release of `@hexguard/angular-wizard-state`.

### Features

- `injectWizardState()` — headless multi-step flow state
- Linear and conditional step progression
- Per-step validation gates via `Signal<boolean>`
- `currentStep`, `currentIndex`, `isFirst`, `isLast`, `canGoNext`, `canGoBack`, `progress`, `isFinished` signals
- `next()`, `back()`, `goToStep()`, `skip()`, `finish()`, `cancel()`, `reset()` methods
- Step lifecycle hooks: `onStepEnter`, `onStepLeave`, `onFinish`, `onCancel`
- Storage adapters for resumability
