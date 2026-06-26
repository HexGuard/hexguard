---
id: feature-dotnet-csv
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Csv
---

# HexGuard.Csv

## Summary

Server-side CSV serialization/deserialization with `System.Text.Json` alignment for column mapping conventions. Pairs with `@hexguard/angular-csv` for consistent import/export contracts across the stack.

**Competition check:** `CsvHelper` (100M+ downloads) is dominant but heavy. This targets a narrower API with STJ-aligned column mapping.

## Proposed Public API

```csharp
public static class CsvSerializer
{
    public static string Serialize<T>(IEnumerable<T> records, CsvOptions? options = null);
    public static IReadOnlyList<T> Deserialize<T>(string csv, CsvOptions? options = null);
    public static async Task<IReadOnlyList<T>> DeserializeAsync<T>(
        Stream stream, CsvOptions? options = null, CancellationToken ct = default);
}

public sealed record CsvOptions
{
    public char Delimiter { get; init; } = ',';
    public bool HasHeader { get; init; } = true;
    public char QuoteChar { get; init; } = '"';
}

// Minimal API integration
app.MapGet("/export/products.csv", async (AppDbContext db) =>
{
    var products = await db.Products.ToListAsync();
    var csv = CsvSerializer.Serialize(products);
    return Results.Text(csv, "text/csv", Encoding.UTF8);
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Csv/`.
2. Implement serializer/deserializer with RFC 4180.
3. Add tests.
4. Register in `HexGuard.slnx`.
5. Publish as NuGet.
