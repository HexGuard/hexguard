---
id: feature-dotnet-policy-attestation
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.PolicyAttestation'
---

# HexGuard.PolicyAttestation

## Summary

Policy acceptance tracking for .NET — record when users accept terms, privacy policies, and EULAs, enforce acceptance gates, and maintain audit-ready records. Backend for compliance attestation.

## Goals

- Policy version management
- Record user acceptance with timestamp, IP, user agent
- Enforce acceptance gates (block access until accepted)
- Re-acceptance on policy update
- Mandatory vs. optional policy distinction
- Acceptance expiry and renewal
- Audit trail for compliance reviews
- Bulk acceptance recording (migration, admin action)

## Non-Goals

- No policy content management
- No e-signature verification
- No UI rendering

## Proposed Public API

```csharp
public interface IPolicyAttestationService
{
    Task<IReadOnlyList<Policy>> GetPoliciesAsync(string userId, CancellationToken ct = default);
    Task<IReadOnlyList<Policy>> GetPendingAsync(string userId, CancellationToken ct = default);
    Task AcceptAsync(string userId, string policyId, AcceptanceContext context, CancellationToken ct = default);
    Task AcceptAllAsync(string userId, AcceptanceContext context, CancellationToken ct = default);
    Task<bool> HasAcceptedAsync(string userId, string policyType, CancellationToken ct = default);
    Task<IReadOnlyList<AcceptanceRecord>> GetHistoryAsync(string userId, CancellationToken ct = default);
    Task<Policy> PublishVersionAsync(Policy policy, CancellationToken ct = default);
}

public sealed record Policy(
    string Id,
    string Type, // "terms", "privacy", "eula", "cookies", "custom"
    string Name,
    int Version,
    bool IsMandatory,
    int? ExpiresAfterDays,
    DateTimeOffset PublishedAt
);

public sealed record AcceptanceContext(
    string? IpAddress = null,
    string? UserAgent = null,
    string? AdditionalNotes = null
);

public sealed record AcceptanceRecord(
    string Id,
    string UserId,
    string PolicyId,
    string PolicyName,
    int Version,
    DateTimeOffset AcceptedAt,
    string? IpAddress,
    string? UserAgent
);

// Enforcement middleware
public static IApplicationBuilder UsePolicyAttestation(this IApplicationBuilder app,
    Action<PolicyAttestationOptions> configure);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.PolicyAttestation/` with `.csproj`.
2. Implement policy management, acceptance recording, enforcement middleware, audit trail.
3. Add EF Core persistence and expiry handling.
4. Add xunit tests. Register in `HexGuard.slnx`.
