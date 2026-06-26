---
id: feature-dotnet-sse
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Sse
---

# HexGuard.Sse

## Summary

Server-Sent Events helpers for ASP.NET Core — typed SSE endpoint, keep-alive, client disconnect detection, and event type routing. SSE is the simplest server-to-client real-time protocol and pairs naturally with Angular's `EventSource` API.

**Competition check:** ASP.NET Core has no built-in SSE support. `Lib.AspNetCore.ServerSentEvents` (1M+ downloads) exists but is complex.

## Proposed Public API

```csharp
public static class SseExtensions
{
    public static RouteHandlerBuilder MapSse(
        this IEndpointRouteBuilder app,
        string pattern,
        Func<ISseConnection, CancellationToken, Task> handler);
}

public interface ISseConnection
{
    string ConnectionId { get; }
    bool IsConnected { get; }
    event Action? OnDisconnected;

    Task SendAsync(string eventType, object data, CancellationToken ct);
    Task SendAsync(string eventType, string data, CancellationToken ct);
    Task SendCommentAsync(string comment, CancellationToken ct);
    Task KeepAliveAsync(CancellationToken ct);
}

// Usage
app.MapSse("/events/notifications", async (ISseConnection conn, CancellationToken ct) =>
{
    // Send initial event
    await conn.SendAsync("connected", new { ts = DateTime.UtcNow }, ct);

    // Keep-alive every 15s
    while (conn.IsConnected && !ct.IsCancellationRequested)
    {
        await Task.Delay(15_000, ct);
        await conn.KeepAliveAsync(ct);
    }
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Sse/`.
2. Implement SSE middleware writing `text/event-stream` responses.
3. Implement `ISseConnection` with keep-alive and disconnect detection.
4. Add tests with `WebApplicationFactory`.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
