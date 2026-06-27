---
id: feature-dotnet-orders
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Orders
---

# HexGuard.Orders

## Summary

Order lifecycle engine — status state machine (pending→confirmed→shipped→delivered→returned), fulfillment, inventory reservation, tracking integration. Pairs with `@hexguard/angular-orders`.

## Proposed Public API

```csharp
public enum OrderStatus { Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned }

public interface IOrderService
{
    Task<Order> CreateAsync(CheckoutResult checkout, CancellationToken ct);
    Task<Order> UpdateStatusAsync(string orderId, OrderStatus status, CancellationToken ct);
    Task<Order> AddTrackingAsync(string orderId, TrackingInfo tracking, CancellationToken ct);
    Task<Order> ProcessReturnAsync(string orderId, ReturnRequest request, CancellationToken ct);
}

builder.Services.AddOrderEngine();
app.MapOrderEndpoints("/api/orders");
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Orders/`.
2. Implement state machine, fulfillment, tracking, returns.
3. Add auto-endpoints. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
