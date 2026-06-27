---
id: feature-angular-transactions
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-transactions'
---

# @hexguard/angular-transactions

## Summary

Financial transaction state — list, detail, reconciliation, filtering, statement export. Pairs with `HexGuard.Transactions`.

## Proposed Public API

```typescript
export function injectTransactions(config: { endpoint: string }): {
  readonly transactions: Signal<Transaction[]>;
  readonly selected: Signal<Transaction | null>;
  readonly summary: Signal<{ total: number; count: number; fees: number }>;
  readonly filters: Signal<TransactionFilters>;
  readonly isLoading/error: Signal<boolean>;
  setFilters(f: Partial<TransactionFilters>): void;
  reconcile(id: string): Promise<void>;
  exportStatement(from: Date, to: Date, format: 'pdf' | 'csv'): Promise<void>;
};

export interface TransactionFilters { dateFrom?: Date; dateTo?: Date; type?: string; status?: string; minAmount?: number; maxAmount?: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-transactions/`.
2. Implement list, detail, filtering, reconciliation, export with signals.
3. Add tests. Register in workspace.
