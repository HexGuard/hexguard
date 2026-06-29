---
id: feature-blazor-animation
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.Animation'
---

# HexGuard.Blazor.Animation

## Summary

Animation lifecycle and transition coordination for Blazor — enter/exit animation hooks, CSS transition triggers, and animation sequencing. Fills the gap between Blazor's render cycle and the browser's animation APIs.

## Pain Point

Blazor has no animation system. Triggering CSS transitions on state changes requires hacks: toggling CSS classes via `@key` resets, manual `ElementReference` + JS interop for Web Animations API, or third-party JS libraries. Common patterns like list enter/exit animations, route transitions, and staggered animations require significant custom code per component.

## Goals

- Enter/exit animation lifecycle hooks (`OnEnter`, `OnEntered`, `OnExit`, `OnExited`)
- CSS class toggling coordinated with render cycle
- Animation sequencing (chain animations in order)
- Staggered animations (delay between list items)
- Route transition animation state
- Reduced-motion preference detection
- Web Animations API interop for complex animations

## Non-Goals

- No rendered animation components — headless lifecycle state only
- No CSS animation library or keyframe definitions
- No canvas/WebGL animations

## Proposed Public API

```csharp
// Animation trigger
public interface IAnimationController
{
    Task PlayAsync(string animationName, AnimationOptions? options = null);
    void Stop(string animationName);
    bool IsPlaying(string animationName);
    AnimationState GetState(string animationName);
}

public sealed record AnimationOptions
{
    public int DurationMs { get; init; } = 300;
    public int DelayMs { get; init; } = 0;
    public string? Easing { get; init; } = "ease";
    public int? StaggerDelayMs { get; init; }
    public AnimationFill Fill { get; init; } = AnimationFill.Both;
}

public enum AnimationState { Idle, Entering, Entered, Exiting, Exited }
public enum AnimationFill { None, Forwards, Backwards, Both }

// List stagger helper
public interface IStaggeredList
{
    int GetItemDelay(int index);
    event Action<int>? ItemEntered;
}

// Reduced motion
public interface IMotionPreference
{
    bool PrefersReducedMotion { get; }
    event Action<bool>? PreferenceChanged;
}

// Route transition
public interface IRouteTransition
{
    Task EnterAsync();
    Task ExitAsync();
}

// Registration
builder.Services.AddBlazorAnimation();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.Animation/` with `.csproj` (RCL).
2. Implement animation lifecycle, CSS class coordination, sequencing, staggering.
3. Add route transition state, reduced motion detection, WAAPI interop.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
