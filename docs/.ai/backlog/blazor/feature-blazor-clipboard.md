---
id: feature-blazor-clipboard
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Clipboard
---

# HexGuard.Blazor.Clipboard

## Summary

Typed clipboard API wrapper for Blazor WebAssembly — copy text/HTML/images to the clipboard, read from clipboard, and check permissions via `navigator.clipboard`. The "Copy to clipboard" button is one of the most common UI patterns in web apps, yet every Blazor implementation requires bespoke JS interop.

**Competition check (NuGet):** Zero dedicated Blazor clipboard packages exist. Some utility libraries include clipboard helpers as a minor feature.

## Why Wide Adoption

"Copy link," "Copy code snippet," "Copy API key," "Copy table data" — every app has copy-to-clipboard buttons. The Clipboard API (`navigator.clipboard.writeText()`) requires permission and only works in secure contexts (HTTPS). A typed, reactive clipboard service makes this a one-liner in any Blazor component.

## Goals

1. Provide `ClipboardService` with `CopyTextAsync`, `CopyHtmlAsync`, `PasteTextAsync`.
2. Check `Permissions` API to verify clipboard write/read access.
3. Return `bool` success indicator for copy operations.
4. Fire `OnCopy` event for UI feedback (e.g., "Copied!" toast).
5. WASM-only in core (`navigator.clipboard` not available in Server mode).

## Non-Goals

- No image or binary data clipboard support (extendable later).
- No clipboard monitoring or change events (privacy-sensitive API).

## Decisions

1. **JS interop required**: `navigator.clipboard` is a browser API. A small `clipboard.js` module is auto-registered.
2. **WASM-first**: Service checks `OperatingSystem.IsBrowser()` and falls back to a no-op in Server mode.

## Proposed Public API

```csharp
// ── Service ───────────────────────────────────────────────

public sealed class ClipboardService : IAsyncDisposable
{
    public Task<bool> CopyTextAsync(string text);
    public Task<bool> CopyHtmlAsync(string html);
    public Task<string?> PasteTextAsync();
    public Task<bool> HasWritePermissionAsync();
    public Task<bool> HasReadPermissionAsync();
    public event Action? OnCopySuccess;
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<ClipboardService>();

// ── Usage ─────────────────────────────────────────────────

@inject ClipboardService Clipboard
@implements IDisposable

<button @onclick="CopyLink">Copy Link</button>
<span class="feedback">@feedback</span>

@code {
    private string feedback = "";

    private async Task CopyLink()
    {
        var ok = await Clipboard.CopyTextAsync("https://example.com/item/42");
        if (ok)
        {
            feedback = "Copied!";
            await Task.Delay(2000);
            feedback = "";
        }
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Clipboard/` with Razor class library `.csproj`.
2. Create `clipboard.js` module auto-registered as embedded resource.
3. Implement `ClipboardService` with copy/paste and permission checking.
4. Add WASM-only fallback.
5. Create test project with bUnit + mocked `IJSRuntime`.
6. Publish as NuGet package `HexGuard.Blazor.Clipboard`.
