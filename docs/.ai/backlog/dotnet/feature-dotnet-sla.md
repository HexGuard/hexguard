---
id: feature-dotnet-sla
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Sla'
---

# HexGuard.Sla

## Summary

SLA tracking and enforcement for .NET — define service level agreements, track compliance, detect breaches, and generate SLA reports. For API platforms, enterprise services, and support contracts.

## Goals

- SLA definition (uptime, response time, resolution time)
- SLA assignment per customer/tenant/service tier
- Real-time SLA compliance monitoring
- Breach detection with severity levels
- SLA credit calculation (automatic refund for breaches)
- SLA reporting (monthly/quarterly compliance reports)
- Maintenance window management (exclude from SLA)
- SLA dashboard data aggregation

## Non-Goals

- No monitoring/infrastructure integration (receives metrics)
- No alerting (integrates with notifications)
- No UI rendering

## Proposed Public API

```csharp
public interface ISlaService
{
    Task<SlaDefinition> DefineAsync(SlaDefinition definition, CancellationToken ct = default);
    Task<SlaDefinition?> GetDefinitionAsync(string slaId, CancellationToken ct = default);
    Task<IReadOnlyList<SlaDefinition>> GetDefinitionsAsync(CancellationToken ct = default);
    Task AssignAsync(string customerId, string slaId, CancellationToken ct = default);
    // Monitoring
    Task RecordMetricAsync(SlaMetric metric, CancellationToken ct = default);
    Task<IReadOnlyList<SlaBreach>> GetActiveBreachesAsync(string? customerId = null, CancellationToken ct = default);
    Task<SlaComplianceReport> GetComplianceReportAsync(SlaReportQuery query, CancellationToken ct = default);
    // Maintenance
    Task ScheduleMaintenanceAsync(MaintenanceWindow window, CancellationToken ct = default);
    Task<bool> IsInMaintenanceAsync(CancellationToken ct = default);
}

public sealed record SlaDefinition(
    string Id,
    string Name,
    decimal UptimePercent,
    int ResponseTimeMs,
    int ResolutionTimeMinutes,
    SlaSeverity Severity
);

public enum SlaSeverity { Critical, High, Medium, Low }

public sealed record SlaMetric(
    string CustomerId,
    string SlaId,
    SlaMetricType Type,
    double Value,
    DateTimeOffset Timestamp,
    string? Source = null
);

public enum SlaMetricType { Uptime, ResponseTime, ResolutionTime, ErrorRate }

public sealed record SlaBreach(
    string Id,
    string CustomerId,
    string SlaId,
    SlaMetricType Metric,
    double Threshold,
    double Actual,
    DateTimeOffset DetectedAt,
    SlaSeverity Severity,
    bool IsActive
);

public sealed record SlaComplianceReport(
    string CustomerId,
    DateTimeOffset PeriodStart,
    DateTimeOffset PeriodEnd,
    decimal UptimePercent,
    double AvgResponseTimeMs,
    int BreachCount,
    decimal CreditAmount
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Sla/` with `.csproj`.
2. Implement SLA definition, metric recording, breach detection, compliance reporting.
3. Add maintenance window management and credit calculation.
4. Add xunit tests. Register in `HexGuard.slnx`.
