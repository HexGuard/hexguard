namespace HexGuard.SampleApi.Packages.AngularAsyncState;

internal static class AsyncStateSampleEndpoints
{
    private static readonly Random Random = new();

    public static IEndpointRouteBuilder MapAsyncStateSampleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/angular-async-state");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "angular-async-state",
            description = "Metric dashboard snapshots and order approval actions used by the Angular async-state demos.",
            metricsEndpoint = "/api/angular-async-state/metrics?scenario=base",
            observableEndpoint = "/api/angular-async-state/observable?scenario=healthy",
            ordersEndpoint = "/api/angular-async-state/orders",
            approveEndpoint = "POST /api/angular-async-state/orders/{id}/approve",
            supportedScenarios = new[] { "base", "refreshed" },
            observableScenarios = new[] { "healthy", "warning" },
        }));

        group.MapGet("/metrics", (string? scenario) =>
        {
            var normalizedScenario = string.IsNullOrWhiteSpace(scenario)
                ? "base"
                : scenario.Trim().ToLowerInvariant();

            // Simulate latency for realistic demo behavior
            Thread.Sleep(Random.Next(80, 250));

            return normalizedScenario switch
            {
                "base" => Results.Ok(AsyncStateSampleData.CreateBaseMetrics()),
                "refreshed" => Results.Ok(AsyncStateSampleData.CreateRefreshedMetrics()),
                _ => Results.BadRequest(new
                {
                    error = $"Unknown angular-async-state metrics scenario '{scenario}'.",
                    supportedScenarios = new[] { "base", "refreshed" },
                }),
            };
        });

        group.MapGet("/observable", (string? scenario) =>
        {
            var normalizedScenario = string.IsNullOrWhiteSpace(scenario)
                ? "healthy"
                : scenario.Trim().ToLowerInvariant();

            return normalizedScenario switch
            {
                "healthy" => Results.Ok(AsyncStateSampleData.CreateObservableHealthySnapshot()),
                "warning" => Results.Ok(AsyncStateSampleData.CreateObservableWarningSnapshot()),
                _ => Results.BadRequest(new
                {
                    error = $"Unknown angular-async-state observable scenario '{scenario}'.",
                    observableScenarios = new[] { "healthy", "warning" },
                }),
            };
        });

        group.MapGet("/orders", () =>
        {
            return Results.Ok(AsyncStateSampleData.CreateOrderOptions());
        });

        group.MapPost("/orders/{id}/approve", (string id) =>
        {
            // Simulate processing delay
            Thread.Sleep(Random.Next(100, 400));

            // Simulate occasional failure (about 10% of requests)
            var success = Random.NextDouble() > 0.1;

            if (success)
            {
                return Results.Ok(AsyncStateSampleData.CreateApprovalResult(id, success: true));
            }

            return Results.Ok(AsyncStateSampleData.CreateApprovalResult(id, success: false));
        });

        return endpoints;
    }
}
