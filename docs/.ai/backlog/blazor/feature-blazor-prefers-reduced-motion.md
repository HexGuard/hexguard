---
id: feature-blazor-prefers-reduced-motion
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.PrefersReducedMotion
---

# HexGuard.Blazor.PrefersReducedMotion

## Summary

Accessible animation control for Blazor via the `prefers-reduced-motion` CSS media query. Detect whether the user has requested reduced motion in their OS accessibility settings, and conditionally disable animations, transitions, and parallax effects.

**Competition check (NuGet):** Zero packages. **Greenfield.**

## Why Wide Adoption

WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) requires respecting `prefers-reduced-motion`. Every Blazor app with animations, transitions, or parallax scrolling needs to check this setting. Without a package, developers must write raw JS interop or ignore accessibility entirely. As accessibility requirements become legally mandated (EU Accessibility Act, ADA), this package becomes essential compliance infrastructure.

## Goals

1. Provide `PrefersReducedMotionService` with a `IsReducedMotion` property updated reactively.
2. Fire an event when the setting changes (user switches OS accessibility preference mid-session).
3. Provide `UseAnimations` boolean flow for conditional rendering.
4. No JavaScript interop at runtime — pure CSS-based detection with a single initialization call.
5. Automatic cleanup on component disposal.

## Decisions

1. **CSS + JS hybrid**: Uses `window.matchMedia("(prefers-reduced-motion: reduce)")` for initial detection and change events.
2. **Single JS call**: One `IJSRuntime.InvokeAsync` on initialization, then native JS listener for updates.

## Proposed Public API

```csharp
public sealed class PrefersReducedMotionService : IDisposable
{
    public bool IsReducedMotion { get; private set; }
    public event Action? OnChanged;

    public Task InitializeAsync();
}

// Usage:
@inject PrefersReducedMotionService Motion
@if (!Motion.IsReducedMotion)
{
    <div class="parallax-bg">...</div>
}
```

## Implementation Plan

1. Create Razor class library project.
2. Implement JS module with `matchMedia` listener.
3. Implement `PrefersReducedMotionService`.
4. Test with bUnit.
