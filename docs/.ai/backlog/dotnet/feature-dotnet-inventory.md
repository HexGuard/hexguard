---
id: feature-dotnet-inventory
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Inventory'
---

# HexGuard.Inventory

## Summary

Inventory tracking engine for .NET — stock management, location tracking, movements, reservations, and replenishment. Backend for warehouse and e-commerce inventory systems.

## Goals

- Item/SKU definition with stock tracking across locations
- Stock movement recording (receiving, shipping, adjustment, transfer)
- Stock reservation with expiry (auto-release abandoned reservations)
- Low-stock threshold monitoring and alert generation
- Batch/lot tracking with expiry date enforcement (FIFO/FEFO)
- Cycle count sessions with discrepancy tracking
- Reorder point calculation and replenishment suggestions
- Barcode/SKU lookup
- Audit trail for all stock changes

## Non-Goals

- No purchase order management
- No supplier management
- No demand forecasting

## Proposed Public API

```csharp
public interface IInventoryService
{
    Task<InventoryItem> CreateItemAsync(CreateItemRequest request, CancellationToken ct = default);
    Task<InventoryItem?> GetItemAsync(string itemId, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryItem>> QueryItemsAsync(ItemQuery query, CancellationToken ct = default);
    Task<InventoryItem> UpdateItemAsync(string itemId, UpdateItemRequest request, CancellationToken ct = default);
    // Stock movements
    Task<StockMovement> AdjustStockAsync(StockAdjustment adjustment, CancellationToken ct = default);
    Task<StockMovement> TransferStockAsync(StockTransfer transfer, CancellationToken ct = default);
    Task<IReadOnlyList<StockMovement>> GetMovementsAsync(MovementQuery query, CancellationToken ct = default);
    // Reservations
    Task<StockReservation> ReserveStockAsync(ReservationRequest request, CancellationToken ct = default);
    Task ReleaseReservationAsync(string reservationId, CancellationToken ct = default);
    Task<IReadOnlyList<StockReservation>> GetExpiredReservationsAsync(CancellationToken ct = default);
    // Alerts
    Task<IReadOnlyList<InventoryAlert>> GetAlertsAsync(string? locationId = null, CancellationToken ct = default);
    // Cycle count
    Task<CycleCountSession> StartCycleCountAsync(string locationId, CancellationToken ct = default);
    Task<CycleCountSession> SubmitCountAsync(string sessionId, IReadOnlyList<CountEntry> entries, CancellationToken ct = default);
}

public sealed record CreateItemRequest(string Sku, string Name, string Category, string Unit, int ReorderPoint = 0, int ReorderQuantity = 0);
public sealed record StockAdjustment(string ItemId, int Quantity, string Reason, string? LocationId = null, string? BatchNumber = null);
public sealed record StockTransfer(string ItemId, int Quantity, string FromLocationId, string ToLocationId);

public enum StockMovementType { Receiving, Shipping, Adjustment, Transfer, CycleCount }

// Registration
public static IServiceCollection AddHexGuardInventory(this IServiceCollection services, Action<InventoryOptions>? configure = null);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Inventory/` with `.csproj`.
2. Implement item management, stock movements, reservations, cycle count, alerts.
3. Add EF Core persistence with concurrency control for stock updates.
4. Add xunit tests. Register in `HexGuard.slnx`.
