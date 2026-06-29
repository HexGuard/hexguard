---
id: feature-blazor-pwa-setup
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.PwaSetup'
---

# HexGuard.Blazor.PwaSetup

## Summary

PWA configuration helpers for Blazor — service worker registration, manifest generation, offline page, and install prompt. Eliminates manual PWA plumbing.

## Problem

Blazor's PWA template provides a basic service worker and manifest, but customization is manual and error-prone: cache strategies require hand-written service worker code, update notifications need custom JS, the install prompt has no .NET API, and testing offline behavior is clunky. Most projects skip PWA entirely due to the friction.

## Goals

- Programmatic service worker cache strategy configuration
- Manifest.json generation from configuration
- Update-available notification with reload prompting
- Install prompt state and trigger from .NET code
- Offline page configuration
- Cache warming (pre-cache critical assets)
- PWA installability detection signal
- Push notification subscription helpers

## Non-Goals

- No service worker implementation (configures the existing one)
- No push notification server
- No offline data sync (see HexGuard.Blazor.Offline)

## Proposed Public API

```csharp
// Program.cs
builder.Services.AddBlazorPwa(options =>
{
    options.Manifest = new PwaManifest
    {
        Name = "My App",
        ShortName = "MyApp",
        ThemeColor = "#1a1a2e",
        BackgroundColor = "#ffffff",
        Icons = new[] { "/icon-192.png", "/icon-512.png" }
    };
    options.Cache = new CacheOptions
    {
        Strategy = CacheStrategy.NetworkFirst,
        PreCacheUrls = new[] { "/", "/css/app.css", "/js/app.js" },
        MaxCacheSizeMb = 50
    };
    options.EnableInstallPrompt = true;
    options.EnableUpdateNotifications = true;
});

// In component
@inject IPwaState Pwa

@code {
    // Check if installable
    if (Pwa.CanInstall)
        await Pwa.ShowInstallPromptAsync();

    // Listen for updates
    Pwa.UpdateAvailable += async () =>
        await Pwa.ApplyUpdateAsync(); // reload with new version
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.PwaSetup/` with `.csproj` (RCL with JS interop).
2. Implement manifest generation, cache strategy config, install prompt interop.
3. Add update notification, offline page, push subscription helpers.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
