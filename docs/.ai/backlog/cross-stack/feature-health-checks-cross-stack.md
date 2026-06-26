---
id: feature-health-checks-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.HealthChecks + @hexguard/angular-health'
---

# Health Checks Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for API health monitoring — the .NET side provides a standard health check endpoint with registered checks (database, cache, external APIs); the Angular side provides a live health dashboard with status indicators, check history, and polling.

**Promoted from sidenote:** `HexGuard.HealthChecks` was a .NET sidenote. This brief adds the Angular counterpart and defines the shared contract.

## Why Wide Adoption

Health check endpoints (`GET /health`) are standard infrastructure for every API — used by load balancers, container orchestrators, monitoring tools, and CI/CD pipelines. An Angular health dashboard gives operations teams and support staff visibility into system status without external monitoring tools.

## Goals

### .NET (`HexGuard.HealthChecks`)

1. Provide `MapHealthDashboard()` — maps a `GET /health` endpoint returning structured health data.
2. Support registered health checks via `IHealthCheck` interface.
3. Support `liveness` and `readiness` endpoints (separate paths).
4. Return standard response shape: overall status, per-check status, duration, optional details.

### Angular (`@hexguard/angular-health`)

1. Provide `injectHealthMonitor()` — polls a health endpoint and exposes signal-based state.
2. Expose signals: `status`, `checks`, `lastChecked`, `isChecking`, `isDegraded`, `history`.
3. Support configurable polling interval, auto-stop on tab hidden.
4. Support individual check detail expansion.

## Non-Goals

- No alerting (consumer integrates with their own notification system).
- No SLA/downtime tracking.

## Proposed Public API

### .NET

```csharp
// Health endpoint response:
// GET /health → {
//   status: "Healthy" | "Degraded" | "Unhealthy",
//   duration: "12ms",
//   checks: [
//     { name: "database", status: "Healthy", duration: "5ms" },
//     { name: "cache", status: "Healthy", duration: "2ms" }
//   ]
// }

public static class HealthDashboardExtensions
{
    public static IApplicationBuilder MapHealthDashboard(
        this IApplicationBuilder app,
        string path = "/health",
        Action<HealthDashboardBuilder>? configure = null);
}
```

### Angular

```typescript
export function injectHealthMonitor(url: string): {
  readonly status: Signal<'healthy' | 'degraded' | 'unhealthy'>;
  readonly checks: Signal<HealthCheckResult[]>;
  readonly lastChecked: Signal<Date | null>;
  readonly isChecking: Signal<boolean>;
  readonly history: Signal<HealthSnapshot[]>;     // Last N check results

  check(): Promise<void>;
  startPolling(intervalMs: number): void;
  stopPolling(): void;
};

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  duration: string;
  error?: string;
}

export interface HealthSnapshot {
  timestamp: Date;
  status: string;
  duration: string;
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.HealthChecks/` with standard `.csproj`.
2. Implement health check registration and endpoint.
3. Create Angular package with `injectHealthMonitor()`.
4. Add tests on both sides.
5. Register both packages.
