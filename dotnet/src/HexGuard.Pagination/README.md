# HexGuard.Pagination

Standardized pagination and query contracts for .NET APIs.

## Installation

```bash
dotnet add package HexGuard.Pagination
```

## Types

- `QueryRequest` — Request model with Page, PageSize, Search, Sort, Filters
- `QueryResponse<T>` — Response model with Items, TotalCount, Page, PageSize, TotalPages, HasNext, HasPrevious, RangeStart, RangeEnd
- `SortSpec` — Field sort specification (Field, Descending)
