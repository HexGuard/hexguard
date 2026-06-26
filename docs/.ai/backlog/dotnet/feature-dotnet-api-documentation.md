---
id: feature-dotnet-api-documentation
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.ApiDocumentation
---

# HexGuard.ApiDocumentation

## Summary

XML documentation comment → OpenAPI description conventions for ASP.NET Core Minimal APIs. Auto-extracts `<summary>`, `<param>`, and `<response>` XML doc comments and applies them as OpenAPI operation descriptions, parameter descriptions, and response descriptions. Keeps API docs in sync with code without manual attribute annotations.

**Competition check:** Swashbuckle includes `IncludeXmlComments()` but requires manual setup and doesn't work with the latest Minimal API + OpenAPI integration in .NET 10. `Microsoft.AspNetCore.OpenApi` is the new standard but doesn't auto-extract XML docs.

## Why Wide Adoption

API documentation drifts from code when maintained separately. XML doc comments are already written by developers — this package automatically lifts them into OpenAPI descriptions, keeping the spec accurate with zero additional effort.

## Goals

1. Automatically extract `<summary>` as OpenAPI operation description.
2. Automatically extract `<param>` as OpenAPI parameter description.
3. Automatically extract `<response>` as OpenAPI response description.
4. Support Minimal API endpoints and controllers.
5. No additional attributes or annotations required — reads existing XML doc comments.
6. Compatible with `Microsoft.AspNetCore.OpenApi` and OpenAPI 3.1.

## Proposed Public API

```csharp
public static class ApiDocumentationExtensions
{
    public static IServiceCollection AddApiDocumentation(
        this IServiceCollection services,
        Action<ApiDocumentationOptions>? configure = null);
}

public sealed class ApiDocumentationOptions
{
    public string[] XmlDocFiles { get; set; } = [];     // Auto-discovered from build output
    public bool IncludeParameterDescriptions { get; set; } = true;
    public bool IncludeResponseDescriptions { get; set; } = true;
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddApiDocumentation(options => {
    options.XmlDocFiles = ["MyApi.xml"];  // Auto-located in build output
});

// XML docs are auto-extracted:
/// <summary>
/// List all products with pagination and optional category filtering.
/// </summary>
/// <param name="category">Filter by category slug (optional)</param>
/// <param name="page">Page number (1-based, default 1)</param>
/// <response code="200">Paginated list of products</response>
/// <response code="400">Invalid filter parameters</response>
app.MapGet("/api/products", (string? category, int page = 1) => { ... });
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ApiDocumentation/` with standard `.csproj`.
2. Implement XML doc file reader and comment extractor.
3. Implement OpenAPI document operation processor that applies extracted descriptions.
4. Integrate with `Microsoft.AspNetCore.OpenApi`'s `OpenApiOptions` pipeline.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit.
7. Register in `HexGuard.slnx`.
8. Publish as NuGet.
