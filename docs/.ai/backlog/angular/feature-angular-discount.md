---
id: feature-angular-discount
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-discount'
---

# @hexguard/angular-discount

## Summary

Headless discount/coupon state — coupon code input, validation feedback, applied discount display. Composible with `angular-cart`.

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
