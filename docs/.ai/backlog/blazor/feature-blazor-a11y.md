---
id: feature-blazor-a11y
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.A11y'
---

# HexGuard.Blazor.A11y

## Summary

Accessibility helpers for Blazor — focus management, ARIA live region announcements, keyboard navigation, and accessibility preference detection. For building WCAG-compliant Blazor apps.

## Goals

- Focus trap for modals, dialogs, drawers (with auto-focus and restore)
- ARIA live region announcement service (polite/assertive)
- Keyboard navigation helpers (Enter/Escape/Space/Tab/Arrow)
- User preference signals (reduced motion, high contrast, dark mode)
- Skip-to-content navigation
- Accessible name computation from ARIA attributes
- Focus visible ring management

## Non-Goals

- No rendered accessibility components
- No automated a11y testing or auditing
- No screen reader simulation

## Proposed Public API

```csharp
public interface IFocusManager
{
    Task FocusAsync(ElementReference element);
    Task FocusFirstAsync(ElementReference container);
    Task TrapFocusAsync(ElementReference container);
    void ReleaseFocus();
    ValueTask<ElementReference> GetFocusedElementAsync();
}

public interface ILiveRegionAnnouncer
{
    void Announce(string message, AriaLive priority = AriaLive.Polite);
    void Clear();
}

public enum AriaLive { Off, Polite, Assertive }

public interface IA11yPreferences
{
    bool PrefersReducedMotion { get; }
    bool PrefersHighContrast { get; }
    ColorScheme PrefersColorScheme { get; }
    event Action? PreferencesChanged;
}

public enum ColorScheme { Light, Dark, NoPreference }

// Registration
builder.Services.AddBlazorA11y();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.A11y/` with `.csproj` (RCL).
2. Implement focus management, live region, keyboard helpers, preferences.
3. Add skip-link and focus ring management.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
