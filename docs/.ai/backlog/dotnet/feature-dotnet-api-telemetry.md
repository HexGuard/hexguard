---
id: feature-dotnet-api-telemetry
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.ApiTelemetry
---

# HexGuard.ApiTelemetry

## Summary

Standard API request telemetry middleware for ASP.NET Core — capture endpoint path, HTTP method, status code, request duration, and request/response sizes; emit structured logs and metrics with consistent naming conventions. Production APIs need basic telemetry on every request to monitor performance, detect errors, and track usage patterns — yet every project instruments the middleware ad-hoc.

**Competition check:** ASP.NET Core's built-in `UseHttpLogging()` captures raw request/response data but lacks structured endpoint-grouping, duration tracking, and metrics output. Application Insights (`OpenTelemetry.Instrumentation.AspNetCore`) is more comprehensive but targets Azure monitor and adds heavyweight dependencies. **HexGuard.ApiTelemetry targets a lighter, framework-agnostic telemetry layer** that works with any logging/metrics backend.

## Why Wide Adoption

Every production API needs to know: which endpoints are called, how often, how long they take, how many errors occur, and how much data flows through them. This package provides that baseline in one middleware call with zero external service dependencies.

## Goals

1. Provide `UseApiTelemetry()` middleware that captures request metadata and duration.
2. Emit structured `ILogger` logs with consistent property names: `Endpoint`, `Method`, `StatusCode`, `DurationMs`, `RequestSize`, `ResponseSize`.
3. Support configurable slow-request threshold (log warning when exceeded).
4. Support exclude paths (skip `/health`, `/metrics`).
5. Optionally emit in-memory metrics (request count, duration histogram, error rate).
6. Pure middleware — no external dependencies beyond ASP.NET Core.

## Non-Goals

- No OpenTelemetry exporter integration (consumer wires their own exporter).
- No distributed tracing propagation (use OpenTelemetry for TraceId/SpanId).
- No application performance monitoring dashboards.

## Proposed Public API

```csharp
// ── Options ───────────────────────────────────────────────

public sealed class ApiTelemetryOptions
{
    public bool CaptureRequestSize { get; set; } = false;
    public bool CaptureResponseSize { get; set; } = false;
    public TimeSpan SlowRequestThreshold { get; set; } = TimeSpan.FromSeconds(5);
    public string[] ExcludePaths { get; set; } = ["/health", "/metrics"];
    public bool EmitMetrics { get; set; } = false;
    public string MetricPrefix { get; set; } = "api";
}

// ── Metrics (in-memory, optional) ─────────────────────────

public interface IApiMetrics
{
    long TotalRequests { get; }
    long ActiveRequests { get; }
    long ErrorCount { get; }
    double AverageDurationMs { get; }
    IReadOnlyDictionary<string, long> EndpointCounts { get; }   // endpoint → count
    IReadOnlyDictionary<int, long> StatusCodeCounts { get; }    // status → count

    event Action<RequestCompletedEvent>? OnRequestCompleted;
}

public sealed record RequestCompletedEvent
{
    public string Endpoint { get; init; }
    public string Method { get; init; }
    public int StatusCode { get; init; }
    public double DurationMs { get; init; }
    public long? RequestSize { get; init; }
    public long? ResponseSize { get; init; }
    public bool IsSlow { get; init; }
    public bool IsError { get; init; }
}

// ── Middleware ─────────────────────────────────────────────

public static class ApiTelemetryExtensions
{
    public static IApplicationBuilder UseApiTelemetry(
        this IApplicationBuilder app,
        Action<ApiTelemetryOptions>? configure = null);

    public static IServiceCollection AddApiTelemetry(
        this IServiceCollection services,
        Action<ApiTelemetryOptions>? configure = null);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddApiTelemetry(options => {
    options.CaptureRequestSize = true;
    options.CaptureResponseSize = true;
    options.SlowRequestThreshold = TimeSpan.FromSeconds(3);
    options.EmitMetrics = true;
});

app.UseApiTelemetry();

// Access metrics (e.g., from a /metrics endpoint)
app.MapGet("/metrics", (IApiMetrics metrics) => new {
    total = metrics.TotalRequests,
    active = metrics.ActiveRequests,
    errors = metrics.ErrorCount,
    avgDurationMs = Math.Round(metrics.AverageDurationMs, 2),
    byEndpoint = metrics.EndpointCounts,
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ApiTelemetry/` with standard `.csproj` (no external dependencies).
2. Implement `ApiTelemetryOptions`.
3. Implement `ApiTelemetryMiddleware` — captures start time, request/response sizes, status code.
4. Implement `IApiMetrics` / `ApiMetrics` — in-memory counters with thread-safe updates.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit + `WebApplicationFactory` integration tests.
7. Register in `HexGuard.slnx`.
8. Publish as NuGet package `HexGuard.ApiTelemetry`.
