namespace HexGuard.SampleApi.Packages.AngularLookups;

internal static class AngularLookupsSampleEndpoints
{
    public static IEndpointRouteBuilder MapAngularLookupsSampleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/angular-lookups");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "angular-lookups",
            description = "Versioned product lookup catalogs used by the Angular lookups demos.",
            catalogEndpoint = "/api/angular-lookups/catalog?scenario=base",
            supportedScenarios = new[] { "base", "refreshed", "invalid" },
        }));

        group.MapGet("/catalog", (string? scenario) =>
        {
            var normalizedScenario = string.IsNullOrWhiteSpace(scenario)
                ? "base"
                : scenario.Trim().ToLowerInvariant();

            return normalizedScenario switch
            {
                "base" => Results.Ok(AngularLookupsSampleCatalogs.CreateBaseCatalog()),
                "refreshed" => Results.Ok(AngularLookupsSampleCatalogs.CreateRefreshedCatalog()),
                "invalid" => Results.Ok(AngularLookupsSampleCatalogs.CreateInvalidCatalogPayload()),
                _ => Results.BadRequest(new
                {
                    error = $"Unknown angular-lookups scenario '{scenario}'.",
                    supportedScenarios = new[] { "base", "refreshed", "invalid" },
                }),
            };
        });

        return endpoints;
    }
}