---
id: feature-dotnet-metrics
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Metrics'
---

# HexGuard.Metrics

## Summary

Application metrics and instrumentation for ASP.NET Core — counters, gauges, histograms with prometheus-friendly output. Opinionated defaults for common app-level metrics.

## Goals

- Pre-built metrics: request duration, error rate, active users, DB query time
- Custom counter/gauge/histogram registration
- Business metric helpers (orders placed, signups, payments)
- Prometheus exposition endpoint
- Metric tagging with tenant/environment/version
- Meter name conventions for HexGuard ecosystem
- Low-allocation metric recording

## Non-Goals

- No metrics dashboard or visualization
- No alerting rules
- No distributed tracing (use OpenTelemetry)

## Proposed Public API

```csharp
// Pre-built metrics registration
public static IServiceCollection AddHexGuardMetrics(this IServiceCollection services,
    Action<MetricsOptions>? configure = null);

// Business metrics
public class BusinessMetrics
{
    public Counter<T> CreateCounter<T>(string name, string? unit = null, string? description = null) where T : struct;
    public Histogram<T> CreateHistogram<T>(string name, string? unit = null, string? description = null) where T : struct;
    public UpDownCounter<T> CreateUpDownCounter<T>(string name, string? unit = null, string? description = null) where T : struct;
    public ObservableGauge<T> CreateObservableGauge<T>(string name, Func<T> observe, string? unit = null) where T : struct;
}

// Built-in meters
public sealed class HexGuardMeters
{
    public const string MeterName = "HexGuard";
    public static readonly Counter<long> ApiErrors;
    public static readonly Histogram<double> DbQueryDuration;
    public static readonly UpDownCounter<long> ActiveSessions;
}

// Prometheus endpoint
public static IEndpointRouteBuilder MapHexGuardMetrics(this IEndpointRouteBuilder endpoints,
    string pattern = "/metrics");
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Metrics/` with `.csproj`.
2. Implement pre-built meters, business metric helpers, prometheus endpoint.
3. Add xunit tests for counter/histogram/gauge correctness.
4. Register in `HexGuard.slnx`.
