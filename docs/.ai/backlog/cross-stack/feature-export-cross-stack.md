---
id: feature-export-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Export + @hexguard/angular-export'
---

# Export Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for data export — the .NET side generates CSV, Excel (XLSX), and PDF exports from typed data; the Angular side triggers downloads with progress tracking, cancellation, and format selection.

**Promoted from sidenote:** `HexGuard.Export` was a .NET sidenote. This brief adds the Angular counterpart and defines the shared contract.

## Why Wide Adoption

Data export (download as CSV, Excel, or PDF) is a standard feature in virtually every business app. Every team builds the same pipeline: serialize data → write to stream → set content-disposition → return file → trigger browser download.

## Goals

### .NET (`HexGuard.Export`)

1. Provide `IExportService` with typed `ExportAsync<T>(data, format)` returning a stream.
2. Support CSV, Excel (XLSX via OpenXML SDK), and PDF formats.
3. Support configurable column mapping, headers, and formatting.
4. Support streaming — no need to hold the entire file in memory.

### Angular (`@hexguard/angular-export`)

1. Provide `injectExport()` — triggers download with format selection and progress.
2. Support download progress tracking (for large files).
3. Support cancellation of in-flight downloads.
4. Auto-detect format from Accept header or explicit selection.

## Non-Goals

- No chart/image export.
- No email delivery of exports.

## Proposed Public API

### .NET

```csharp
public interface IExportService
{
    Task<Stream> ExportAsync<T>(IReadOnlyList<T> data, ExportFormat format,
        Action<ExportOptions<T>>? configure = null, CancellationToken ct = default);
    Task<string> ExportToFileAsync<T>(IReadOnlyList<T> data, ExportFormat format,
        string? directory = null, CancellationToken ct = default);
}

public enum ExportFormat { Csv, ExcelXlsx, Pdf }
```

### Angular

```typescript
export function injectExport(): {
  readonly isExporting: Signal<boolean>;
  readonly progress: Signal<number>;        // 0–100
  readonly error: Signal<string | null>;
  readonly lastFilename: Signal<string | null>;

  exportFromApi<T>(
    apiUrl: string,
    format: 'csv' | 'xlsx' | 'pdf',
    filename?: string
  ): Promise<void>;                          // Fetches + triggers download

  exportFromData<T>(
    data: T[],
    format: 'csv' | 'xlsx' | 'pdf',
    filename?: string
  ): Promise<void>;                          // Uses client-side generation

  cancel(): void;
};
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Export/` with standard `.csproj`.
2. Implement CSV, Excel, PDF formatters.
3. Implement `IExportService` and `ExportToFileAsync`.
4. Create Angular package with `injectExport()`.
5. Add tests on both sides.
6. Register both packages in their respective workspaces.
