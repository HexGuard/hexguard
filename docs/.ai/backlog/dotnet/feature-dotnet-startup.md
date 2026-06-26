---
id: feature-dotnet-startup
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Startup
---

# HexGuard.Startup

## Summary

Production startup infrastructure — ordered startup tasks, blocking readiness, graceful shutdown with request draining.

## Proposed Public API

```csharp
public interface IStartupTask
{
    string Name { get; }
    int Order { get; }
    Task ExecuteAsync(CancellationToken ct);
}

builder.Services.AddStartupTask<MigrateDatabaseTask>();
builder.Services.AddStartupTask<ValidateConfigurationTask>();
builder.Services.AddStartupTask<WarmCacheTask>();

app.UseStartupTasks(opts => { opts.BlockReadyOnStartup = true; });  // /health → Unhealthy until done
app.UseGracefulShutdown(opts => { opts.DrainTimeout = TimeSpan.FromSeconds(30); });  // 503 + drain on SIGTERM
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Startup/`.
2. Implement ordered startup tasks.
3. Implement graceful shutdown with draining.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
