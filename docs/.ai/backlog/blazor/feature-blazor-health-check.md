---
id: feature-blazor-health-check
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.HealthCheck'
---

# HexGuard.Blazor.HealthCheck

## Summary

Health check monitoring for Blazor — client-side health endpoint polling, circuit health, and dependency status signals. For operational dashboards and deployment verification.

## Goals

- Poll server health endpoints with configurable intervals
- Circuit health monitoring (latency, connection state)
- Dependency health aggregation (database, cache, external APIs)
- Health status signals (healthy, degraded, unhealthy)
- Health history for trend visibility
- Auto-pause polling when tab hidden
- Configurable alert thresholds

## Non-Goals

- No server-side health check implementation
- No alerting or notification delivery
- No rendered health dashboard UI

## Proposed Public API

```csharp
public interface IHealthCheckService
{
    HealthStatus OverallStatus { get; }
    IReadOnlyList<DependencyHealth> Dependencies { get; }
    DateTimeOffset? LastChecked { get; }
    IReadOnlyList<HealthSnapshot> History { get; }

    event Action? HealthChanged;
    Task RefreshAsync();
    void StartPolling(TimeSpan interval);
    void StopPolling();
}

public enum HealthStatus { Healthy, Degraded, Unhealthy }

public sealed record DependencyHealth(
    string Name,
    HealthStatus Status,
    string? Description,
    double ResponseTimeMs,
    DateTimeOffset LastChecked
);

public sealed record HealthSnapshot(
    DateTimeOffset Timestamp,
    HealthStatus OverallStatus,
    IReadOnlyList<DependencyHealth> Dependencies
);

// Registration
builder.Services.AddBlazorHealthCheck(options =>
{
    options.Endpoints = new[]
    {
        new HealthEndpoint("/health", "API"),
        new HealthEndpoint("/health/database", "Database"),
        new HealthEndpoint("/health/cache", "Cache")
    };
    options.PollingInterval = TimeSpan.FromSeconds(30);
    options.HistorySize = 100;
    options.CircuitMonitoring = true;
});

// Usage
@inject IHealthCheckService Health

<div class="health-indicator @Health.OverallStatus.ToString().ToLower()">
    @if (Health.OverallStatus == HealthStatus.Healthy)
    {
        <span>All systems operational</span>
    }
    else
    {
        <span>@Health.Dependencies.Count(d => d.Status != HealthStatus.Healthy) issues</span>
    }
</div>
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.HealthCheck/` with `.csproj` (RCL).
2. Implement health polling, circuit monitoring, dependency aggregation, history.
3. Add auto-pause on tab hidden, alert thresholds.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
