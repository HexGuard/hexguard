---
id: feature-angular-checkout
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-checkout'
---

# @hexguard/angular-checkout

## Summary

Headless checkout flow state â€” address â†’ shipping â†’ payment â†’ review â†’ confirmation. Multi-step with per-step validation, persistence, and composable with `angular-cart` and `angular-payment`. **Essential for e-commerce.**


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export interface CheckoutStep { id: string; label: string; validate?: (data: Record<string, unknown>) => string[]; }

export function injectCheckout(config: {
  steps: CheckoutStep[];
  onSubmit: (data: CheckoutData) => Promise<CheckoutResult>;
  persistKey?: string;
}): {
  readonly currentStep: Signal<number>; readonly step: Signal<CheckoutStep>;
  readonly isFirstStep/isLastStep/isValid/isSubmitting/error: Signal<boolean>;
  readonly result: Signal<CheckoutResult | null>;
  next(): void; prev(): void; goToStep(i: number): void;
  updateData(id: string, data: Record<string, unknown>): void; submit(): Promise<void>; reset(): void;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-checkout/`.
2. Implement multi-step flow, validation, persistence.
3. Add tests. Register in workspace.
