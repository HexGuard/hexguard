---
id: feature-dotnet-outbox
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Outbox
---

# HexGuard.Outbox

## Summary

Outbox pattern — store domain events in the same DB transaction, publish asynchronously. Prevents lost events when message broker is unavailable.

## Proposed Public API

```csharp
builder.Services.AddOutbox<AppDbContext>(options => {
    options.PollingInterval = TimeSpan.FromSeconds(5);
    options.MaxRetries = 3;
});

public interface IOutboxPublisher
{
    Task PublishPendingAsync(CancellationToken ct);
}

// Events are captured automatically via EF Core SaveChanges interceptor
// and published by a background service
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Outbox/`.
2. Implement outbox table model and EF Core interceptor.
3. Implement background publisher.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
