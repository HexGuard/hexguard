---
id: feature-blazor-focus-trap
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.FocusTrap
---

# HexGuard.Blazor.FocusTrap

## Summary

Focus trapping for Blazor modals, drawers, and dialogs — traps Tab and Shift+Tab cycling within a container element so keyboard users cannot tab behind overlays. A critical accessibility primitive that every modal/dialog component needs.

**Competition check (NuGet):** `BlazorTrap` (~500 downloads, .NET 5 only, abandoned). No modern Blazor focus-trap package exists. **Greenfield.**

## Why Wide Adoption

WCAG 2.1 Success Criterion 2.1.2 (No Keyboard Trap) and 2.4.3 (Focus Order) require focus management in modals and dialogs. Every UI library (MudBlazor, Radzen, FluentUI, BootstrapBlazor, etc.) implements focus trapping internally — but there's no standalone, reusable focus-trap package for custom Blazor components. A headless focus trap would be adopted by every team building custom overlays.

## Goals

1. Provide `FocusTrapService` that traps Tab cycling within a given `ElementReference`.
2. Provide `FocusTrap.razor` component wrapping content with automatic trap activation.
3. Support `AutoFocus` — automatically focus the first focusable element on activation.
4. Support `RestoreFocus` — return focus to the trigger element on deactivation.
5. Return focus to the previously focused element when the trap is disabled.
6. Automatic cleanup on component disposal.

## Non-Goals

- No modal or dialog UI — headless focus management only.
- No focus styling or visual indicators.

## Decisions

1. **JS interop required**: Focus trapping requires enumerating focusable elements and programmatically moving focus. A small `focusTrap.js` module is auto-registered.
2. **Component + Service**: Both a declarative `<FocusTrap>` component and an imperative `FocusTrapService` are provided.
3. **CSS selector-based**: Focusable elements are identified by querying `button, input, select, textarea, [tabindex]:not([tabindex="-1"])`.

## Proposed Public API

```csharp
// ── Component ─────────────────────────────────────────────

@* FocusTrap.razor *@
public partial class FocusTrap : IDisposable
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public bool Active { get; set; }
    [Parameter] public bool AutoFocus { get; set; } = true;
    [Parameter] public bool RestoreFocus { get; set; } = true;
}

// ── Service ───────────────────────────────────────────────

public sealed class FocusTrapService
{
    public Task ActivateAsync(ElementReference container,
        bool autoFocus = true);
    public Task DeactivateAsync();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<FocusTrapService>();

// ── Usage ─────────────────────────────────────────────────

<FocusTrap Active="isOpen" AutoFocus="true" RestoreFocus="true">
    <div class="modal">
        <h2>Modal Title</h2>
        <input @ref="firstName" placeholder="First name" />
        <button @onclick="() => isOpen = false">Close</button>
    </div>
</FocusTrap>
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.FocusTrap/` Razor class library.
2. Create `focusTrap.js` module.
3. Implement `FocusTrapService`.
4. Implement `FocusTrap.razor` component.
5. Test with bUnit + mocked IJSRuntime.
6. Publish as NuGet.
