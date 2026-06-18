using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace HexGuard.FeatureFlags;

/// <summary>
/// ASP.NET Core Minimal API endpoint extensions for feature flag
/// evaluation and sync.
/// </summary>
public static class FeatureFlagEndpoints
{
    /// <summary>
    /// Maps feature flag endpoints under <c>/api/feature-flags</c>.
    ///
    /// <list type="bullet">
    ///   <item><c>GET /api/feature-flags/sync?contextHash={hash}</c> —
    ///   Returns full flag catalog with new hash when hash differs,
    ///   or 304 Not Modified when unchanged.</item>
    ///   <item><c>GET /api/feature-flags/evaluate?key={key}&amp;userId={userId}&amp;tenantId={tenantId}</c> —
    ///   Evaluates a single flag for the given context and returns
    ///   the evaluation result.</item>
    /// </list>
    /// </summary>
    public static IEndpointRouteBuilder MapFeatureFlagEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/feature-flags");

        group.MapGet("/sync", async (
            string? contextHash,
            IFeatureFlagStore store,
            CancellationToken ct) =>
        {
            var catalog = await store.GetCatalogAsync(ct);

            if (!string.IsNullOrEmpty(contextHash) &&
                string.Equals(contextHash, catalog.ContextHash, StringComparison.Ordinal))
            {
                return Results.StatusCode(304);
            }

            return Results.Ok(new
            {
                flags = catalog.Flags,
                evaluatedAt = catalog.EvaluatedAt,
                contextHash = catalog.ContextHash,
            });
        });

        group.MapGet("/evaluate", async (
            string key,
            string userId,
            string? tenantId,
            IFeatureFlagStore store,
            CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(key))
                return Results.BadRequest(new { error = "Flag key is required." });

            if (string.IsNullOrWhiteSpace(userId))
                return Results.BadRequest(new { error = "User ID is required." });

            var flag = await store.GetFlagAsync(key, ct);

            if (flag is null)
            {
                return Results.NotFound(new { key, error = "Flag not found." });
            }

            var context = new FlagEvaluationContext(
                UserId: userId,
                TenantId: tenantId);

            var result = FeatureFlagEvaluator.Evaluate(flag, context);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
