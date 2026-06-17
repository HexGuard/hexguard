---
id: feature-signalr-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.SignalR + @hexguard/angular-signalr'
---

# SignalR Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.SignalR` + `@hexguard/angular-signalr`) for typed SignalR hub contracts, Angular connection state, reconnection strategy, channel lifecycle, and typed event-stream signals for real-time full-duplex communication.

The repeated problem is that SignalR is the standard real-time transport for ASP.NET Core + Angular apps, but teams repeatedly implement the same connection lifecycle (start, reconnect, disconnect, error), typed hub method contracts, and channel-based event routing without a standardized abstraction.

## Goals

- Provide .NET base hub classes with typed method contracts (`Hub<T>`).
- Provide Angular `injectHubConnection<T>(url)` with typed method proxies.
- Expose connection state signals (`isConnected`, `isReconnecting`, `lastError`, `connectionId`).
- Support automatic reconnection with configurable retry policy.
- Support channel-based event routing (subscribe to specific event types within a connection).
- Keep the Angular package dependency-free beyond `@microsoft/signalr` and `@angular/core`.

## Proposed Public API

```csharp
// .NET — typed hub
public interface IOrderHubClient
{
    Task OrderStatusChanged(int orderId, string newStatus);
    Task OrderCreated(OrderDto order);
}

public class OrderHub : Hub<IOrderHubClient>
{
    public async Task SubscribeToOrder(int orderId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"order-{orderId}");
    }
}
```

```ts
// Angular
const hub = injectHubConnection<IOrderHubClient>('/hubs/orders', {
  withCredentials: true,
  reconnectPolicy: {
    maxRetries: 5,
    initialDelayMs: 1000,
  },
});

hub.isConnected;                 // Signal<boolean>
hub.isReconnecting;              // Signal<boolean>
hub.lastError;                   // Signal<Error | null>

hub.on('OrderStatusChanged', (orderId, status) => { ... });
hub.on('OrderCreated', (order) => { ... });

hub.start();
hub.stop();
```

## Implementation Plan

1. Scaffold .NET `HexGuard.SignalR` project + Angular `angular-signalr` project.
2. .NET: Define `Hub<T>` base patterns and registration helpers.
3. Angular: Implement `injectHubConnection()` with connection state signals, typed method binding, reconnection policy.
4. Angular: Implement channel/group subscription helpers.
5. Add unit tests for Angular connection state, reconnection, typed events, cleanup.
6. Add sample hub + demo to `HexGuard.SampleApi` and demo-angular.
7. Add integration tests, docs, release.
