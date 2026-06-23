---
id: feature-blazor-local-storage
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.LocalStorage
---

# HexGuard.Blazor.LocalStorage

## Summary

Typed, reactive localStorage wrapper for Blazor WebAssembly — set/get/remove typed values with JSON serialization, change notification, and optional TTL expiry. Every WASM app needs to persist preferences, tokens, and UI state; `IJSRuntime.InvokeVoidAsync("localStorage.setItem", ...)` is error-prone boilerplate.

**Competition check (NuGet):** Zero Blazor-specific localStorage packages with typed APIs. General `Blazored.LocalStorage` (1.5M+ downloads) exists but is a broad storage abstraction — HexGuard's offering is narrower, TTL-aware, and matches the angular-storage API pattern.

## Why Wide Adoption

Blazor WebAssembly apps run entirely in the browser. localStorage is the primary persistence mechanism for user preferences, auth tokens, theme selection, UI state, and onboarding flags. Nearly every WASM app uses localStorage directly via JS interop. A typed, signal-reactive wrapper would be an immediate dependency.

## Goals

1. Provide `LocalStorageService` with typed `GetAsync<T>`, `SetAsync<T>`, `RemoveAsync` methods.
2. Auto-serialize/deserialize using `System.Text.Json`.
3. Support optional TTL expiry per key (auto-evict stale data).
4. Provide `IAsyncDisposable` for cleanup.
5. Provide `Watch<T>(key)` returning `IAsyncEnumerable<T>` for reactive change streams.
6. WASM only — throw `PlatformNotSupportedException` in Server mode.

## Non-Goals

- No sessionStorage wrapper (trivial to add later as an option).
- No encryption — data is stored as plain JSON.
- No quota management — `localStorage` is ~5MB.

## Decisions

1. **WASM-only**: localStorage is available in WASM but not in Blazor Server (where state lives on the server).
2. **JSON via STJ**: Uses `System.Text.Json` for serialization — no Newtonsoft dependency.
3. **Prefix keys**: All keys prefixed with `hexguard:` to avoid collisions.

## Proposed Public API

```csharp
// ── Service ───────────────────────────────────────────────

public sealed class LocalStorageService
{
    public LocalStorageService(IJSRuntime js);

    public Task<T?> GetAsync<T>(string key);
    public Task SetAsync<T>(string key, T value, TimeSpan? ttl = null);
    public Task RemoveAsync(string key);
    public Task ClearAsync();

    // Reactive: pushes the new value whenever the key changes
    public IAsyncEnumerable<T?> WatchAsync<T>(string key,
        CancellationToken ct = default);
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<LocalStorageService>();

// ── Usage ─────────────────────────────────────────────────

@inject LocalStorageService Storage
@implements IAsyncDisposable

@code {
    private UserPreferences prefs = new();

    protected override async Task OnInitializedAsync()
    {
        prefs = await Storage.GetAsync<UserPreferences>("user-prefs")
            ?? new UserPreferences();
    }

    private async Task SaveTheme(string theme)
    {
        prefs.Theme = theme;
        await Storage.SetAsync("user-prefs", prefs, ttl: TimeSpan.FromDays(30));
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.LocalStorage/` Razor class library.
2. Implement serialization, TTL metadata, key prefixing.
3. Implement `WatchAsync<T>` with polling or storage event listener.
4. Add WASM-only guard.
5. Test with mocked IJSRuntime.
6. Publish as NuGet.
