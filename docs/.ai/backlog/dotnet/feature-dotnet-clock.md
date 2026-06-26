---
id: feature-dotnet-clock
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Clock
---

# HexGuard.Clock

## Summary

`IClock` abstraction replacing `DateTime.Now`/`DateTime.UtcNow` for testable date/time access. Every service that depends on the current time needs this for deterministic unit testing — without it, tests break on DST boundaries, time zones, and timing differences.

**Competition check:** `Microsoft.Extensions.Internal.ISystemClock` exists but is internal and deprecated. `NodaTime` is the full-featured alternative but heavy. This is a minimal `IClock` inspired by the deprecated Microsoft interface.

## Why Wide Adoption

Every service that touches timestamps, TTLs, expiration, or scheduling needs an injectable clock. Currently, apps use `DateTime.UtcNow` directly — untestable. Simple one-interface package addresses the most common dependency injection gap.

## Goals

1. Provide `IClock` interface with `UtcNow` and `Now` properties.
2. Provide `SystemClock` — production implementation wrapping `DateTimeOffset`.
3. Provide `FrozenClock` — test implementation with a fixed time, plus `Advance()`.
4. No dependencies beyond .NET BCL.

## Proposed Public API

```csharp
public interface IClock
{
    DateTimeOffset UtcNow { get; }
    DateTimeOffset Now { get; }
}

public sealed class SystemClock : IClock
{
    public static readonly SystemClock Instance = new();
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    public DateTimeOffset Now => DateTimeOffset.Now;
}

public sealed class FrozenClock : IClock
{
    public DateTimeOffset UtcNow { get; private set; }
    public DateTimeOffset Now => _zone is ITimeZoneProvider
        ? TimeZoneInfo.ConvertTime(UtcNow, _zone) : UtcNow;

    public FrozenClock(DateTimeOffset freezeAt);

    public void Advance(TimeSpan duration);
    public void Set(DateTimeOffset time);
}

// Registration
builder.Services.AddSingleton<IClock>(SystemClock.Instance);

// In tests
var clock = new FrozenClock(new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero));
services.AddSingleton<IClock>(clock);
clock.Advance(TimeSpan.FromHours(1)); // Simulate time passing
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Clock/` with standard `.csproj`.
2. Implement `IClock`, `SystemClock`, `FrozenClock`.
3. Add tests.
4. Register in `HexGuard.slnx`.
5. Publish as NuGet.
