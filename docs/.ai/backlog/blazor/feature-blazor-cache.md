---
id: feature-blazor-cache
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.Cache'
---

# HexGuard.Blazor.Cache

## Summary

Client-side caching abstraction for Blazor — memory cache with TTL, LRU eviction, persistent cache backends, and stale-while-revalidate. For API responses, computed values, and offline resilience.

## Goals

- `IMemoryCache` with TTL and LRU eviction
- `IPersistentCache` with localStorage/IndexedDB backends
- Stale-while-revalidate pattern
- Cache invalidation by key, pattern, or tag
- Request deduplication for concurrent fetches
- Cache statistics (hits, misses, evictions)
- Cascading cache (check memory → check persistent → fetch)

## Non-Goals

- No distributed cache (Redis, etc.)
- No HTTP caching (ETag, If-Modified-Since)
- No server-side cache synchronization

## Proposed Public API

```csharp
public interface IBlazorCache
{
    Task<T?> GetAsync<T>(string key, CancellationToken ct = default);
    Task<T> GetOrFetchAsync<T>(string key, Func<Task<T>> fetcher,
        CacheEntryOptions? options = null, CancellationToken ct = default);
    Task SetAsync<T>(string key, T value, CacheEntryOptions? options = null,
        CancellationToken ct = default);
    Task<bool> HasAsync(string key, CancellationToken ct = default);
    Task RemoveAsync(string key, CancellationToken ct = default);
    Task InvalidateByPatternAsync(string pattern, CancellationToken ct = default);
    Task InvalidateByTagAsync(string tag, CancellationToken ct = default);
    Task ClearAsync(CancellationToken ct = default);
    CacheStats GetStats();
}

public sealed record CacheEntryOptions
{
    public TimeSpan? Ttl { get; init; }
    public bool StaleWhileRevalidate { get; init; }
    public IReadOnlyList<string>? Tags { get; init; }
}

public sealed record CacheStats
{
    public long Hits { get; init; }
    public long Misses { get; init; }
    public double HitRate { get; init; }
    public int EntryCount { get; init; }
}

// Registration
builder.Services.AddBlazorCache(options =>
{
    options.MaxMemoryEntries = 1000;
    options.DefaultTtl = TimeSpan.FromMinutes(5);
    options.EnablePersistence = true;    // WASM: IndexedDB
    options.PersistentBackend = PersistentCacheBackend.LocalStorage;
});

// Usage
@inject IBlazorCache Cache

var products = await Cache.GetOrFetchAsync("products", 
    () => Api.GetProductsAsync(),
    new CacheEntryOptions { Ttl = TimeSpan.FromMinutes(10), Tags = ["catalog"] });
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.Cache/` with `.csproj` (RCL).
2. Implement memory cache, persistent backends, cascading, invalidation.
3. Add request dedup, stats, stale-while-revalidate.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
