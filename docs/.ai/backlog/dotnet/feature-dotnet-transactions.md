---
id: feature-dotnet-transactions
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Transactions
---

# HexGuard.Transactions

## Summary

Financial transaction processing engine — ledger entries, reconciliation, balance calculation. Pairs with `@hexguard/angular-transactions`.

## Proposed Public API

```csharp
public interface ITransactionService
{
    Task<Transaction> RecordAsync(TransactionEntry entry, CancellationToken ct);
    Task<Transaction> ReconcileAsync(string transactionId, CancellationToken ct);
    Task<Balance> GetBalanceAsync(string accountId, DateTime? asOf = null, CancellationToken ct = default);
    Task<IReadOnlyList<Transaction>> QueryAsync(TransactionQuery query, CancellationToken ct);
}

builder.Services.AddTransactionEngine();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Transactions/`.
2. Implement ledger, reconciliation, balance calculation.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
