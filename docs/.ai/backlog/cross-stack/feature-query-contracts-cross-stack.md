---
id: feature-query-contracts-cross-stack
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.QueryContracts + @hexguard/angular-query-contracts'
---

# Query Contracts Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for reusable query request and response contracts around search, filter, sort, and pagination.

Angular apps often standardize client-side query state while APIs invent their own parameter names, sort tokens, and pagination payloads independently. A shared contract would reduce repeated mapping layers and drift between frontend and backend query models.

## Goals

- Standardize common query contracts across client and server.
- Compose naturally with url-state, query-form, table-state, and pagination.
- Keep filter and sort semantics typed and explicit.
- Reduce mapping boilerplate between Angular state and backend requests.
- Compose with `HexGuard.Filtering` and `@hexguard/angular-pagination`.

## Non-Goals

- A full OData replacement.
- Dynamic arbitrary query builders in the first version.
- Replacing backend search infrastructure.

## Decisions

- Keep the contract narrow around common business-app query shapes.
- Prefer explicit sort and filter models over opaque string DSLs.
- Treat the pair as complementary to, not a replacement for, pagination packages.
- The Angular side maps `urlState()` query params into typed query request objects.

## Proposed Public API

### .NET

```csharp
public record QueryRequest(
    int Page,
    int PageSize,
    string? Search,
    IReadOnlyList<SortSpec>? Sort,
    IReadOnlyDictionary<string, string>? Filters
);

public record SortSpec(string Field, bool Descending);

public record QueryResponse<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);
```

### Angular

```ts
import { toQueryRequest, type QueryRequest, type QueryResponse } from '@hexguard/angular-query-contracts';

// Map URL state to typed request
const request: QueryRequest = toQueryRequest({
  page: urlState().page,
  pageSize: urlState().size,
  search: urlState().q,
  sort: parseSort(urlState().sort),
  filters: { status: urlState().status, priority: urlState().priority },
});

// Send to API
const response = await api.post<QueryResponse<Order>>('/api/orders/query', request);
```

## Implementation Plan

### Phase 0: .NET — HexGuard.QueryContracts

1. Scaffold project + tests under `dotnet/src/HexGuard.QueryContracts/`.
2. Define `QueryRequest`, `SortSpec`, `QueryResponse<T>` records.
3. Implement model binder for query-string → `QueryRequest` deserialization.
4. Implement `QueryResponseBuilder<T>` for consistent response envelope construction.
5. Add unit tests for: binding, validation, response building.

### Phase 1: Angular — @hexguard/angular-query-contracts

6. Scaffold `angular/packages/angular-query-contracts/`.
7. Define TypeScript types mirroring .NET contracts.
8. Implement `toQueryRequest()` — maps URL-state snapshot to typed request.
9. Implement `parseSort()` — converts sort string (`"-createdAt"`) to `SortSpec[]`.
10. Add unit tests for: mapping, sort parsing, edge cases (empty sort, single sort, multi-sort).

### Phase 2: Demo & Docs

11. Add .NET endpoint group to `HexGuard.SampleApi`.
12. Add Angular demo route showing URL-to-request mapping and list rendering.
13. Add Playwright coverage.
14. Write deep-dive docs.

### Phase 3: Release

15. Add build/test/verify scripts.
16. Add release workflows.
17. Run full validation gates.

## Validation

- `pnpm dotnet:test`.
- `pnpm test:lib:query-contracts`.
- `pnpm test:e2e`.

