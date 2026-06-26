---
id: feature-angular-cart
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-cart'
---

# @hexguard/angular-cart

## Summary

Cart/basket state for Angular — add/remove/update items, quantities, subtotal/tax/total calculations, discount support, localStorage persistence. Distinct from `angular-selection-state` (checkbox selection) — this is e-commerce cart semantics.

**Competition check:** No headless Angular cart state package exists. Every e-commerce app rebuilds this.

## Goals

1. Provide `injectCart()` — cart/basket state with items, quantities, totals.
2. Calculate subtotal, tax, total, discount automatically.
3. Support add/remove/updateQuantity/clear operations.
4. Support localStorage persistence.
5. Support discount code application.

## Proposed Public API

```typescript
export interface CartItem {
  id: string; name: string; price: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export function injectCart(config?: {
  persistKey?: string;
  taxRate?: number;
  maxQuantityPerItem?: number;
}): {
  readonly items: Signal<CartItem[]>;
  readonly count: Signal<number>;
  readonly subtotal: Signal<number>;
  readonly tax: Signal<number>;
  readonly total: Signal<number>;
  readonly discount: Signal<number>;
  readonly isEmpty: Signal<boolean>;

  add(item: Omit<CartItem, 'quantity'>, qty?: number): void;
  updateQuantity(id: string, qty: number): void;
  remove(id: string): void;
  clear(): void;
  applyDiscount(code: string, percentage: number): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-cart/`.
2. Implement cart state with computed totals.
3. Add localStorage persistence.
4. Add tests.
5. Register in workspace.
