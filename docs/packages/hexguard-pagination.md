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

## Validation Surface

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```

## Release Contract

- **Tag pattern**: Currently not registered in `release-dotnet.yml`. Pending release workflow setup.
- **nuget**: Published as `HexGuard.Pagination`.

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
