---
id: feature-angular-orders
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-orders'
---

# @hexguard/angular-orders

## Summary

Headless order management state — order list, detail, tracking, returns, cancellations. Essential for e-commerce post-purchase experience.

## Proposed Public API

```typescript
export function injectOrders(config: { endpoint: string }): {
  readonly orders: Signal<Order[]>;
  readonly selectedOrder: Signal<Order | null>;
  readonly isLoading/error: Signal<boolean>;
  loadOrders(): Promise<void>; getOrder(id: string): Promise<void>;
  cancelOrder(id: string, reason?: string): Promise<void>;
  requestReturn(id: string, items: string[], reason: string): Promise<void>;
};

export interface Order { id: string; status: string; items: OrderItem[]; total: number; tracking?: TrackingInfo; createdAt: Date; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-orders/`.
2. Implement order list, detail, cancellation, returns state.
3. Add tests. Register in workspace.
