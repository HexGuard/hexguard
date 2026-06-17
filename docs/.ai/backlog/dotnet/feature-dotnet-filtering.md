---
id: feature-dotnet-filtering
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.Filtering'
---

# .NET Filtering Package

## Summary

Design `HexGuard.Filtering` as a .NET package for standardizing safe filter, sort, and search query binding, reusable API-side query helpers, and typed filter/sort models for list endpoints.

The repeated problem is that nearly every GET endpoint that returns a list supports filtering, sorting, and search parameters, but every API defines these parameters differently — `?filter=name:eq:John`, `?sort=-createdAt`, `?q=searchterm` — and the server-side parsing, validation, and application of these parameters is rewritten in every project.

## Goals

- Define reusable `FilterCriteria`, `SortCriteria`, and `SearchQuery` models.
- Provide model binders for automatic query-string deserialization into typed filter/sort objects.
- Provide expression-tree builders for applying filters to `IQueryable<T>` (EF Core compatible).
- Support common filter operators: eq, neq, gt, gte, lt, lte, contains, startsWith, in, between.
- Support multi-column sort with direction (`+field` for asc, `-field` for desc).
- Keep the package LINQ-provider agnostic (EF Core, in-memory, custom providers).

## Non-Goals

- A full OData replacement or GraphQL integration.
- User-authored arbitrary query languages or dynamic SQL generation.
- Filtering across relationships (nested property filters) in the first version.
- Client-side query building or Angular filter contract serialization.

## Decisions

- Use simple query-string conventions (`?sort=-createdAt&name.contains=John&price.gte=10`).
- Provide expression-tree visitors for `IQueryable<T>.Where()` and `.OrderBy()` composition.
- Keep operators as a closed enum — extensible via custom operator registration if demand grows.
- Validate filter/sort parameters against a whitelist of allowed property names for security.

## Proposed Public API

```csharp
// Query binding — auto-bound from query string
public record FilterRequest(
    string? Sort,
    string? Search,
    IReadOnlyDictionary<string, string>? Filters
);

// Filter operators
public enum FilterOperator { Eq, Neq, Gt, Gte, Lt, Lte, Contains, StartsWith, In, Between }

// Parsed filter
public record FilterCriterion(
    string PropertyName,
    FilterOperator Operator,
    string Value
);

// Sort directive
public record SortDirective(
    string PropertyName,
    bool Descending
);

// Helper
public static class FilteringQueryExtensions
{
    public static IQueryable<T> ApplyFilters<T>(
        this IQueryable<T> query,
        IEnumerable<FilterCriterion> filters,
        FilterOptions<T>? options = null);

    public static IQueryable<T> ApplySort<T>(
        this IQueryable<T> query,
        IEnumerable<SortDirective> sorts);

    public static IQueryable<T> ApplySearch<T>(
        this IQueryable<T> query,
        string searchTerm,
        params Expression<Func<T, string>>[] searchFields);
}

// Registration
builder.Services.AddHexGuardFiltering(options =>
{
    options.MaxSortFields = 3;
    options.AllowedFilterProperties = new[] { "name", "price", "createdAt", "status" };
});
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold project + tests.
2. Add solution file entries.

### Phase 1: Core Contracts

3. Define `FilterRequest`, `FilterCriterion`, `FilterOperator`, `SortDirective`.
4. Implement query-string model binder/parser — converts `?name.contains=John&price.gte=10` into `List<FilterCriterion>`.
5. Implement `ApplyFilters()` — builds expression tree from criteria, applies `IQueryable.Where()`.
6. Implement `ApplySort()` — builds `OrderBy`/`ThenByDescending` chain from sort directives.
7. Implement `ApplySearch()` — applies OR'd `Contains` predicates across specified fields.
8. Implement property-name whitelist validation for security.
9. Implement `AddHexGuardFiltering()` DI registration.
10. Add unit tests for: query-string parsing, expression tree building, multi-field search, multi-column sort, operator edge cases (null values, empty strings, special characters), whitelist rejection, combined filter+sort+search.

### Phase 2: Sample API & Docs

11. Add sample endpoint group to `HexGuard.SampleApi`.
12. Add integration tests.
13. Write `docs/packages/hexguard-filtering.md`.
14. Update README.

### Phase 3: Release

15. Add build/test entries.
16. Add release workflow.
17. Run `pnpm dotnet:test` and `pnpm dotnet:build`.

## Validation

- `pnpm dotnet:test`.
- `pnpm dotnet:build`.

## Follow-Ups

- Revisit nested-property filtering (e.g., `address.city.contains`) if flat filtering proves insufficient.
- Evaluate client-side query-contract generation (TypeScript types from filter definition).
- Consider integration with `HexGuard.Pagination` for combined filter+sort+page list endpoints.
