---
id: feature-blazor-presence
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Presence
---

# HexGuard.Blazor.Presence

## Summary

User presence and awareness for Blazor apps — track online/away/busy status, typing indicators, and connected peers. For Blazor Server (which maintains a persistent SignalR circuit), presence is a natural extension of the circuit lifecycle. For Blazor WASM, uses a lightweight transport.

**Angular counterpart:** `@hexguard/angular-presence`

**Competition check:** Zero Blazor presence packages exist. Blazor Server has built-in circuit tracking but exposes no public presence API.

## Why Wide Adoption

Presence indicators ("3 people viewing", "Alice is typing") are standard in collaborative apps. Blazor Server's persistent circuit connection makes Blazor uniquely suited for real-time presence — the circuit IS a presence signal.

## Goals

1. Provide `PresenceService` — track user status and connected peers.
2. Detect Blazor Server circuit connection/disconnection as presence heartbeat.
3. Support status: online, away, busy, offline.
4. Support typing indicators per context.
5. Support custom peer metadata (avatar, display name, role).

## Proposed Public API

```csharp
public sealed record PeerInfo
{
    public string UserId { get; init; }
    public string DisplayName { get; init; }
    public string Status { get; init; }        // "online", "away", "busy"
    public DateTime LastSeen { get; init; }
    public string[] TypingIn { get; init; }    // Contexts where typing
}

public sealed class PresenceService : IAsyncDisposable
{
    public string Status { get; set; } = "online";
    public IReadOnlyList<PeerInfo> Peers { get; private set; }
    public event Action? OnPeersChanged;

    public Task ConnectAsync(string userId, string displayName);
    public Task DisconnectAsync();
    public void SetTyping(string context, bool isTyping);
}

// Registration
builder.Services.AddScoped<PresenceService>();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Presence/` Razor class library.
2. Implement `PresenceService` with transport abstraction.
3. Implement Blazor Server circuit-based transport.
4. Implement WebSocket-based WASM transport.
5. Test with bUnit.
6. Publish as NuGet.
