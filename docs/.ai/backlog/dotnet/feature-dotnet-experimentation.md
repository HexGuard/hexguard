---
id: feature-dotnet-experimentation
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Experimentation'
---

# HexGuard.Experimentation

## Summary

A/B testing and experimentation engine for .NET — experiment definition, variant assignment, exposure tracking, and result aggregation. For feature rollouts, UI experiments, and gradual migrations.

## Goals

- Experiment definition with variants and traffic allocation
- Consistent user-to-variant assignment (hash-based, sticky)
- Exposure/impression event tracking
- Experiment override for internal testing (query param, header, cookie)
- Result aggregation queries (conversion rate per variant)
- Experiment lifecycle (draft → running → paused → concluded)
- Statistical helpers (sample size, confidence)

## Non-Goals

- No results dashboard/visualization
- No multi-armed bandit (always use for now)
- No cross-session identity resolution

## Proposed Public API

```csharp
public interface IExperimentService
{
    Task<VariantAssignment> AssignAsync(string experimentKey, string userId, CancellationToken ct = default);
    Task TrackExposureAsync(string experimentKey, string userId, string variantKey, CancellationToken ct = default);
    Task TrackConversionAsync(string experimentKey, string userId, string metricName, double value = 1, CancellationToken ct = default);
    Task<ExperimentResult?> GetResultsAsync(string experimentKey, CancellationToken ct = default);
}

public sealed record VariantAssignment(
    string ExperimentKey,
    string VariantKey,
    bool IsControl,
    Dictionary<string, string> Parameters
);

public sealed record ExperimentResult(
    string ExperimentKey,
    IReadOnlyList<VariantStats> Variants,
    string? RecommendedVariant,
    double Confidence
);
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Experimentation/` with `.csproj`.
2. Implement assignment, exposure/conversion tracking, results.
3. Add override mechanism and EF Core persistence.
4. Add xunit tests for deterministic assignment, sticky variants.
5. Register in `HexGuard.slnx`, add to Sample API.
