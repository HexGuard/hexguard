---
id: feature-dotnet-telemetry
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Telemetry
---

# HexGuard.Telemetry

## Summary

OpenTelemetry zero-config — tracing, metrics, logging with opinionated defaults. One call replaces 50+ lines of OTel boilerplate.

## Proposed Public API

```csharp
builder.Services.AddHexGuardTelemetry(options => {
    options.EnableTracing = true;
    options.EnableMetrics = true;
    options.EnableLogging = true;
    options.ServiceName = "my-api";
    options.Exporters = TelemetryExporters.Otlp;
    options.OtlpEndpoint = "http://localhost:4317";
    options.SampleRate = 1.0;
    options.ExcludePaths = ["/health", "/metrics"];
});
// Auto-instruments: HTTP requests, EF Core queries, outgoing HTTP calls, custom metrics
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Telemetry/`.
2. Implement OTel auto-configuration with sensible defaults.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
