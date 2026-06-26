---
id: feature-dotnet-etl
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Etl
---

# HexGuard.Etl

## Summary

ETL pipeline — `IExtractor<T>` → `ITransformer<TIn,TOut>` → `ILoader<T>` with progress, built-in CSV/JSON/DB handlers.

## Proposed Public API

```csharp
public interface IExtractor<T> { IAsyncEnumerable<T> ExtractAsync(CancellationToken ct); }
public interface ITransformer<TIn, TOut> { IAsyncEnumerable<TransformResult<TOut>> TransformAsync(IAsyncEnumerable<TIn> input, CancellationToken ct); }
public interface ILoader<T> { Task<LoadResult> LoadAsync(IAsyncEnumerable<T> items, CancellationToken ct); }

public static class EtlPipeline
{
    public static EtlPipeline<TIn, TOut> Create<TIn, TOut>(
        IExtractor<TIn> extractor, ITransformer<TIn, TOut> transformer, ILoader<TOut> loader);
}

var pipeline = EtlPipeline.Create(
    new CsvExtractor<Product>("products.csv"),
    new MapTransformer<Product, EnrichedProduct>(p => Enrich(p)),
    new DbLoader<EnrichedProduct>(db)
);
var result = await pipeline.RunAsync(ct);
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Etl/`.
2. Implement interfaces and pipeline composer.
3. Implement built-in CSV/JSON/DB extractors and loaders.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
