---
id: feature-angular-inventory
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-inventory'
---

# @hexguard/angular-inventory

## Summary

Headless inventory management state — stock levels, movements, locations, low-stock alerts, and replenishment. For warehouse management, e-commerce stock tracking, and asset inventory.

## Goals

- Inventory item list with stock levels and locations
- Stock movement tracking (in/out/adjustment/transfer)
- Low-stock threshold alerts with severity levels
- Location management (warehouse, shelf, bin)
- Batch/lot tracking with expiry dates
- Stock reservation (reserve items during checkout)
- Replenishment suggestions based on reorder points
- Inventory audit/cycle count state
- SKU/barcode search

## Non-Goals

- No rendered inventory UI
- No barcode scanning hardware integration
- No purchase order management

## Proposed Public API

```typescript
export function injectInventory(config: {
  endpoint: string;
}): {
  readonly items: Signal<InventoryItem[]>;
  readonly selectedItem: Signal<InventoryItem | null>;
  readonly movements: Signal<StockMovement[]>;
  readonly lowStockItems: Signal<InventoryItem[]>;
  readonly alerts: Signal<InventoryAlert[]>;
  readonly filters: Signal<InventoryFilters>;
  readonly locations: Signal<InventoryLocation[]>;
  readonly isLoading/submitting: Signal<boolean>;
  selectItem(itemId: string | null): void;
  setFilters(f: Partial<InventoryFilters>): void;
  search(query: string): void;
  adjustStock(itemId: string, quantity: number, reason: string, locationId?: string): Promise<void>;
  transferStock(itemId: string, quantity: number, fromLocationId: string, toLocationId: string): Promise<void>;
  reserveStock(itemId: string, quantity: number, referenceId: string): Promise<void>;
  releaseReservation(reservationId: string): Promise<void>;
  startCycleCount(locationId: string): Promise<string>; // returns count session ID
  submitCycleCount(sessionId: string, counts: { itemId: string; counted: number }[]): Promise<void>;
};

export interface InventoryItem {
  id: string; sku: string; name: string; category: string;
  stockByLocation: { locationId: string; locationName: string; quantity: number; reserved: number }[];
  totalStock: number; available: number; reserved: number;
  reorderPoint: number; reorderQuantity: number;
  unit: string; unitCost?: number; lastRestocked?: Date;
  batchInfo?: { batchNumber: string; expiryDate?: Date }[];
}

export interface StockMovement {
  id: string; itemId: string; type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number; fromLocationId?: string; toLocationId?: string;
  reason: string; timestamp: Date; userId: string;
}

export interface InventoryFilters { category?: string; locationId?: string; lowStockOnly?: boolean; search?: string; }
export interface InventoryLocation { id: string; name: string; type: 'warehouse' | 'shelf' | 'bin'; parentId?: string; }
export interface InventoryAlert { itemId: string; itemName: string; type: 'low_stock' | 'out_of_stock' | 'expiring'; severity: 'warning' | 'critical'; currentStock: number; threshold: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-inventory/`.
2. Implement item list, stock movements, alerts, locations, reservations with signals.
3. Add cycle count and batch tracking.
4. Add tests. Register in workspace.
