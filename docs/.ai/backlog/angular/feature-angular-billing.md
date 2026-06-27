---
id: feature-angular-billing
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-billing'
---

# @hexguard/angular-billing

## Summary

Headless billing and subscription state — plan management, usage metering, billing history, payment methods, and invoice access. For SaaS subscription management and usage-based billing portals.

## Goals

- Current plan display with feature breakdown
- Plan comparison and upgrade/downgrade flow
- Usage metering display (API calls, storage, seats)
- Usage alerts at thresholds (80%, 90%, 100%)
- Billing history with invoice download
- Payment method management (add, update, remove, set default)
- Upcoming invoice preview
- Trial status with expiry countdown
- Billing address management

## Non-Goals

- No payment processing
- No actual plan enforcement
- No rendered billing UI

## Proposed Public API

```typescript
export function injectBilling(config: {
  endpoint: string;
}): {
  readonly currentPlan: Signal<Plan | null>;
  readonly plans: Signal<Plan[]>;
  readonly usage: Signal<UsageMetrics>;
  readonly usageAlerts: Signal<UsageAlert[]>;
  readonly billingHistory: Signal<BillingRecord[]>;
  readonly paymentMethods: Signal<PaymentMethod[]>;
  readonly upcomingInvoice: Signal<UpcomingInvoice | null>;
  readonly trialEndsAt: Signal<Date | null>;
  readonly isLoading/submitting: Signal<boolean>;
  // Plan
  changePlan(planId: string): Promise<void>;
  cancelSubscription(reason?: string): Promise<void>;
  reactivateSubscription(): Promise<void>;
  // Payment
  addPaymentMethod(method: NewPaymentMethod): Promise<void>;
  removePaymentMethod(id: string): Promise<void>;
  setDefaultPaymentMethod(id: string): Promise<void>;
  // Invoices
  downloadInvoice(invoiceId: string): Promise<void>;
};

export interface Plan { id: string; name: string; price: number; currency: string; interval: 'month' | 'year'; features: string[]; limits: Record<string, number>; }
export interface UsageMetrics { [metric: string]: { used: number; limit: number; unit: string }; }
export interface UsageAlert { metric: string; percentUsed: number; severity: 'warning' | 'critical'; }
export interface BillingRecord { id: string; date: Date; amount: number; currency: string; status: 'paid' | 'pending' | 'failed'; invoiceUrl?: string; }
export interface UpcomingInvoice { amount: number; currency: string; date: Date; lineItems: { description: string; amount: number }[]; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-billing/`.
2. Implement plan management, usage display, billing history, payment methods with signals.
3. Add usage alerts and trial tracking.
4. Add tests. Register in workspace.
