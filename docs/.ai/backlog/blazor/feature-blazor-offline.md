---
id: feature-blazor-offline
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.Offline'
---

# HexGuard.Blazor.Offline

## Summary

Offline detection, action queueing, and sync-when-online for Blazor WASM. Queue mutations while offline and replay them when connectivity returns.

## Pain Point

Blazor WASM apps run in the browser but lack the offline capabilities that JS PWAs have via service workers and Background Sync. Users on flaky connections lose data or face silent failures. Common pattern: detect offline → queue actions → sync when back online — currently requires custom implementation.

## Goals

- Network status detection (navigator.onLine + active ping)
- Action queue with persistent storage (IndexedDB via JS interop)
- Automatic replay of queued actions when online
- Conflict resolution strategies (last-write-wins, server-wins, manual)
- Queue inspection and manual retry
- Offline indicator signal
- Configurable retry policies per action type

## Non-Goals

- No service worker management
- No PWA manifest generation
- No server-side sync endpoint implementation

## Proposed Public API

```csharp
public interface IOfflineQueue
{
    bool IsOnline { get; }
    int QueuedCount { get; }
    event Action<bool>? OnlineStatusChanged;
    event Action<int>? QueueCountChanged;

    Task EnqueueAsync<T>(string actionKey, T payload, OfflineActionOptions? options = null);
    Task<IReadOnlyList<QueuedAction>> GetQueueAsync();
    Task RemoveFromQueueAsync(string actionId);
    Task RetryAsync(string actionId);
    Task SyncAllAsync();
    Task ClearQueueAsync();
}

public sealed record OfflineActionOptions
{
    public int MaxRetries { get; init; } = 3;
    public TimeSpan RetryDelay { get; init; } = TimeSpan.FromSeconds(5);
    public ConflictStrategy Conflict { get; init; } = ConflictStrategy.LastWriteWins;
}

public enum ConflictStrategy { LastWriteWins, ServerWins, Manual }

// Registration
public static IServiceCollection AddBlazorOffline(this IServiceCollection services,
    Action<OfflineOptions>? configure = null);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.Offline/` with `.csproj` (RCL).
2. Implement network detection, action queue with IndexedDB storage, sync engine.
3. Add conflict resolution and retry policies.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
