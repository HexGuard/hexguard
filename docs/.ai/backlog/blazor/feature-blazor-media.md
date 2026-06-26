---
id: feature-blazor-media
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Media
---

# HexGuard.Blazor.Media

## Summary

Audio/video playback state for Blazor — wraps HTML5 media elements with reactive state via JS interop. Blazor counterpart to `@hexguard/angular-media`.

## Proposed Public API

```csharp
public sealed class MediaPlayer : IAsyncDisposable
{
    public MediaPlayer(ElementReference element, IJSRuntime js);

    public bool IsPlaying { get; private set; }
    public double Duration { get; private set; }
    public double CurrentTime { get; private set; }
    public double Volume { get; private set; }
    public bool IsMuted { get; private set; }
    public double PlaybackRate { get; private set; }
    public double Buffered { get; private set; }
    public event Action? OnStateChanged;

    public Task PlayAsync();
    public Task PauseAsync();
    public Task SeekAsync(double time);
    public Task SetVolumeAsync(double volume);
    public Task ToggleMuteAsync();
    public Task SetRateAsync(double rate);
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Media/` Razor class library.
2. Implement via `IJSRuntime` wrapping HTMLMediaElement.
3. Test with bUnit.
4. Publish as NuGet.
