---
id: feature-blazor-logging-setup
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.LoggingSetup'
---

# HexGuard.Blazor.LoggingSetup

## Summary

Pre-configured logging pipeline for Blazor — Serilog with console/file/SEQ sinks, OpenTelemetry tracing, and Blazor-specific enrichers. One call replaces 40+ lines of logging configuration.

## Problem

Setting up production-grade logging in Blazor requires: NuGet packages (Serilog, Serilog.Sinks.Console, Serilog.Sinks.File, Serilog.Sinks.Seq, OpenTelemetry), appsettings.json configuration, enrichers (machine name, thread ID, source context), level overrides per namespace, and Blazor-specific context (circuit ID, render mode, user ID). Most projects copy-paste the same setup.

## Goals

- Single `AddBlazorLogging()` call with sensible defaults
- Console sink (colored, compact) for development
- File sink (rolling, JSON) for production
- SEQ sink (structured log search) for diagnostics
- Blazor enrichers (CircuitId, RenderMode, UserId, PageUrl)
- OpenTelemetry trace export (OTLP)
- Environment-aware configuration from appsettings.json
- Client-side WASM logging with fallback to console

## Non-Goals

- No log viewer UI
- No log aggregation service
- No alerting rules

## Proposed Public API

```csharp
// Program.cs — one call
builder.AddBlazorLogging(options =>
{
    options.MinimumLevel = LogLevel.Information;
    options.EnrichWithCircuitId = true;
    options.EnrichWithUserId = true;
    options.Console = new ConsoleSinkOptions { Theme = ConsoleTheme.System };
    options.File = new FileSinkOptions
    {
        Path = "logs/blazor-.log",
        RollingInterval = RollingInterval.Day,
        RetainedFileCountLimit = 7
    };
    options.Seq = new SeqSinkOptions
    {
        ServerUrl = builder.Configuration["Seq:Url"]!,
        ApiKey = builder.Configuration["Seq:ApiKey"]
    };
    options.OpenTelemetry = new OtelOptions
    {
        Endpoint = builder.Configuration["Otel:Endpoint"],
        ServiceName = "MyBlazorApp"
    };
});

// WASM client-side logging
builder.Services.AddBlazorWasmLogging(options =>
{
    options.MinimumLevel = LogLevel.Warning;
    options.ForwardToServer = true; // send WASM logs to server via API
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.LoggingSetup/` with `.csproj` (RCL).
2. Implement Serilog configuration builder, Blazor enrichers, OTLP export.
3. Add WASM client-side logger with server forwarding.
4. Add xunit tests. Register in `HexGuard.slnx`.
