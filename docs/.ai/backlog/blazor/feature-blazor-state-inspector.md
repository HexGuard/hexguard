---
id: feature-blazor-state-inspector
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.StateInspector'
---

# HexGuard.Blazor.StateInspector

## Summary

Development-time state inspection for Blazor — component state snapshot, render history, DI dependency graph, and circuit diagnostics. For debugging complex Blazor applications.

## Pain Point

Debugging Blazor state issues is hard: there's no way to inspect a component's current parameter values, no render history to see what triggered re-renders, no visibility into the DI container at runtime, and circuit state is invisible. Developers add temporary logging that clutters code.

## Goals

- Component state snapshot (parameters, cascading values, injected services)
- Render history with trigger attribution
- DI container inspection (registered services, lifetimes, instances)
- Circuit diagnostics (latency, memory, connection state)
- Development-only — stripped from production
- Browser console API for programmatic access

## Non-Goals

- No browser DevTools extension
- No production monitoring
- No remote debugging

## Proposed Public API

```csharp
// Registration (development only)
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddBlazorStateInspector(options =>
    {
        options.EnableComponentInspector = true;
        options.EnableDiInspector = true;
        options.EnableCircuitDiagnostics = true;
        options.EnableConsoleApi = true;
    });
}

// Console API (window.__blazorInspector)
// Accessible via browser console JS:
// __blazorInspector.components.list()
// __blazorInspector.components.snapshot('Counter')
// __blazorInspector.di.services()
// __blazorInspector.circuit.status()

// C# API
public interface IStateInspector
{
    // Components
    IReadOnlyList<ComponentSnapshot> GetActiveComponents();
    ComponentSnapshot? GetComponent(string name);
    IReadOnlyList<RenderEvent> GetRenderHistory(string componentName);
    void ClearRenderHistory();

    // DI
    IReadOnlyList<ServiceInfo> GetRegisteredServices();
    ServiceInfo? GetService(Type serviceType);

    // Circuit (Server only)
    CircuitInfo GetCircuitInfo();
}

public sealed record ComponentSnapshot(
    string TypeName,
    int RenderCount,
    IReadOnlyDictionary<string, object?> Parameters,
    IReadOnlyList<string> InjectedServices,
    bool IsInteractive,
    DateTimeOffset CreatedAt
);

public sealed record RenderEvent(
    DateTimeOffset Timestamp,
    string Trigger,
    double DurationMs,
    bool IsFirstRender
);

public sealed record ServiceInfo(string TypeName, string Lifetime, bool IsInstantiated);

public sealed record CircuitInfo(
    string CircuitId,
    DateTimeOffset ConnectedAt,
    long MemoryBytes,
    int ComponentCount,
    double AverageLatencyMs
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.StateInspector/` with `.csproj` (RCL).
2. Implement component snapshot, render history, DI inspector, circuit diagnostics.
3. Add console API via JS interop, production stripping.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
