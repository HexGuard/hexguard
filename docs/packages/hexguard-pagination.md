# HexGuard.Pagination

Standardized pagination/query contracts for .NET APIs. Paired with `@hexguard/angular-pagination` for cross-stack pagination alignment.

## Feature Matrix

| Capability                       | Status       | Notes                                                                                                       |
| -------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| `QueryRequest` record            | ✅ Available | `Page`, `PageSize`, `SortBy`, `SortDirection`                                                               |
| `QueryResponse<T>` record        | ✅ Available | `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`, `HasNext`, `HasPrevious`, `RangeStart`, `RangeEnd` |
| `SortSpec` record                | ✅ Available | `Field`, `Descending`                                                                                       |
| Computed properties              | ✅ Available | `HasNext`, `HasPrevious`, `RangeStart`, `RangeEnd`, `TotalPages` on `QueryResponse<T>`                      |
| Sample API endpoints             | ✅ Available | `/api/pagination/products` (GET)                                                                            |
| Cross-stack pairing with Angular | ✅ Available | `@hexguard/angular-pagination`                                                                              |

## Public API Map

| Type               | Kind            | Role                                                              |
| ------------------ | --------------- | ----------------------------------------------------------------- |
| `QueryRequest`     | `sealed record` | Pagination request: `Page`, `PageSize`, `SortBy`, `SortDirection` |
| `QueryResponse<T>` | `sealed record` | Paginated response: `Items`, `TotalCount`, computed helpers       |
| `SortSpec`         | `sealed record` | Sort specification: `Field`, `Descending`                         |

## Sample API Endpoints

| Endpoint                   | Method | Description                      |
| -------------------------- | ------ | -------------------------------- |
| `/api/pagination/products` | GET    | Paginated product list with sort |

## Code Examples

### Define a paginated endpoint

```csharp
using HexGuard.Pagination;

app.MapGet("/api/products", (int? page, int? pageSize) =>
{
    var query = new QueryRequest
    {
        Page = page ?? 1,
        PageSize = pageSize ?? 20,
        SortBy = "name",
        SortDirection = "asc",
    };

    var items = db.Products
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .ToList();

    var total = db.Products.Count();

    var response = QueryResponse<Product>.Create(query, items, total);
    // response.HasNext, response.HasPrevious, response.TotalPages
    // response.RangeStart, response.RangeEnd
    return Results.Ok(response);
});
```

### Use computed properties for UI helpers

```csharp
var response = QueryResponse<Product>.Create(query, items, total);

if (response.HasPrevious) { /* show Previous button */ }
if (response.HasNext) { /* show Next button */ }

// Range: "Showing 1-20 of 100"
var rangeText = $"Showing {response.RangeStart}-{response.RangeEnd} of {response.TotalCount}";
```

### Angular pairing — request shape

```typescript
// @hexguard/angular-pagination client sends:
interface QueryRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
```

```typescript
// Server responds with:
interface QueryResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  rangeStart: number;
  rangeEnd: number;
}
```

## Validation Surface

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```

## Release Contract

- **Tag pattern**: Currently not registered in `release-dotnet.yml`. Pending release workflow setup.
- **nuget**: Published as `HexGuard.Pagination`.

## Related Resources

- [Package README](../../dotnet/src/HexGuard.Pagination/README.md)
- [Package Catalog](../README.md)
- [Sample API Endpoints](../../dotnet/samples/HexGuard.SampleApi/Packages/HexGuardPagination/)
- [Source Code](../../dotnet/src/HexGuard.Pagination/)
- [Angular Counterpart: `@hexguard/angular-pagination`](./angular-pagination.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                   | Severity |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Clean, minimal types with computed helpers (`HasNext`, `HasPrevious`, `RangeStart`, `RangeEnd`, `Create()`). Proper `InternalsVisibleTo`. | praise   |
| Implementation Quality    | `QueryResponse<T>.Create()` factory with proper `TotalPages` computation. Angular counterpart mirrors computed signals.                   | praise   |
| Cross-package Consistency | **No release workflow** — Pagination is NOT in `release-dotnet.yml`.                                                                      | moderate |
| Documentation             | **This doc (`hexguard-pagination.md`) was missing** — created during review. Referenced in catalog but didn't exist.                      | moderate |
| Documentation             | Package README is minimal (type names only, no usage examples or quickstart).                                                             | minor    |
