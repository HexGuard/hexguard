---
id: feature-blazor-form-drafts
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.FormDrafts
---

# HexGuard.Blazor.FormDrafts

## Summary

localStorage-backed form draft persistence for Blazor WebAssembly — debounced auto-save, expiry-based eviction, and restore/clear API. Multi-step wizards and long forms lose data when users navigate away accidentally; Blazor WASM has access to localStorage via `IJSRuntime` but requires manual save/restore wiring.

## Goals

1. Provide `FormDraftService<T>` that persists form data to localStorage with debounce.
2. Support configurable TTL (default 24h) — expired drafts are automatically cleaned.
3. Expose `HasDraft`, `SavedAt`, `ExpiresAt` reactive state.
4. Support custom storage backend (e.g., sessionStorage).
5. WASM-only in core — Server mode requires a different persistence mechanism (session-based).

## Non-Goals

- No Blazor Server support (no `localStorage` available server-side).
- No conflict resolution for multiple tabs.
- No encryption of stored data.

## Decisions

1. **WASM-first**: The service detects the rendering mode and throws `PlatformNotSupportedException` in Server mode.
2. **IJSRuntime-based**: Uses `IJSRuntime.InvokeAsync` to read/write `localStorage`.
3. **Debounce in C#**: Uses `System.Threading.Timer` for debounce (no JS timer needed).

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record DraftMetadata
{
    public DateTime SavedAt { get; init; }
    public DateTime ExpiresAt { get; init; }
}

public sealed record FormDraft<T>
{
    public required T Data { get; init; }
    public required DraftMetadata Meta { get; init; }
}

public sealed record FormDraftOptions
{
    public int DebounceMs { get; init; } = 500;
    public TimeSpan Ttl { get; init; } = TimeSpan.FromHours(24);
}

// ── Service ───────────────────────────────────────────────

public sealed class FormDraftService<T>
{
    public bool HasDraft { get; private set; }
    public DraftMetadata? Metadata { get; private set; }
    public event Action? OnChange;

    public FormDraftService(string key, IJSRuntime js, FormDraftOptions? options = null);

    public Task<FormDraft<T>?> RestoreAsync();
    public Task SaveAsync(T data);
    public Task ClearAsync();
}

// ── Registration ──────────────────────────────────────────

// Registered per-draft-key via factory:
builder.Services.AddScoped(sp => new FormDraftService<MyFormData>(
    "my-form-key",
    sp.GetRequiredService<IJSRuntime>()));

// ── Usage ─────────────────────────────────────────────────

@inject FormDraftService<PostData> Draft
@implements IAsyncDisposable

@if (Draft.HasDraft)
{
    <div class="alert">You have a saved draft from @Draft.Metadata?.SavedAt.ToShortTimeString()</div>
}

<button @onclick="SaveDraft">Save Draft</button>

@code {
    protected override async Task OnInitializedAsync()
    {
        var saved = await Draft.RestoreAsync();
        if (saved is not null) formData = saved.Data;
    }

    private async Task SaveDraft()
    {
        await Draft.SaveAsync(formData);
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.FormDrafts/` with Razor class library `.csproj`.
2. Implement serialization, storage key prefix (`hexguard:draft:`).
3. Implement debounce timer and TTL expiry.
4. Add WASM-only guard with `PlatformNotSupportedException` for Server mode.
5. Create test project with mocked `IJSRuntime`.
6. Publish as NuGet package.
