---
id: feature-angular-subscription
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-subscription'
---

# @hexguard/angular-subscription

## Summary

Headless subscription & billing state — plan display, plan selection, trial management, usage meters, billing history. **The #1 missing package for B2B SaaS.** Every SaaS app needs subscription management UI state.

**Composes with** `angular-payment` for checkout, `angular-feature-flags` for plan-gated features.

## Proposed Public API

```typescript
export interface SubscriptionPlan {
  id: string; name: string; price: number; currency: string;
  interval: 'month' | 'year'; features: string[];
  limits: Record<string, number>; isCurrent: boolean; isRecommended?: boolean;
}

export function injectSubscription(config: { endpoint: string }): {
  readonly currentPlan: Signal<SubscriptionPlan | null>;
  readonly plans: Signal<SubscriptionPlan[]>;
  readonly isTrialing: Signal<boolean>; readonly trialDaysLeft: Signal<number>;
  readonly usage: Signal<Record<string, { used: number; limit: number }>>;
  readonly billingHistory: Signal<BillingInvoice[]>;
  readonly isLoading/isChanging/error: Signal<boolean>;
  readonly cancellationDate: Signal<Date | null>;
  changePlan(planId: string): Promise<void>;
  cancelSubscription(reason?: string): Promise<void>;
  resumeSubscription(): Promise<void>;
};

export interface BillingInvoice {
  id: string; amount: number; currency: string;
  status: 'paid' | 'open' | 'overdue'; periodStart: Date; periodEnd: Date; pdfUrl?: string;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-subscription/`.
2. Implement plan state, trial tracking, usage, billing history as signals.
3. Add tests.
4. Register in workspace.
