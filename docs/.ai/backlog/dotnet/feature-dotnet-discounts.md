---
id: feature-dotnet-discounts
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Discounts
---

# HexGuard.Discounts

## Summary

Discount/coupon engine — coupon codes, percentage/fixed discounts, usage limits, time-bound promos, minimum order thresholds. Pairs with `@hexguard/angular-discount`.

## Proposed Public API

```csharp
public interface IDiscountService
{
    Task<DiscountValidation> ValidateAsync(string code, Cart cart, CancellationToken ct);
    Task<DiscountApplication> ApplyAsync(string code, Cart cart, CancellationToken ct);
}

public sealed record DiscountValidation { bool IsValid { get; init; } string? Error { get; init; } DiscountInfo? Discount { get; init; } }

builder.Services.AddDiscountEngine(options => {
    options.DefaultCoupons.Add(new() { Code = "WELCOME10", Type = DiscountType.Percentage, Value = 10, MaxUses = 1000 });
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Discounts/`.
2. Implement coupon engine with usage tracking.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
