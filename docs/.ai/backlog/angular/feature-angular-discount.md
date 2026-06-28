---
id: feature-angular-discount
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-discount'
---

# @hexguard/angular-discount

## Summary

Headless discount/coupon state â€” coupon code input, validation feedback, applied discount display. Composible with `angular-cart`.


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
export function injectDiscount(config: { endpoint: string }): {
  readonly applied: Signal<AppliedDiscount | null>;
  readonly isValidating/isApplying/error: Signal<boolean>;
  validateCode(code: string): Promise<DiscountInfo | null>;
  applyCode(code: string): Promise<void>;
  removeDiscount(): void;
};

export interface DiscountInfo { code: string; description: string; type: 'percentage' | 'fixed'; value: number; }
export interface AppliedDiscount extends DiscountInfo { discountedAmount: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-discount/`.
2. Implement validation, application, removal state with signals.
3. Add tests. Register in workspace.
