---
id: feature-dotnet-checkout
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Checkout
---

# HexGuard.Checkout

## Summary

Checkout engine — order creation, payment integration, tax calculation, shipping rate resolution. Pairs with `@hexguard/angular-checkout`.

## Proposed Public API

```csharp
public interface ICheckoutService
{
    Task<CheckoutSession> CreateSessionAsync(Cart cart, CancellationToken ct);
    Task<CheckoutSession> UpdateShippingAsync(string sessionId, Address address, CancellationToken ct);
    Task<CheckoutSession> SelectShippingMethodAsync(string sessionId, string methodId, CancellationToken ct);
    Task<CheckoutResult> CompleteAsync(string sessionId, PaymentMethod payment, CancellationToken ct);
}

builder.Services.AddCheckoutEngine(options => {
    options.TaxCalculator = new StripeTaxCalculator();
    options.ShippingProvider = new EasyPostProvider();
});
app.MapCheckoutEndpoints("/api/checkout");
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Checkout/`.
2. Implement session management, tax, shipping, payment integration.
3. Add auto-endpoints. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
