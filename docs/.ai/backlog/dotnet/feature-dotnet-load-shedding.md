---
id: feature-dotnet-load-shedding
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.LoadShedding
---

# HexGuard.LoadShedding

## Summary

Intelligent load shedding — reject or queue low-priority requests when under load. Protects the system during traffic spikes.

## Proposed Public API

```csharp
app.UseLoadShedding(options => {
    options.MaxConcurrentRequests = 1000;
    options.QueueSize = 500;
    options.PriorityHeader = "X-Priority";
    options.RejectionStatusCode = 503;
});

app.MapGet("/api/products", GetProducts).WithPriority(Priority.High);
app.MapGet("/api/analytics", GetAnalytics).WithPriority(Priority.Low);

public enum Priority { Critical, High, Normal, Low, Background }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.LoadShedding/`.
2. Implement request counting, queue, priority-based rejection.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
