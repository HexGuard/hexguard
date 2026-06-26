---
id: feature-blazor-network-status
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.NetworkStatus
---

# HexGuard.Blazor.NetworkStatus

## Summary

Online/offline connectivity detection for Blazor WebAssembly — reactive `IsOnline` state that updates when `navigator.onLine` changes, plus connection-type awareness. Every Blazor WASM app needs to adapt UI when the user goes offline; without a package, developers write raw JS interop boilerplate.

**Angular counterpart:** `@hexguard/angular-network-status`

**Competition check (NuGet):** Zero Blazor-specific network-status packages exist. General browser-detection libraries include online/offline as a minor feature but none offer a dedicated, reactive service.

## Why Wide Adoption

Offline-aware UIs are increasingly expected. Apps need to show "You're offline" banners, queue mutations for replay, disable form submission, or switch to cached content. `navigator.onLine` + `online`/`offline` events are the only reliable cross-browser API. Every content-rich Blazor WASM app can benefit from this as an immediate dependency.

## Goals

1. Provide `NetworkStatusService` with `IsOnline` property updated reactively.
2. Fire `OnConnectivityChanged` event when the user goes online/offline.
3. Detect connection type (`wifi`, `cellular`, `ethernet`, `unknown`) via `NetworkInformation` API where available.
4. Provide optional debounce to avoid flickering during transient disconnections.
5. WASM-only — throw `PlatformNotSupportedException` in Server mode where `navigator.onLine` is unavailable.
6. Automatic cleanup on disposal — remove JS event listeners.

## Non-Goals

- No offline queue or mutation replay (use with `@hexguard/angular-offline-queue` pattern or a custom solution).
- No data sync or cache management.
- No connection-quality measurement (latency, bandwidth).

## Decisions

1. **WASM-first**: The service detects the rendering mode on initialization. In Server mode, it defaults to `IsOnline = true` (server is always online) and skips JS interop.
2. **JS interop required**: Uses `IJSRuntime` to attach `online`/`offline` event listeners on `window`. A small `networkStatus.js` module is auto-registered.
3. **DotNetObjectReference**: Uses `DotNetObjectReference` for JS-to-.NET callbacks.

## Proposed Public API

```csharp
// ── Service ───────────────────────────────────────────────

public sealed class NetworkStatusService : IAsyncDisposable
{
    public bool IsOnline { get; private set; }
    public string? ConnectionType { get; private set; }   // "wifi" | "cellular" | "ethernet" | null
    public event Action? OnConnectivityChanged;
    public event Action<string?>? OnConnectionTypeChanged;

    public Task InitializeAsync();      // Must be called once from OnInitializedAsync
}

// ── Models ────────────────────────────────────────────────

public sealed record NetworkStatusSnapshot
{
    public bool IsOnline { get; init; }
    public string? ConnectionType { get; init; }
    public DateTime Timestamp { get; init; }
}

// ── Registration ──────────────────────────────────────────

public static class NetworkStatusExtensions
{
    public static IServiceCollection AddBlazorNetworkStatus(
        this IServiceCollection services);
}

// ── Usage ─────────────────────────────────────────────────

@implements IAsyncDisposable
@inject NetworkStatusService Network

<div class="@(Network.IsOnline ? "online" : "offline")">
    @if (!Network.IsOnline)
    {
        <div class="offline-banner">You are offline. Some features may be unavailable.</div>
    }
</div>

<button @onclick="Submit" disabled="@(!Network.IsOnline)">Submit</button>

@code {
    protected override async Task OnInitializedAsync()
    {
        await Network.InitializeAsync();
        Network.OnConnectivityChanged += StateHasChanged;
    }

    public ValueTask DisposeAsync()
    {
        Network.OnConnectivityChanged -= StateHasChanged;
        return ValueTask.CompletedTask;
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.NetworkStatus/` with Razor class library `.csproj`.
2. Create `networkStatus.js` module auto-registered as embedded resource.
3. Implement `NetworkStatusService` with JS interop for `online`/`offline` events.
4. Implement `NetworkInformation` API for connection-type detection (optional/graceful fallback).
5. Add WASM-only guard — Server mode defaults to online.
6. Create test project with bUnit + mocked `IJSRuntime`.
7. Publish as NuGet package `HexGuard.Blazor.NetworkStatus`.
