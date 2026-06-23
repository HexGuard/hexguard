---
id: feature-blazor-confirmation
type: feature
status: dropped-niche
created: 2026-06-23
package: HexGuard.Blazor.Confirmation
---

# HexGuard.Blazor.Confirmation

## Summary

Headless confirmation dialog state for Blazor — promise-based `Ask()` / `Run()` flows for destructive or high-impact actions. Blazor has no built-in confirmation pattern; developers must manually manage `isOpen`, `currentRequest`, and resolve/reject callbacks for every dialog.

## Goals

1. Provide a `ConfirmationService` injectable with `Ask()` (returns `Task<bool>`) and `Run()` (returns `Task<ConfirmationResult<T>>`).
2. Provide reactive `IsOpen` and `CurrentRequest` state for binding in a Blazor dialog component.
3. Prevent duplicate dialogs (reject new `Ask()` while one is open).
4. Support `destructive` hints for styling confirmation differently.
5. No mandatory UI coupling — render the dialog UI however you want.

## Non-Goals

- No modal/dialog UI component — headless state only.
- No CSS or animation.

## Decisions

1. **Service-based**: `ConfirmationService` is registered as `Scoped` and injected into components.
2. **TaskCompletionSource-based**: Internally uses `TaskCompletionSource<bool>` for promise-style flow.
3. **No JS interop**: Entirely server-side within the Blazor circuit.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record ConfirmationRequest
{
    public required string Title { get; init; }
    public required string Message { get; init; }
    public string ConfirmLabel { get; init; } = "Confirm";
    public string CancelLabel { get; init; } = "Cancel";
    public bool Destructive { get; init; }
}

public sealed record ConfirmationResult<T>
{
    public bool Confirmed { get; init; }
    public T? Result { get; init; }
}

// ── Service ───────────────────────────────────────────────

public sealed class ConfirmationService
{
    public bool IsOpen { get; private set; }
    public ConfirmationRequest? CurrentRequest { get; private set; }
    public event Action? OnChange; // Notify UI to re-render

    public Task<bool> Ask(ConfirmationRequest request);
    public void Confirm();
    public void Cancel();
    public async Task<ConfirmationResult<T>> Run<T>(
        ConfirmationRequest request,
        Func<Task<T>> action);
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<ConfirmationService>();

// ── Usage ─────────────────────────────────────────────────

@inject ConfirmationService Confirm

@if (Confirm.IsOpen)
{
    <div class="modal-overlay">
        <div class="modal">
            <h3>@Confirm.CurrentRequest?.Title</h3>
            <p>@Confirm.CurrentRequest?.Message</p>
            <button @onclick="Confirm.Confirm">@Confirm.CurrentRequest?.ConfirmLabel</button>
            <button @onclick="Confirm.Cancel">@Confirm.CurrentRequest?.CancelLabel</button>
        </div>
    </div>
}

<button @onclick="DeleteItem">Delete Item</button>

@code {
    private async Task DeleteItem()
    {
        var ok = await Confirm.Ask(new() { Title = "Delete?", Message = "Are you sure?" });
        if (ok) await itemService.DeleteAsync();
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Confirmation/` with Razor class library `.csproj`.
2. Implement `ConfirmationRequest` record, `ConfirmationResult<T>` record.
3. Implement `ConfirmationService` with `Ask`, `Run`, `Confirm`, `Cancel`.
4. Create test project with xUnit + bUnit.
5. Publish as NuGet package.
