---
id: feature-subscription-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Subscription + @hexguard/angular-subscription'
---

# Subscription Cross-Stack Package Pair

## Summary

**The #1 missing cross-stack pair for B2B SaaS.** Server-side subscription engine + client-side subscription state sharing the same plan, usage, and billing contracts.

### .NET (`HexGuard.Subscription`)
Plan engine, usage tracking, tiered limits, Stripe/Paddle adapters, auto-mapped endpoints.

### Angular (`@hexguard/angular-subscription`)
Plan display, trial tracking, usage meters, billing history, plan change flow.

## Shared Contract
```csharp
// Server returns this shape — client consumes it
public sealed record SubscriptionState
{
    public SubscriptionPlan? CurrentPlan { get; init; }
    public IReadOnlyList<SubscriptionPlan> AvailablePlans { get; init; }
    public bool IsTrialing { get; init; }
    public int TrialDaysLeft { get; init; }
    public UsageReport? Usage { get; init; }
    public IReadOnlyList<BillingInvoice> History { get; init; }
}
```
