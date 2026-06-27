---
id: feature-dotnet-billing
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Billing'
---

# HexGuard.Billing

## Summary

Usage metering and billing engine for .NET — track consumption, calculate charges, generate invoices. Backend for SaaS subscription and usage-based billing.

## Goals

- Usage event ingestion and aggregation
- Meter definition (API calls, storage, seats, compute hours)
- Usage querying with time-range aggregation
- Usage alert thresholds
- Plan definition with limits and pricing
- Subscription lifecycle management
- Invoice generation from usage data
- Trial management with expiry
- Payment method storage (tokenized)

## Non-Goals

- No payment gateway integration (webhooks only)
- No tax calculation (delegate to invoicing)
- No billing UI

## Proposed Public API

```csharp
public interface IBillingService
{
    // Usage
    Task IngestUsageAsync(UsageEvent evt, CancellationToken ct = default);
    Task<UsageReport> GetUsageAsync(string customerId, UsageQuery query, CancellationToken ct = default);
    Task<IReadOnlyList<UsageAlert>> GetAlertsAsync(string customerId, CancellationToken ct = default);
    // Plans
    Task<IReadOnlyList<Plan>> GetPlansAsync(CancellationToken ct = default);
    Task<Subscription> SubscribeAsync(string customerId, string planId, CancellationToken ct = default);
    Task<Subscription> ChangePlanAsync(string customerId, string newPlanId, CancellationToken ct = default);
    Task CancelSubscriptionAsync(string customerId, string? reason = null, CancellationToken ct = default);
    // Invoices
    Task<IReadOnlyList<BillingInvoice>> GetInvoicesAsync(string customerId, CancellationToken ct = default);
    Task<Stream> DownloadInvoiceAsync(string invoiceId, CancellationToken ct = default);
}

public sealed record UsageEvent(
    string CustomerId,
    string MeterName,
    double Quantity,
    DateTimeOffset Timestamp,
    Dictionary<string, string>? Properties = null
);

public sealed record UsageQuery(
    DateTimeOffset From,
    DateTimeOffset To,
    string? MeterName = null,
    AggregationPeriod Period = AggregationPeriod.Daily
);

public enum AggregationPeriod { Hourly, Daily, Monthly }

public sealed record UsageReport(
    string CustomerId,
    DateTimeOffset From,
    DateTimeOffset To,
    IReadOnlyList<MeterUsage> Meters
);

public sealed record MeterUsage(string MeterName, double Used, double Limit, string Unit);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Billing/` with `.csproj`.
2. Implement usage ingestion, aggregation, plan management, subscription lifecycle.
3. Add alerting and invoice generation.
4. Add xunit tests. Register in `HexGuard.slnx`.
