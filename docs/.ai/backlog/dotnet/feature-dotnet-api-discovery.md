---
id: feature-dotnet-api-discovery
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.ApiDiscovery
---

# HexGuard.ApiDiscovery

## Summary

Standard API discovery endpoint and HATEOAS link helpers for ASP.NET Core Minimal APIs — register endpoint metadata (rel, method, path, description, tags) and serve a `GET /api` catalog response. Every API needs some form of self-description for client discoverability, documentation generation, and automation tools; this provides a lightweight, code-first discovery contract without requiring a full OpenAPI schema.

**Competition check:** ASP.NET Core has no built-in discovery endpoint. Swagger/OpenAPI (`Swashbuckle`, `Microsoft.AspNetCore.OpenApi`) serves a different purpose — full API specification generation for Swagger UI and code generation. `HexGuard.ApiDiscovery` provides a lightweight, human-readable metadata endpoint that's always available regardless of environment.

## Why Wide Adoption

API discovery endpoints are standard in well-designed APIs: they tell clients what endpoints exist, what methods they support, and what they do. This enables auto-generated API clients, developer portals, CLI tools, and integration tests that introspect the API surface.

## Goals

1. Provide `MapApiCatalog()` — maps a `GET /api` (or configurable path) endpoint that returns all registered endpoints.
2. Provide declarative endpoint registration with `rel`, `method`, `path`, `description`, and `tags`.
3. Support grouping endpoints into logical groups (e.g., "Products", "Orders").
4. Support parameter placeholders in paths (`/api/products/{id}`).
5. Expose `IApiCatalog` service for programmatic access to registered endpoints.
6. Pure middleware — no external dependencies.

## Non-Goals

- No OpenAPI/Swagger generation — this is a lightweight alternative, not a replacement.
- No schema/type information in responses — just metadata about available endpoints.
- No authentication on the discovery endpoint (consumer secures it if needed).

## Proposed Public API

```csharp
// ── Catalog Registration ──────────────────────────────────

public static class ApiCatalogExtensions
{
    public static IApplicationBuilder MapApiCatalog(
        this IApplicationBuilder app,
        string path = "/api",
        Action<ApiCatalogBuilder>? configure = null);
}

public sealed class ApiCatalogBuilder
{
    public void AddGroup(string name, Action<ApiGroupBuilder> group);
}

public sealed class ApiGroupBuilder
{
    public void AddEndpoint(string rel, string path, string method, string description,
        string? tag = null, string? deprecationMessage = null);
}

// ── Service ───────────────────────────────────────────────

public interface IApiCatalog
{
    IReadOnlyList<ApiGroup> Groups { get; }
    IReadOnlyList<ApiEndpoint> FindByRel(string rel);
    IReadOnlyList<ApiEndpoint> FindByTag(string tag);
}

public sealed record ApiGroup
{
    public string Name { get; init; }
    public IReadOnlyList<ApiEndpoint> Endpoints { get; init; }
}

public sealed record ApiEndpoint
{
    public string Rel { get; init; }        // "list-products"
    public string Method { get; init; }     // "GET"
    public string Path { get; init; }       // "/api/products"
    public string Description { get; init; }
    public string? Tag { get; init; }
    public bool IsDeprecated { get; init; }
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
app.MapApiCatalog("/api", catalog => {
    catalog.AddGroup("Products", products => {
        products.AddEndpoint("list-products", "/api/products", "GET",
            "List all products with pagination");
        products.AddEndpoint("get-product", "/api/products/{id}", "GET",
            "Get a single product by ID");
        products.AddEndpoint("create-product", "/api/products", "POST",
            "Create a new product", tag: "write");
    });
    catalog.AddGroup("Orders", orders => {
        orders.AddEndpoint("list-orders", "/api/orders", "GET",
            "List all orders for the current user");
    });
});

// GET /api returns:
{
  "version": "1.0",
  "groups": [
    {
      "name": "Products",
      "endpoints": [
        { "rel": "list-products", "method": "GET", "path": "/api/products",
          "description": "List all products with pagination", "tag": null, "isDeprecated": false },
        ...
      ]
    }
  ]
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ApiDiscovery/` with standard `.csproj`.
2. Implement `ApiEndpoint`, `ApiGroup`, `ApiCatalog` types.
3. Implement `ApiCatalogBuilder`, `ApiGroupBuilder` for declarative registration.
4. Implement discovery endpoint middleware that serializes the catalog.
5. Implement `IApiCatalog` service for programmatic access.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.ApiDiscovery`.
