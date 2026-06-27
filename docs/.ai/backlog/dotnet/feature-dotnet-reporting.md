---
id: feature-dotnet-reporting
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Reporting
---

# HexGuard.Reporting

## Summary

Report generation engine — templates, scheduled generation, multi-format (PDF/Excel/HTML), email delivery. For admin panels and data-heavy apps.

## Proposed Public API

```csharp
public interface IReportService
{
    Task<Report> DefineAsync(ReportDefinition definition, CancellationToken ct);
    Task<ReportResult> GenerateAsync(string reportId, ReportParameters? parameters = null, CancellationToken ct = default);
    Task<IReadOnlyList<Report>> ListAsync(CancellationToken ct);
    Task<Stream> DownloadAsync(string reportId, string format, CancellationToken ct);
}

builder.Services.AddReporting(options => {
    options.OutputPath = "/reports";
    options.DefaultFormats = [ReportFormat.Pdf, ReportFormat.Excel];
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Reporting/`.
2. Implement template engine, scheduled generation, multi-format rendering.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
