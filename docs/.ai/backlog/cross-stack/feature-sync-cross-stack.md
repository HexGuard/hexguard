---
id: feature-sync-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Sync + @hexguard/angular-sync'
---

# Sync Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for offline-first data sync — the .NET side provides a sync endpoint that accepts pending changes and returns remote changes; the Angular side tracks local changes, queues them, and pushes on reconnect.

## Shared Contract

### .NET (`HexGuard.Sync`)

```csharp
public sealed record SyncRequest
{
    public IReadOnlyList<PendingChange> Changes { get; init; }
    public DateTime? LastSyncedAt { get; init; }
}

public sealed record SyncResponse
{
    public IReadOnlyList<SyncResult> Results { get; init; }
    public IReadOnlyList<RemoteChange> RemoteChanges { get; init; }
    public DateTime SyncedAt { get; init; }
}

app.MapPost("/sync", async (SyncRequest req, ISyncEngine engine) =>
{
    var result = await engine.SyncAsync(req);
    return Results.Ok(result);
});
```

### Angular (`@hexguard/angular-sync`)

```typescript
const sync = injectSync({
  push: (changes) => api.post('/sync', { changes }).then(r => r.results),
  pull: (since) => api.get(`/sync?since=${since.toISOString()}`).then(r => r.remoteChanges),
  conflictResolver: (local, remote) => ({ ...local, ...remote }),
});

sync.trackChange('order', '123', { status: 'confirmed' });
await sync.sync();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Sync/` with sync endpoint and conflict resolution.
2. Create `angular/packages/angular-sync/` with pending change tracking and push/pull.
3. Add tests on both sides.
4. Register both packages.
