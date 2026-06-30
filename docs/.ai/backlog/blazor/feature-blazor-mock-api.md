---
id: feature-blazor-mock-api
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.MockApi'
---

# HexGuard.Blazor.MockApi

## Summary

Declarative API mocking for Blazor — `HttpMessageHandler`-based mock server with route matching, response generation, latency simulation, and scenario switching. For development without a backend.

## Goals

- `DelegatingHandler`-based mock engine intercepting real HTTP calls
- Declarative route definitions with path parameters
- Response templates with data generation
- Scenario management (happy path, error, empty, loading, slow)
- Latency simulation per endpoint
- Passthrough for unmatched routes
- Scenario persistence for dev sessions

## Non-Goals

- No replacement for external mock servers
- No GraphQL mocking
- No recording/replay

## Proposed Public API

```csharp
builder.Services.AddBlazorMockApi(options =>
{
    options.AddScenario("happy", scenario =>
    {
        scenario.Get("/api/products", ctx =>
            ctx.RespondJson(ProductGenerator.Generate(20), delayMs: 200));
        scenario.Get("/api/products/{id}", ctx =>
            ctx.RespondJson(ProductGenerator.Find(ctx.RouteValues["id"]!)));
        scenario.Post("/api/products", ctx =>
            ctx.RespondStatus(201, new { id = Guid.NewGuid().ToString() }));
    });

    options.AddScenario("error", scenario =>
    {
        scenario.Get("/api/products", ctx =>
            ctx.RespondStatus(500, new { error = "Internal Server Error" }));
        scenario.Get("/api/products/{id}", ctx =>
            ctx.RespondStatus(404));
    });

    options.AddScenario("slow", scenario =>
    {
        scenario.Get("/api/products", ctx =>
            ctx.RespondJson(ProductGenerator.Generate(20), delayMs: 3000));
    });

    options.DefaultScenario = "happy";
    options.Passthrough = new[] { "/api/health", "/_framework/*" };
});

// Runtime scenario switching
public interface IMockApiController
{
    string CurrentScenario { get; }
    IReadOnlyList<string> Scenarios { get; }
    IReadOnlyList<MockCallLogEntry> CallLog { get; }
    void SetScenario(string name);
    void Reset();
    void ClearCallLog();
    event Action? ScenarioChanged;
}

// Usage in dev toolbar
@inject IMockApiController MockApi

<select @bind="selectedScenario" @bind:after="() => MockApi.SetScenario(selectedScenario)">
    @foreach (var s in MockApi.Scenarios)
    {
        <option value="@s">@s</option>
    }
</select>
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.MockApi/` with `.csproj` (RCL).
2. Implement message handler, route matching, response engine, scenarios.
3. Add latency simulation, call log, scenario persistence.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
