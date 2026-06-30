---
id: feature-blazor-performance
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.Performance'
---

# HexGuard.Blazor.Performance

## Summary

Performance monitoring for Blazor — render cycle profiling, memory tracking, WASM bundle analysis, and custom metrics. For production diagnostics.

## Pain Point

Blazor performance is opaque: there's no visibility into render cycles (which component re-rendered why), WASM memory usage is invisible, and bundle size only shows up in build output. In production, slow renders and memory leaks go undetected until users complain.

## Goals

- Component render timing and frequency tracking
- Render trigger attribution (parameter change, event, StateHasChanged)
- Memory usage monitoring (WASM heap size)
- WASM assembly size breakdown
- Custom performance metrics
- Performance budget enforcement
- Server-side circuit memory tracking

## Non-Goals

- No RUM backend
- No production APM integration (delegates to reporter)
- No rendered performance UI

## Proposed Public API

```csharp
public interface IBlazorPerformance
{
    // Render tracking
    IReadOnlyList<ComponentRenderStats> GetRenderStats();
    ComponentRenderStats? GetComponentStats(string componentName);
    void ResetRenderStats();

    // Memory (WASM)
    long GetWasmHeapSize();
    double GetMemoryUsageMb();

    // Custom metrics
    IDisposable Measure(string operationName);
    void RecordMetric(string name, double value, Dictionary<string, string>? tags = null);

    // Budgets
    IReadOnlyList<BudgetViolation> CheckBudgets();
}

public sealed record ComponentRenderStats(
    string ComponentName,
    int RenderCount,
    double TotalRenderTimeMs,
    double AverageRenderTimeMs,
    double MaxRenderTimeMs,
    DateTimeOffset FirstRender,
    DateTimeOffset LastRender,
    IReadOnlyList<string> TriggerHistory
);

// Registration
builder.Services.AddBlazorPerformance(options =>
{
    options.TrackRenders = true;
    options.SlowRenderThresholdMs = 16; // 60fps budget
    options.MonitorMemory = true;
    options.SampleRate = 0.1; // 10% of users
    options.Budgets = new[]
    {
        new PerformanceBudget("component-render", 500, BudgetSeverity.Warning),
        new PerformanceBudget("wasm-memory-mb", 150, BudgetSeverity.Error)
    };
});

// Usage
@inject IBlazorPerformance Perf

@code {
    protected override void OnAfterRender(bool firstRender)
    {
        using var measure = Perf.Measure("ProductList.Render");
        // ... render work
    }
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.Performance/` with `.csproj` (RCL).
2. Implement render tracking, memory monitoring, metrics, budgets.
3. Add WASM-specific heap monitoring and assembly size breakdown.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
