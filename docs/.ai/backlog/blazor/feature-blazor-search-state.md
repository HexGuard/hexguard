---
id: feature-blazor-search-state
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Search
---

# HexGuard.Blazor.Search

## Summary

Search/filter state for Blazor lists and grids — debounced query, filter groups, matched count, and recent searches persistence. Every data list needs search and filter state.

**Angular counterpart:** `@hexguard/angular-search` (cross-stack brief)

## Proposed Public API

```csharp
public sealed class SearchState : IDisposable
{
    public string Query { get; set; } = "";
    public string DebouncedQuery { get; private set; } = "";  // After debounce
    public int MatchedCount { get; set; }
    public int TotalCount { get; set; }
    public event Action? OnChanged;

    public void SetQuery(string query);
    public void Clear();
    public IReadOnlyList<string> RecentSearches { get; }  // Persisted
}

// Registration
builder.Services.AddScoped<SearchState>();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Search/` Razor class library.
2. Implement debounced search with recent persistence.
3. Test with bUnit.
4. Publish as NuGet.
