---
id: feature-dotnet-access-log
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.AccessLog'
---

# HexGuard.AccessLog

## Summary

Access logging for .NET — record every data access event with user, action, timestamp, and context. For audit compliance, access transparency, and anomaly detection. Backend for "Who Viewed My Data" features.

## Goals

- Automatic access logging middleware (capture all API reads/writes)
- Structured access log entries (user, action, data type, data ID, IP, user agent)
- Access log querying with filters (user, date range, data type, action)
- Anomaly detection signals (unusual location, off-hours, bulk access)
- Access log retention and archiving
- Export for compliance audits (CSV, PDF)
- Geo-IP enrichment for location data
- Low-overhead async logging

## Non-Goals

- No real-time alerting on anomalies
- No access control enforcement
- No session recording

## Proposed Public API

```csharp
public interface IAccessLogService
{
    Task LogAsync(AccessLogEntry entry, CancellationToken ct = default);
    Task<IReadOnlyList<AccessLogEntry>> QueryAsync(AccessLogQuery query, CancellationToken ct = default);
    Task<long> CountAsync(AccessLogQuery query, CancellationToken ct = default);
    Task<IReadOnlyList<AccessAnomaly>> DetectAnomaliesAsync(string userId, CancellationToken ct = default);
    Task<Stream> ExportAsync(AccessLogQuery query, ExportFormat format, CancellationToken ct = default);
    Task ArchiveAsync(DateTimeOffset before, CancellationToken ct = default);
}

public sealed record AccessLogEntry(
    string UserId,
    string UserName,
    AccessAction Action,
    string DataType,
    string? DataId,
    string IpAddress,
    string? UserAgent,
    string? Reason,
    DateTimeOffset Timestamp,
    AccessLocation? Location
);

public enum AccessAction { Read, Write, Delete, Export, Search }

public sealed record AccessLogQuery(
    string? UserId = null,
    string? DataType = null,
    AccessAction? Action = null,
    DateTimeOffset? From = null,
    DateTimeOffset? To = null,
    int Skip = 0,
    int Take = 50
);

// Automatic middleware
public static IApplicationBuilder UseAccessLogging(this IApplicationBuilder app,
    Action<AccessLogOptions>? configure = null);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.AccessLog/` with `.csproj`.
2. Implement logging middleware, query service, anomaly detection, export.
3. Add geo-IP enrichment and archiving background service.
4. Add xunit tests. Register in `HexGuard.slnx`.
