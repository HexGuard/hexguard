---
id: feature-blazor-websocket
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.WebSocket
---

# HexGuard.Blazor.WebSocket

## Summary

Typed WebSocket connection state for Blazor â€” connect, auto-reconnect, send/receive typed messages. Blazor counterpart to `@hexguard/angular-websocket`.


## Goals

- Provide reactive headless state for Blazor components
- SSR-safe with interactive server mode compatibility
- Minimal JavaScript interop, preferring native Blazor patterns


## Non-Goals

- No rendered UI components — headless state and services only
- No JavaScript library dependencies
- No server-side API integration (client-side state management only)

## Proposed Public API

```csharp
public sealed class WebSocketConnection<TReceive, TSend> : IAsyncDisposable
{
    public bool IsConnected { get; private set; }
    public bool IsConnecting { get; private set; }
    public string? Error { get; private set; }
    public IReadOnlyList<TReceive> Messages { get; private set; }
    public event Action? OnStateChanged;
    public event Action<TReceive>? OnMessage;

    public WebSocketConnection(string url, Action<WebSocketOptions>? configure = null);
    public Task ConnectAsync();
    public Task DisconnectAsync();
    public Task SendAsync(TSend message);
}

// Registration
builder.Services.AddScoped<WebSocketConnection<MyMessage, MyMessage>>(sp =>
    new("wss://api.example.com/ws"));
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.WebSocket/` Razor class library.
2. Implement via `ClientWebSocket` (WASM) or `System.Net.WebSockets`.
3. Test with bUnit.
4. Publish as NuGet.
