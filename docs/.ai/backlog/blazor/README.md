# Blazor Backlog

Blazor-specific package ideas and work items. Blazor is a new stack for HexGuard — these briefs
propose headless .NET Razor class libraries that solve common Blazor development problems.

## Why Blazor?

Blazor is Microsoft's web UI framework using C# instead of JavaScript. It shares infrastructure with
the existing `dotnet/` workspace (`.NET 10`, `csproj`, NuGet packaging). Blazor packages follow the
same HexGuard philosophy: headless, minimal dependencies, narrow public API.

## Constraints

- Target `net10.0` (matching existing HexGuard .NET packages).
- Use `Microsoft.AspNetCore.Components` — the only required framework dependency.
- No JavaScript interop (`IJSRuntime`) in core APIs — JS-only features are opt-in.
- Razor class library (`.Razor` + `.cs`) output as NuGet package.
- Follow `HexGuard.Blazor.{Name}` naming convention.
- Package ID format: `HexGuard.Blazor.{Name}`.
