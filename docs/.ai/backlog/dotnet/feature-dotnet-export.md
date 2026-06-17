---
id: feature-dotnet-export
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.Export'
---

# .NET Export Package

## Summary

Design `HexGuard.Export` as a .NET package for standardizing CSV, Excel, and PDF export-generation helpers with consistent file-result contracts, content-disposition conventions, and optional background-export status tracking for ASP.NET Core APIs.

The repeated problem is that nearly every API needs to serve CSV, Excel, or PDF exports, but every team builds the same `StreamWriter` CSV serialization, `Content-Disposition` header formatting, `File()` result construction, and export-progress tracking differently.

## Goals

- Provide `IFileExportService<T>` with typed export generation for CSV, Excel, and custom formats.
- Provide `CsvExportBuilder` — generate CSV from `IEnumerable<T>` with header mapping and column ordering.
- Provide `FileResult` helpers that handle `Content-Disposition`, `Content-Type`, and file naming consistently.
- Provide background-export status tracking for large exports via `IExportJobStore`.
- Keep format generators pluggable — consumers can add PDF, XML, or custom formats.

## Decisions

- CSV export is built-in using `StreamWriter` — no external CSV library dependency.
- Excel export helpers are conditional (define `HEXGUARD_HAS_CLOSEDXML` to enable).
- File naming uses a `slug` + timestamp convention for consistent filenames.
- Background exports use the same `IJobStore` pattern from `HexGuard.BackgroundJobs` when available.

## Proposed Public API

```csharp
// CSV export
var csvResult = await exportService.ExportCsvAsync(products,
    cfg => cfg.Map(p => p.Name).Header("Product Name")
              .Map(p => p.Price).Header("Price")
);
return csvResult.ToFileResult("products-export.csv");

// Excel export (requires ClosedXML)
var excelResult = await exportService.ExportExcelAsync(products,
    cfg => cfg.SheetName("Products")
);
return excelResult.ToFileResult("products-export.xlsx");

// Background export
var jobId = await exportService.EnqueueExportAsync("products-csv", async (ct) =>
{
    return await exportService.ExportCsvAsync(products, cfg => ...);
});
// Job status endpoint
// GET /api/exports/{jobId} → { status: "completed", downloadUrl: "/api/exports/{jobId}/download" }
```

## Implementation Plan

1. Scaffold project + tests.
2. Implement `CsvExportBuilder` with header mapping, escaping, streaming.
3. Implement `ExcelExportBuilder` (conditional ClosedXML).
4. Implement `ToFileResult()` extension — applies proper Content-Disposition and Content-Type.
5. Implement background export with `IExportJobStore` and `IJobScheduler` integration.
6. Add unit tests for: CSV generation, escaping, Excel generation, file result headers, background status tracking.
7. Add sample endpoint in `HexGuard.SampleApi`.
8. Add integration tests, docs, release.
