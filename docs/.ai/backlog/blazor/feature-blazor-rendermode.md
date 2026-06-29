---
id: feature-blazor-rendermode
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.RenderMode'
---

# HexGuard.Blazor.RenderMode

## Summary

Render mode detection and adaptation for Blazor — detect whether code is running in Static SSR, Interactive Server, Interactive WASM, or pre-rendering, and adapt behavior accordingly.

## Pain Point

Blazor .NET 8+ unified render modes (Static SSR, Interactive Server, Interactive WASM, Interactive Auto) mean the same component can execute in radically different environments:
- Static SSR: no interactivity, no `IJSRuntime`, must render once
- Interactive Server: full .NET, SignalR circuit, server-side
- Interactive WASM: browser .NET, limited APIs, large download
- Pre-rendering: temporary Interactive Server that tears down

Common bugs: calling `IJSRuntime` during Static SSR, referencing `HttpContext` during WASM, enabling interactive features during pre-render that break on hydration.

## Goals

- Detect current render mode at runtime
- Detect whether currently pre-rendering vs. interactive
- Conditional execution based on render mode
- Render mode change events (SSR → Interactive handoff)
- `IJSRuntime` availability guard
- `HttpContext` availability guard

## Non-Goals

- No render mode configuration or switching
- No component relocation between render modes
- No replacement for Blazor's hosting model

## Proposed Public API

```csharp
public interface IRenderModeDetector
{
    RenderMode Current { get; }
    bool IsInteractive { get; }
    bool IsPreRendering { get; }
    bool IsStaticSsr { get; }
    bool IsServer { get; }
    bool IsWebAssembly { get; }
    bool IsJsAvailable { get; }
    bool IsHttpContextAvailable { get; }

    event Action<RenderMode>? RenderModeChanged;
}

public enum RenderMode
{
    Unknown,
    StaticServer,          // Static SSR
    InteractiveServer,     // Interactive Server (SignalR)
    InteractiveWebAssembly,// Interactive WASM
    InteractiveAuto,       // Auto mode (server then WASM)
    PreRendering           // Pre-rendering phase
}

// Component base that auto-detects
public abstract class RenderModeAwareComponent : ComponentBase
{
    [Inject] public IRenderModeDetector Detector { get; set; } = default!;

    protected bool CanUseJs => Detector.IsJsAvailable;
    protected bool IsInteractive => Detector.IsInteractive;
    protected bool IsPreRendering => Detector.IsPreRendering;
}

// Service registration
public static IServiceCollection AddBlazorRenderMode(this IServiceCollection services);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.RenderMode/` with `.csproj` (RCL).
2. Implement render mode detection, guard helpers, change events.
3. Add `RenderModeAwareComponent` base class.
4. Add xunit + bUnit tests for all modes. Register in `HexGuard.slnx`.
