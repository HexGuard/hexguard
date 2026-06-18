using HexGuard.FeatureFlags;

namespace HexGuard.SampleApi.Packages.HexGuardFeatureFlags;

/// <summary>
/// Sample endpoints demonstrating the HexGuard.FeatureFlags library.
/// </summary>
public static class FeatureFlagsSampleEndpoints
{
    public static IEndpointRouteBuilder MapFeatureFlagsSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/feature-flags");

        group.MapGet("/personas", () =>
        {
            return Results.Ok(FeatureFlagsSampleData.GetPersonas());
        });

        group.MapGet("/evaluate-all", async (
            string userId,
            string? tenantId,
            string? groups,
            string? attributes,
            IFeatureFlagStore store,
            CancellationToken ct) =>
        {
            var catalog = await store.GetCatalogAsync(ct);

            var context = new FlagEvaluationContext(
                UserId: userId,
                TenantId: tenantId,
                Groups: groups?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
                Attributes: ParseAttributes(attributes));

            var results = FeatureFlagEvaluator.EvaluateMany(catalog.Flags, context);
            return Results.Ok(results);
        });

        return endpoints;
    }

    private static IReadOnlyDictionary<string, string>? ParseAttributes(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return null;

        return raw
            .Split('&', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(part =>
            {
                var eq = part.IndexOf('=');
                return eq >= 0
                    ? (Key: part[..eq], Value: part[(eq + 1)..])
                    : (Key: part, Value: "");
            })
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value, StringComparer.Ordinal);
    }
}
