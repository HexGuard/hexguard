---
id: feature-blazor-pagination
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.Pagination
---

# HexGuard.Blazor.Pagination

## Summary

A reusable pagination state component + service for Blazor that provides page navigation, page size selection, range display, and total-page math — matching the `PaginationHandle` contract from `HexGuard.Pagination` (.NET) and `@hexguard/angular-pagination` (Angular).

This is the direct Blazor counterpart of `HexGuard.Pagination` — same `QueryRequest` / `QueryResponse<T>` contracts, same computed helpers (`HasNext`, `HasPrevious`, `RangeStart`, `RangeEnd`, `TotalPages`).

## Goals

1. Provide a `PaginationState` service injectable via DI with `page`, `pageSize`, `total`, and all derived computed properties.
2. Provide a `PaginationNavBar.razor` component for quick template integration.
3. Match the `QueryRequest` / `QueryResponse<T>` contracts from `HexGuard.Pagination` so API endpoints return the same shape.
4. Support URL-query-string sync for Blazor WebAssembly (via `NavigationManager`).
5. Support `resetOn` parameter change filter reset (like Angular's `resetOn` option).

## Non-Goals

- No dependency on `IJSRuntime` — works in both Server and WASM modes.
- No CSS or styling — headless components only.
- No auto-fetching — the consumer calls their own API.

## Decisions

1. **Service + Component pattern**: A `PaginationState` service handles all state/logic; an optional `PaginationNavBar` render fragment provides default UI.
2. **Implements `IQueryRequest`**: The service implements a shared `IQueryRequest` interface from `HexGuard.Pagination` for polymorphic API calls.
3. **EventCallback-based**: State changes notify consumers via `EventCallback<int>` for page changes.

## Proposed Public API

```csharp
// ── Services ──────────────────────────────────────────────

public sealed class PaginationState : IDisposable
{
    public int Page { get; set; }          // 1-based
    public int PageSize { get; set; }      // default 20
    public int Total { get; set; }         // set from API response

    // Computed
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
    public bool HasNext => Page < TotalPages;
    public bool HasPrevious => Page > 1;
    public bool IsFirstPage => Page <= 1;
    public bool IsLastPage => Page >= TotalPages;
    public int RangeStart => Total == 0 ? 0 : (Page - 1) * PageSize + 1;
    public int RangeEnd => Math.Min(Page * PageSize, Total);

    // Navigation
    public void GoToPage(int page);
    public void NextPage();
    public void PreviousPage();
    public void FirstPage();
    public void LastPage();
    public void SetPageSize(int size);  // resets to page 1

    // Event
    public event EventCallback<int> PageChanged;
}

// ── Component ─────────────────────────────────────────────

@* PaginationNavBar.razor *@
public partial class PaginationNavBar
{
    [Parameter] public PaginationState State { get; set; } = default!;
    [Parameter] public int VisiblePages { get; set; } = 5;
    [Parameter] public EventCallback<int> OnPageChange { get; set; }
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<PaginationState>();
```

## Implementation Plan

1. Scaffold `dotnet/src/HexGuard.Blazor.Pagination/` with Razor class library `.csproj`.
2. Implement `PaginationState` class matching the API above.
3. Implement `PaginationNavBar.razor` component.
4. Add to `HexGuard.slnx`.
5. Create test project with xUnit + bUnit for component tests.
6. Create sample endpoint integration with `HexGuard.SampleApi`.
7. Publish as NuGet package `HexGuard.Blazor.Pagination`.
