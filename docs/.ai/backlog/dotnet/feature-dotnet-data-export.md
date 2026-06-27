---
id: feature-dotnet-data-export
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.DataExport'
---

# HexGuard.DataExport

## Summary

User data export generation for .NET — aggregate user data across services, package as downloadable archive, and manage export lifecycle. Backend for "Download My Data" features and GDPR portability.

## Goals

- Export job creation with format selection (JSON, CSV, PDF)
- Multi-source data aggregation across registered providers
- Export packaging as ZIP archive
- Export lifecycle management (queued → processing → ready → downloaded → expired)
- Auto-expiry after configurable duration
- Size estimation before generation
- Secure download with one-time tokens
- Export notification hooks

## Non-Goals

- No UI rendering
- No data anonymization
- No retention policy enforcement

## Proposed Public API

```csharp
public interface IDataExportService
{
    Task<ExportJob> RequestAsync(string userId, ExportRequest request, CancellationToken ct = default);
    Task<ExportJob?> GetStatusAsync(string exportId, CancellationToken ct = default);
    Task<IReadOnlyList<ExportJob>> GetHistoryAsync(string userId, CancellationToken ct = default);
    Task<ExportDownload> GetDownloadAsync(string exportId, string token, CancellationToken ct = default);
    Task<ExportSizeEstimate> EstimateSizeAsync(string userId, CancellationToken ct = default);
    Task CancelAsync(string exportId, CancellationToken ct = default);
    Task ExpireOldExportsAsync(CancellationToken ct = default);
}

public sealed record ExportRequest(
    ExportFormat Format = ExportFormat.Json,
    string[]? SourceNames = null
);

public enum ExportFormat { Json, Csv, Pdf }

public sealed record ExportJob(
    string Id,
    string UserId,
    ExportFormat Format,
    ExportJobStatus Status,
    DateTimeOffset RequestedAt,
    DateTimeOffset? CompletedAt,
    DateTimeOffset ExpiresAt,
    long? SizeBytes,
    string? DownloadToken
);

// Data provider registration
public interface IExportDataProvider
{
    string ProviderName { get; }
    Task<Stream> CollectDataAsync(string userId, ExportFormat format, CancellationToken ct = default);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.DataExport/` with `.csproj`.
2. Implement job management, provider aggregation, ZIP packaging, secure download.
3. Add auto-expiry background service.
4. Add xunit tests. Register in `HexGuard.slnx`.
