---
id: feature-inventory-cross-stack
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Inventory + @hexguard/angular-inventory'
---

# Inventory Management Cross-Stack Pair

## Summary

Server-side inventory tracking engine + client-side inventory management dashboard.

### .NET (`HexGuard.Inventory`)
Item/SKU management, stock movements (receiving, shipping, transfer, adjustment), reservations with expiry, low-stock alerts, batch/lot tracking with FIFO/FEFO, cycle counts, EF Core concurrency.

### Angular (`@hexguard/angular-inventory`)
Item list with stock levels, location breakdown, movement history, low-stock alerts, cycle count sessions, SKU search, stock adjustment workflow, reservation tracking.

### Integration Contract
```typescript
interface InventoryEndpoints {
  'POST /api/inventory/items': { body: CreateItemRequest; response: InventoryItem };
  'GET /api/inventory/items': { params: ItemQuery; response: InventoryItem[] };
  'GET /api/inventory/items/{id}': { response: InventoryItem };
  'PUT /api/inventory/items/{id}': { body: UpdateItemRequest; response: InventoryItem };
  'POST /api/inventory/adjust': { body: StockAdjustment; response: StockMovement };
  'POST /api/inventory/transfer': { body: StockTransfer; response: StockMovement };
  'GET /api/inventory/movements': { params: MovementQuery; response: StockMovement[] };
  'POST /api/inventory/reserve': { body: ReservationRequest; response: StockReservation };
  'DELETE /api/inventory/reserve/{id}': { response: void };
  'GET /api/inventory/alerts': { response: InventoryAlert[] };
  'POST /api/inventory/cycle-count/start': { body: { locationId: string }; response: CycleCountSession };
  'POST /api/inventory/cycle-count/{id}/submit': { body: CountEntry[]; response: CycleCountSession };
}
```
