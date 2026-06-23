# Blazor Backlog

Blazor-specific package ideas and work items. Blazor is a new stack for HexGuard — these briefs
propose headless .NET Razor class libraries that solve common Blazor development problems.

## NuGet Ecosystem Check

All proposals were researched against NuGet.org (June 2026) before filing. Competition levels:

- **Greenfield** (zero packages) — BreakpointObserver, FormDrafts, IntersectionObserver,
  KeyboardShortcuts, LocalStorage, DebouncedInput
- **Served** (existing but outdated/niche) — FocusTrap (1 abandoned package)
- **Saturated** (many existing packages) — Pagination (30+ packages, 112k max downloads)
- **Dropped due to competition** — Pagination, ClickOutside, Confirmation

## Why Blazor?

Blazor is Microsoft's web UI framework using C# instead of JavaScript. It shares infrastructure with
the existing `dotnet/` workspace (`.NET 10`, `csproj`, NuGet packaging). Blazor packages follow the
same HexGuard philosophy: headless, minimal dependencies, narrow public API.

## Constraints

- Target `net10.0` (matching existing HexGuard .NET packages).
- Use `Microsoft.AspNetCore.Components` — the only required framework dependency.
- Minimize JavaScript interop (`IJSRuntime`) — JS-only features are opt-in, not required.
- Razor class library (`.Razor` + `.cs`) output as NuGet package.
- Follow `HexGuard.Blazor.{Name}` naming convention.
- Package ID format: `HexGuard.Blazor.{Name}`.
