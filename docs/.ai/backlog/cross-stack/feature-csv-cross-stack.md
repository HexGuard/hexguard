---
id: feature-csv-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Csv + @hexguard/angular-csv'
---

# CSV Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for CSV import/export — the .NET side provides server-side serialization/deserialization; the Angular side provides client-side parsing/generation with download trigger. Shared contract ensures consistent delimiter/header/quoting semantics.

## Shared Contract

Both sides agree on: delimiter (`,`), hasHeader (`true`), quote char (`"`), line ending (`\r\n`). Optional overrides on both sides.

### .NET (`HexGuard.Csv`)

```csharp
app.MapGet("/export/products.csv", async (AppDbContext db) =>
{
    var csv = CsvSerializer.Serialize(await db.Products.ToListAsync());
    return Results.Text(csv, "text/csv", Encoding.UTF8);
});
```

### Angular (`@hexguard/angular-csv`)

```typescript
const generator = injectCsvGenerator();
generator.download(products, 'products.csv');
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Csv/` and `angular/packages/angular-csv/`.
2. Ensure identical default options on both sides.
3. Add tests on both sides.
4. Register both packages.
