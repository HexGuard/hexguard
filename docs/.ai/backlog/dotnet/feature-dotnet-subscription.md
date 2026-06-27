---
id: feature-dotnet-subscription
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Subscription
---

# HexGuard.Subscription

## Summary

Subscription & billing engine — plan definitions, feature limits, usage tracking, billing period management, invoice generation. Pairs with `@hexguard/angular-subscription` and payment providers (Stripe, Paddle).

## Proposed Public API

```csharp
public interface ISubscriptionService
{
    Task<SubscriptionPlan?> GetCurrentAsync(string tenantId, CancellationToken ct);
    Task<IReadOnlyList<SubscriptionPlan>> GetPlansAsync(CancellationToken ct);
    Task ChangePlanAsync(string tenantId, string planId, CancellationToken ct);
    Task CancelAsync(string tenantId, string? reason, CancellationToken ct);
    Task RecordUsageAsync(string tenantId, string metric, long count, CancellationToken ct);
    Task<UsageReport> GetUsageAsync(string tenantId, CancellationToken ct);
}

builder.Services.AddSubscriptionEngine<StripePaymentProvider>(options => {
    options.TrialDays = 14;
    options.Plans = [ new() { Id = "pro", Name = "Pro", Price = 29, Features = ["api"] } ];
});
app.MapSubscriptionEndpoints("/api/subscription");
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Subscription/`.
2. Implement plan engine, usage tracking, Stripe/Paddle adapters.
3. Add auto-mapped endpoints. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
