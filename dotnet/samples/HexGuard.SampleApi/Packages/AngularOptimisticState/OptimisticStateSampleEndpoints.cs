namespace HexGuard.SampleApi.Packages.AngularOptimisticState;

internal static class OptimisticStateSampleEndpoints
{
    private static readonly Random Random = new();

    public static IEndpointRouteBuilder MapOptimisticStateSampleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/angular-optimistic-state");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "angular-optimistic-state",
            description = "Feature flags, draft tasks, and campaign items used by the Angular optimistic-state demos.",
            featuresEndpoint = "/api/angular-optimistic-state/features",
            draftsEndpoint = "/api/angular-optimistic-state/drafts",
            campaignsEndpoint = "/api/angular-optimistic-state/campaigns",
            updateEndpoint = "POST /api/angular-optimistic-state/features/{id}",
        }));

        group.MapGet("/features", () =>
        {
            return Results.Ok(OptimisticStateSampleData.CreateFeatures());
        });

        group.MapGet("/drafts", () =>
        {
            return Results.Ok(OptimisticStateSampleData.CreateDraftRows());
        });

        group.MapGet("/campaigns", () =>
        {
            return Results.Ok(OptimisticStateSampleData.CreateCampaignRows());
        });

        group.MapPost("/features/{id}", (string id, ToggleFeatureRequest request) =>
        {
            // Simulate server processing delay
            Thread.Sleep(Random.Next(150, 500));

            // Simulate occasional rejection (~10%)
            if (Random.NextDouble() < 0.1)
            {
                return Results.Conflict(new
                {
                    error = $"Feature '{id}' could not be updated due to a conflicting change.",
                    id,
                });
            }

            return Results.Ok(OptimisticStateSampleData.CreateUpdateResult(
                id, title: null, request.Enabled, status: null));
        });

        group.MapPost("/drafts/{id}", (string id, DraftUpdateRequest request) =>
        {
            Thread.Sleep(Random.Next(200, 600));

            return Results.Ok(OptimisticStateSampleData.CreateUpdateResult(
                id, request.Title, enabled: null, status: null));
        });

        group.MapPost("/campaigns/{id}", (string id, CampaignPublishRequest request) =>
        {
            Thread.Sleep(Random.Next(200, 450));

            return Results.Ok(OptimisticStateSampleData.CreateUpdateResult(
                id, title: null, enabled: null, request.Status));
        });

        return endpoints;
    }
}

internal sealed record ToggleFeatureRequest(bool Enabled);
internal sealed record DraftUpdateRequest(string Title);
internal sealed record CampaignPublishRequest(string Status);
