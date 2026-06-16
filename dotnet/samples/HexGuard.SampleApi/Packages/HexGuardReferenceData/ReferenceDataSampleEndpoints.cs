using HexGuard.ReferenceData;

namespace HexGuard.SampleApi.Packages.HexGuardReferenceData;

internal static class ReferenceDataSampleEndpoints
{
    public static IEndpointRouteBuilder MapReferenceDataSampleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/reference-data");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "hexguard-reference-data",
            description = "Demonstrates the HexGuard.ReferenceData library contracts and validation directly.",
            catalogEndpoint = "/api/reference-data/catalog",
            contractShape = new
            {
                metadata = new { version = "string", generatedAtUtc = "datetime" },
                collections = new[]
                {
                    new { key = "string", revision = "string?", items = new[] { new { key = "string", label = "string", isActive = "bool?", description = "string?" } } },
                },
            },
        }));

        group.MapGet("/catalog", () =>
        {
            // Demonstrate using the actual HexGuard.ReferenceData library types
            var catalog = SampleReferenceDataCatalogs.CreateProductCatalog();

            // The StaticReferenceDataCatalogProvider validates on construction
            var provider = new StaticReferenceDataCatalogProvider(catalog);
            var result = provider.GetCatalogAsync().GetAwaiter().GetResult();

            return Results.Ok(result);
        });

        group.MapGet("/catalog/validate", () =>
        {
            var catalog = SampleReferenceDataCatalogs.CreateProductCatalog();
            var errors = ReferenceDataCatalogValidator.Validate(catalog);

            return Results.Ok(new
            {
                isValid = errors.Count == 0,
                errors,
                catalog,
            });
        });

        group.MapGet("/catalog/invalid", () =>
        {
            var catalog = SampleReferenceDataCatalogs.CreateInvalidCatalog();

            // Run validation without throwing to show the errors
            var errors = ReferenceDataCatalogValidator.Validate(catalog);

            return Results.Ok(new
            {
                isValid = false,
                errors,
                catalog,
            });
        });

        group.MapGet("/collections/{key}", (string key) =>
        {
            var catalog = SampleReferenceDataCatalogs.CreateProductCatalog();
            var collection = catalog.FindCollection(key);

            if (collection is null)
            {
                return Results.NotFound(new
                {
                    error = $"Collection '{key}' was not found.",
                    availableKeys = catalog.Collections.Select(c => c.Key),
                });
            }

            return Results.Ok(collection);
        });

        return endpoints;
    }
}
