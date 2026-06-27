---
id: feature-dotnet-event-bus
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.EventBus'
---

# HexGuard.EventBus

## Summary

In-process event bus for .NET — publish/subscribe with handler registration, ordering, and error isolation. For decoupling domain events, integration events, and cross-cutting concerns.

## Goals

- Publish/subscribe with multiple handlers per event type
- Handler ordering (first, last, before/after another handler)
- Error isolation (one failing handler doesn't block others)
- Scoped and singleton handler lifetime support
- Event metadata (correlation ID, timestamp, source)
- Dead-letter for failed events (configurable retry)
- OpenTelemetry activity propagation through events

## Non-Goals

- No distributed/message-queue event bus (in-process only)
- No event sourcing or event store
- No saga orchestration

## Proposed Public API

```csharp
public interface IEventBus
{
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken ct = default) where TEvent : IEvent;
}

public interface IEventHandler<in TEvent> where TEvent : IEvent
{
    Task HandleAsync(TEvent @event, CancellationToken ct = default);
    int Order => 0;
}

public interface IEvent
{
    Guid EventId { get; }
    DateTimeOffset Timestamp { get; }
    string? CorrelationId { get; }
}

// Registration
public static IServiceCollection AddHexGuardEventBus(this IServiceCollection services,
    Action<EventBusOptions>? configure = null);

// Options
public sealed class EventBusOptions
{
    public int MaxRetries { get; set; } = 0;
    public bool EnableDeadLetter { get; set; }
    public bool PublishHandlerErrors { get; set; }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.EventBus/` with `.csproj`.
2. Implement publish/subscribe, handler ordering, error isolation.
3. Add dead-letter and retry support.
4. Add xunit tests for ordering, error isolation, scoped handlers.
5. Register in `HexGuard.slnx`.
