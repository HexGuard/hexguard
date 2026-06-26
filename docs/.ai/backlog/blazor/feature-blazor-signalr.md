---
id: feature-blazor-signalr
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.SignalR
---

# HexGuard.Blazor.SignalR

## Summary

Typed SignalR hub connection state for Blazor — manage connection lifecycle, auto-reconnect, invoke hub methods, and receive typed messages with reactive state. Promoted from the cross-stack sidenote as a Blazor-side primitive.

**Cross-stack counterpart:** Pairs with `HexGuard.SignalR` for hub contract definitions.

**Competition check:** ASP.NET Core's `HubConnectionBuilder` requires manual wiring. No Blazor package provides a typed, lifecycle-managed SignalR connection.

## Proposed Public API

```csharp
public sealed class SignalRConnection<THub> : IAsyncDisposable where THub : class
{
    public bool IsConnected { get; private set; }
    public string? Error { get; private set; }
    public event Action? OnStateChanged;
    public event Action<Exception>? OnReconnecting;
    public event Action<string?>? OnReconnected;

    public Task ConnectAsync(Uri hubUrl, CancellationToken ct);
    public Task DisconnectAsync();
    public Task InvokeAsync(string method, CancellationToken ct, params object[] args);
    public Task<T?> InvokeAsync<T>(string method, CancellationToken ct, params object[] args);
    public IDisposable On<T>(string method, Action<T> handler);
}

// Registration
builder.Services.AddScoped<SignalRConnection<IOrderHub>>(sp =>
{
    var conn = new SignalRConnection<IOrderHub>();
    conn.ConnectAsync(new Uri(builder.HostEnvironment.BaseAddress, "/hubs/orders"));
    return conn;
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.SignalR/` Razor class library.
2. Implement typed `SignalRConnection<THub>` wrapping `HubConnection`.
3. Implement auto-reconnect and state events.
4. Test with bUnit.
5. Publish as NuGet.
