---
id: feature-angular-confirmation
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-confirmation'
---

# Angular Confirmation Package

## Summary

Design `@hexguard/angular-confirmation` as a headless Angular package for standardizing confirm,
cancel, and confirm-and-run flows for destructive or high-impact actions.

The repeated problem is that apps keep rebuilding small confirmation dialogs, unsafe delete flows,
and “are you sure?” action wrappers with inconsistent behavior and testing quality.

## Goals

- Standardize confirmation flow contracts without requiring one dialog UI library.
- Support simple confirm/cancel flows and confirm-then-run async actions.
- Compose with async-action state instead of duplicating request lifecycle state.
- Keep the core package headless and provider-driven.

## Non-Goals

- Shipping a mandatory modal or overlay design system.
- Replacing async-state or submit-lock.
- Handling every multi-step wizard or approval workflow in v0.1.

## Decisions

- Prefer a headless confirm contract first.
- Keep UI adapters optional.
- Treat destructive-action ergonomics as a narrow concern rather than a full workflow engine.

## Proposed Public API

```ts
import { injectConfirmation } from '@hexguard/angular-confirmation';

const confirm = injectConfirmation();

// Simple confirm
const ok: boolean = await confirm.ask({
  title: 'Delete order?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  destructive: true,
});

// Confirm and run async action
const result = await confirm.run({ title: 'Archive?', message: 'Archive this record?' }, async () =>
  archiveService.archive(recordId),
);
// → { confirmed: true, result: ... } | { confirmed: false }

// Reactive state
confirm.isOpen; // Signal<boolean>
confirm.currentRequest; // Signal<ConfirmationRequest | null>
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-confirmation/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `ConfirmationRequest`, `ConfirmationResult` types.
4. Implement `ConfirmationService` with `ask()` returning `Promise<boolean>`.
5. Implement `run()` — composes `ask()` with async action execution.
6. Implement provider surface for app-specific dialog rendering.
7. Implement duplicate-open prevention — reject new request if one is open.
8. Add unit tests for: confirm accept, confirm reject, async run success/failure, duplicate-open rejection, cancellation.

### Phase 2: Demo & Docs

9. Add demo route with delete, archive, and reset confirmation flows.
10. Add Playwright coverage.
11. Write docs.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:confirmation`.
- `pnpm test:e2e`.

## Validation

- Unit tests for confirmation outcomes and action composition.
- Demo coverage for destructive-action confirmation.
- Manual checks for cancellation and retry behavior.

## Follow-Ups

- Revisit whether an optional shared confirmation UI belongs in a companion package.
- Evaluate overlap with command-palette or page-context action systems only after the headless core settles.
