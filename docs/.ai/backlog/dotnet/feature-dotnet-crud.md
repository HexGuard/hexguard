---
id: feature-dotnet-crud
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Crud
---

# HexGuard.Crud

## Summary

Auto-CRUD endpoints from entity types — `MapCrud<T>()` generates GET list / GET by id / POST / PUT / DELETE with pagination, filtering, and ProblemDetails. **Eliminates 80% of CRUD boilerplate.**

## Proposed Public API

```csharp
public static class CrudExtensions
{
    public static RouteGroupBuilder MapCrud<TEntity, TDto>(
        this IEndpointRouteBuilder app, string path,
        Action<CrudOptions<TEntity, TDto>> configure) where TEntity : class;
}

public sealed class CrudOptions<TEntity, TDto>
{
    public Func<AppDbContext, IQueryable<TEntity>>? QueryFilter { get; set; }
    public Func<TDto, TEntity>? MapToEntity { get; set; }
    public Func<TEntity, TDto>? MapToDto { get; set; }
    public string[]? ExcludeEndpoints { get; set; }
}

// Usage
app.MapCrud<Product, ProductDto>("/products", options => {
    options.ExcludeEndpoints = ["DELETE"];
});
// Auto-generates GET/POST/PUT/DELETE + pagination + 404/400 ProblemDetails
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Crud/`.
2. Implement auto-CRUD endpoint generation.
3. Integrate with `HexGuard.Pagination` and `HexGuard.ProblemDetails`.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
