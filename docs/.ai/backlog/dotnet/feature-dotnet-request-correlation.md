---
id: feature-dotnet-request-correlation
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.RequestCorrelation
---

# HexGuard.RequestCorrelation

## Summary

Correlation ID middleware for ASP.NET Core — reads incoming `X-Correlation-Id` headers (or generates a new one), propagates the ID through the request pipeline, and writes it back in the response. Essential distributed-tracing infrastructure for microservices, API gateways, and log-aggregation scenarios.

**Competition check:** Steeltoe includes correlation middleware but is a heavyweight dependency (entire Steeltoe framework). `Hellang.Middleware.CorrelationId` (500k+ downloads) is the most popular standalone package but is unmaintained since 2023 and lacks modern .NET 10 features. **Opportunity: a modern, maintained, minimal HexGuard alternative.**

## Why Wide Adoption

Correlation IDs are standard API infrastructure — every request gets a unique ID that ties together logs, metrics, and traces across service boundaries. This is essential for debugging distributed systems, support teams correlating user reports to specific requests, and audit trails. Every production ASP.NET Core API needs this.

## Goals

1. Provide `UseCorrelationId()` middleware — reads `X-Correlation-Id` from request header or generates a `Guid`.
2. Set the correlation ID on `HttpContext.TraceIdentifier`.
3. Include correlation ID in the response header for client-side debugging.
4. Provide `ICorrelationContext` injectable service for accessing the correlation ID anywhere in the pipeline.
5. Support header forwarding to downstream HTTP clients via `IHttpClientFactory` message handler.
6. Support custom header name, generation strategy, and response inclusion.

## Non-Goals

- No distributed tracing propagation beyond the correlation ID header (use OpenTelemetry for W3C TraceContext).
- No log enricher (consumer wires their own `ILogger` enricher).

## Decisions

1. **Middleware pattern**: Standard ASP.NET Core `IMiddleware` that runs early in the pipeline.
2. **Scoped context**: `CorrelationContext` is registered as `Scoped` — same ID for the entire request.
3. **IHttpClientFactory integration**: A `DelegatingHandler` propagates the header to downstream HTTP calls.

## Proposed Public API

```csharp
// ── Middleware ────────────────────────────────────────────

public sealed class CorrelationIdOptions
{
    public string Header { get; set; } = "X-Correlation-Id";
    public bool IncludeInResponse { get; set; } = true;
    public bool UpdateTraceIdentifier { get; set; } = true;
    public Func<string> Generator { get; set; } = () => Guid.NewGuid().ToString("N");
}

public static class CorrelationIdExtensions
{
    public static IApplicationBuilder UseCorrelationId(
        this IApplicationBuilder app,
        Action<CorrelationIdOptions>? configure = null);
}

// ── Context ───────────────────────────────────────────────

public interface ICorrelationContext
{
    string CorrelationId { get; }
}

public sealed class CorrelationContext : ICorrelationContext
{
    public string CorrelationId { get; internal set; } = "";
}

// ── HttpClient propagation ────────────────────────────────

public sealed class CorrelationIdHandler : DelegatingHandler
{
    public CorrelationIdHandler(ICorrelationContext context);
    // Automatically adds X-Correlation-Id to outgoing requests
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddCorrelationId();
// Or with HttpClient propagation:
builder.Services.AddHttpClient("MyClient")
    .AddHttpMessageHandler<CorrelationIdHandler>();

// ── Usage ─────────────────────────────────────────────────

// Program.cs
app.UseCorrelationId(options => {
    options.Header = "X-Correlation-Id";
    options.IncludeInResponse = true;
});

// In a controller/minimal API:
public record SomeResponse(string Data, string CorrelationId);

app.MapGet("/items", async (ICorrelationContext ctx) =>
{
    return new SomeResponse("data", ctx.CorrelationId);
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.RequestCorrelation/` with standard `.csproj`.
2. Implement `CorrelationIdOptions`, `CorrelationIdMiddleware`.
3. Implement `ICorrelationContext` / `CorrelationContext`.
4. Implement `CorrelationIdHandler` for `IHttpClientFactory` propagation.
5. Implement `AddCorrelationId()` / `UseCorrelationId()` extensions.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + integration tests via `WebApplicationFactory`.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.RequestCorrelation`.
