---
id: feature-dotnet-consent
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Consent'
---

# HexGuard.Consent

## Summary

Consent record storage and enforcement for .NET — record user consent decisions, enforce consent gates, and provide consent audit history. GDPR/CCPA compliant consent management backend.

## Goals

- Consent category definition (necessary, analytics, marketing, functional)
- Record consent grants and withdrawals with timestamps
- Consent versioning (re-prompt on policy update)
- Consent enforcement middleware/attribute (block if consent missing)
- Consent audit trail with IP and user agent
- Consent export for data portability
- Integration with cookie consent
- EF Core persistence with query helpers

## Non-Goals

- No consent UI rendering
- No cookie scanning or classification
- No DSAR fulfillment (separate package)

## Proposed Public API

```csharp
public interface IConsentService
{
    Task RecordAsync(string userId, ConsentDecision decision, CancellationToken ct = default);
    Task<ConsentStatus> GetStatusAsync(string userId, CancellationToken ct = default);
    Task<bool> IsGrantedAsync(string userId, string category, CancellationToken ct = default);
    Task<IReadOnlyList<ConsentRecord>> GetHistoryAsync(string userId, CancellationToken ct = default);
    Task<ConsentExport> ExportAsync(string userId, CancellationToken ct = default);
    Task WithdrawAllAsync(string userId, CancellationToken ct = default);
    Task<bool> RequiresReconsentAsync(string userId, int currentVersion, CancellationToken ct = default);
}

public sealed record ConsentDecision(
    IReadOnlyDictionary<string, bool> Categories,
    int PolicyVersion,
    string? IpAddress = null,
    string? UserAgent = null
);

public sealed record ConsentStatus(
    IReadOnlyDictionary<string, bool> Categories,
    int AcceptedVersion,
    DateTimeOffset AcceptedAt,
    int CurrentVersion
);

// Consent enforcement
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RequireConsentAttribute : Attribute
{
    public string Category { get; init; } = "necessary";
}

// Registration
public static IServiceCollection AddHexGuardConsent(this IServiceCollection services,
    Action<ConsentOptions> configure);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Consent/` with `.csproj`.
2. Implement consent recording, enforcement middleware, audit trail, export.
3. Add EF Core persistence and RequireConsent attribute.
4. Add xunit tests. Register in `HexGuard.slnx`.
