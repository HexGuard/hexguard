---
id: feature-blazor-circuit-guard
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.CircuitGuard'
---

# HexGuard.Blazor.CircuitGuard

## Summary

SignalR circuit connection lifecycle management for Blazor Server — health monitoring, graceful reconnection, and degraded-state handling.

## Pain Point

Blazor Server's SignalR circuit is the application's lifeline. When it disconnects:
- The default reconnection UI is minimal and non-customizable
- No visibility into WHY the circuit dropped (timeout, network, server)
- No graceful degradation (show stale data while reconnecting)
- No circuit health metrics (latency, reconnect count, uptime)
- Server-side circuit tracking is manual
- No circuit-level diagnostics for production debugging

## Goals

- Circuit health signals (latency, state, reconnect attempts)
- Customizable reconnection strategy with backoff
- Graceful degradation during disconnection (preserve UI state)
- Circuit diagnostics (disconnect reason, duration, frequency)
- Server-side circuit tracking and cleanup
- Circuit transfer support (migrate to new server for rolling deployments)

## Non-Goals

- No replacement for SignalR or Blazor Server hosting
- No load balancing or server affinity management
- No rendered reconnection UI (state only)

## Proposed Public API

```csharp
// Client-side (Blazor component)
public interface ICircuitGuard
{
    CircuitState State { get; }
    int ReconnectAttempt { get; }
    TimeSpan TimeSinceLastPing { get; }
    DateTimeOffset? ConnectedSince { get; }
    int TotalDisconnects { get; }
    string? LastDisconnectReason { get; }

    event Action<CircuitState>? StateChanged;
    event Action<int>? ReconnectAttemptChanged;

    Task<bool> TryReconnectAsync();
}

public enum CircuitState { Connected, Reconnecting, Disconnected, Degraded }

// Server-side middleware
public static IApplicationBuilder UseCircuitGuard(this IApplicationBuilder app,
    Action<CircuitGuardOptions>? configure = null);

public sealed class CircuitGuardOptions
{
    public TimeSpan PingInterval { get; set; } = TimeSpan.FromSeconds(5);
    public TimeSpan DisconnectTimeout { get; set; } = TimeSpan.FromMinutes(3);
    public bool EnableCircuitTransfer { get; set; }
    public Action<CircuitDisconnectedContext>? OnDisconnected { get; set; }
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.CircuitGuard/` with `.csproj` (RCL).
2. Implement client-side circuit monitoring, server-side middleware, reconnection strategy.
3. Add graceful degradation, diagnostics, circuit transfer.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
